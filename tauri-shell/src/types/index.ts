export interface EditorTab {
    id: string;
    name: string;
    path: string;
    content: string;
    isDirty: boolean;
    isPinned: boolean;
}
