import requests
import time
import os
import shutil

BASE_URL = "http://localhost:8000"
TEST_DIR = os.path.join(os.getcwd(), "test_workspace")

def setup():
    if os.path.exists(TEST_DIR):
        shutil.rmtree(TEST_DIR)
    os.makedirs(TEST_DIR)
    print(f"Created test directory: {TEST_DIR}")

def test_build_todo_app():
    print("Sending request to build Todo App...")
    
    prompt = f"""
    I want you to build a simple HTML/JS Todo App in the folder '{TEST_DIR}'.
    It should have:
    1. An index.html file with a clean UI.
    2. A style.css file for styling.
    3. A script.js file for logic (add, remove, toggle tasks).
    
    Please write these files now.
    """
    
    payload = {
        "prompt": prompt,
        "model": "llama3.1",
        "workspace_path": TEST_DIR,
        "turbo_mode": True # Enable turbo to just do it
    }
    
    try:
        response = requests.post(f"{BASE_URL}/chat", json=payload)
        response.raise_for_status()
        data = response.json()
        print("Agent Response:", data.get("response", "")[:100] + "...")
        
        # Verify files
        expected_files = ["index.html", "style.css", "script.js"]
        for f in expected_files:
            path = os.path.join(TEST_DIR, f)
            if os.path.exists(path):
                print(f"✅ Verified {f} exists.")
            else:
                print(f"❌ Missing {f}!")
                
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    setup()
    # Wait for server to be ready
    try:
        requests.get(BASE_URL)
        test_build_todo_app()
    except:
        print("Server not running. Please start server.py first.")
