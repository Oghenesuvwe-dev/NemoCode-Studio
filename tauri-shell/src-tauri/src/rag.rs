use std::sync::Arc;
use lancedb::connection::Connection;
use lancedb::connect;
use lancedb::query::{QueryBase, ExecutableQuery};
use ignore::WalkBuilder;
use crate::llm::LlmClient;
use std::fs;
use arrow::array::{RecordBatch, StringArray, Float32Array, FixedSizeListArray, RecordBatchIterator};
use arrow::datatypes::{DataType, Field, Schema};
use futures::TryStreamExt;

const EMBEDDING_DIM: i32 = 4096; // Llama 3.1 embedding size

pub struct RagSystem {
    conn: Connection,
}

impl RagSystem {
    pub async fn new(path: &str) -> Result<Self, String> {
        let conn = connect(path).execute().await.map_err(|e| e.to_string())?;
        Ok(Self { conn })
    }

    pub async fn index_directory(&self, path: &str, llm: &LlmClient) -> Result<(), String> {
        let walker = WalkBuilder::new(path)
            .standard_filters(true)
            .build();

        let table_name = "codebase";
        let schema = Arc::new(Schema::new(vec![
            Field::new("path", DataType::Utf8, false),
            Field::new("content", DataType::Utf8, false),
            Field::new("vector", DataType::FixedSizeList(
                Arc::new(Field::new("item", DataType::Float32, true)),
                EMBEDDING_DIM
            ), false),
        ]));

        // Create table if not exists
        let table = if self.conn.table_names().execute().await.map_err(|e| e.to_string())?.contains(&table_name.to_string()) {
            self.conn.open_table(table_name).execute().await.map_err(|e| e.to_string())?
        } else {
            let initial_batch = RecordBatch::new_empty(schema.clone());
            let batches = vec![initial_batch];
            let reader = RecordBatchIterator::new(batches.into_iter().map(Ok), schema.clone());
            self.conn.create_table(table_name, Box::new(reader))
                .execute().await.map_err(|e| e.to_string())?
        };

        for result in walker {
            match result {
                Ok(entry) => {
                    if entry.file_type().map(|ft| ft.is_file()).unwrap_or(false) {
                        let path = entry.path();
                        if let Ok(content) = fs::read_to_string(path) {
                            let chunks: Vec<&str> = content.lines().collect();
                            for chunk in chunks.chunks(20) { 
                                let text = chunk.join("\n");
                                if !text.trim().is_empty() {
                                    if let Ok(embedding) = llm.generate_embedding(&text).await {
                                        // Create RecordBatch for this chunk
                                        let path_array = StringArray::from(vec![path.to_str().unwrap()]);
                                        let content_array = StringArray::from(vec![text.clone()]);
                                        
                                        let vec_data = Float32Array::from(embedding);
                                        let vec_field = Arc::new(Field::new("item", DataType::Float32, true));
                                        let vec_array = FixedSizeListArray::try_new(
                                            vec_field,
                                            EMBEDDING_DIM,
                                            Arc::new(vec_data),
                                            None
                                        ).map_err(|e| e.to_string())?;

                                        let batch = RecordBatch::try_new(
                                            schema.clone(),
                                            vec![
                                                Arc::new(path_array),
                                                Arc::new(content_array),
                                                Arc::new(vec_array),
                                            ]
                                        ).map_err(|e| e.to_string())?;

                                        let batches = vec![batch];
                                        let reader = RecordBatchIterator::new(batches.into_iter().map(Ok), schema.clone());
                                        table.add(Box::new(reader)).execute().await.map_err(|e| e.to_string())?;
                                        println!("Indexed: {:?}", path);
                                    }
                                }
                            }
                        }
                    }
                }
                Err(err) => eprintln!("Error walking directory: {}", err),
            }
        }
        Ok(())
    }

    pub async fn search(&self, query: &str, llm: &LlmClient) -> Result<Vec<String>, String> {
        let table = self.conn.open_table("codebase").execute().await.map_err(|e| e.to_string())?;
        
        let embedding = llm.generate_embedding(query).await.map_err(|e| e.to_string())?;
        
        let mut results = table
            .query()
            .nearest_to(embedding)
            .map_err(|e| e.to_string())?
            .limit(5)
            .execute()
            .await
            .map_err(|e| e.to_string())?;

        let mut docs = Vec::new();
        while let Some(batch) = results.try_next().await.map_err(|e| e.to_string())? {
            let path_col = batch.column_by_name("path").ok_or("Missing path column")?;
            let content_col = batch.column_by_name("content").ok_or("Missing content column")?;
            
            let paths = path_col.as_any().downcast_ref::<StringArray>().ok_or("Invalid path column type")?;
            let contents = content_col.as_any().downcast_ref::<StringArray>().ok_or("Invalid content column type")?;

            for i in 0..batch.num_rows() {
                let path = paths.value(i);
                let content = contents.value(i);
                docs.push(format!("File: {}\nContent:\n{}", path, content));
            }
        }
        
        Ok(docs)
    }
}
