# Phase 6: Re-enabling Agent Capabilities

Now that the "Brain" is in Rust, we need to teach it how to use its hands. The current Agent can only chat. We will upgrade it to be a fully functional Agentic Coding Assistant.

## Objectives
1.  **Upgrade LLM Client**: Switch from `/api/generate` to `/api/chat` to support Chat History and **Tool Calling**.
2.  **Implement Core Tools (MCP)**:
    *   `read_file`: Allow agent to read code.
    *   `write_file`: Allow agent to edit code.
    *   `list_dir`: Allow agent to explore.
    *   `run_command`: Allow agent to run terminal commands.
3.  **Implement Agent Loop**: Update `agent.rs` to handle the "Think -> Act -> Observe" loop.
4.  **Fix Terminal**: Ensure the user can interact with the shell (critical for "run_command" visibility).

## Plan
- [ ] **Step 1: LLM Upgrade**
    - [ ] Modify `llm.rs` to use `/api/chat`.
    - [ ] Add `Message` struct (User, Assistant, System, Tool).
    - [ ] Add `Tool` definitions to the request.
- [ ] **Step 2: Tool Implementation**
    - [ ] Create `tools.rs` module.
    - [ ] Implement `FileTools` (read/write/list).
    - [ ] Implement `ShellTools` (run).
- [ ] **Step 3: The Agent Loop**
    - [ ] Update `Agent::process_message` to loop until done.
    - [ ] Handle tool calls returned by LLM.
    - [ ] Execute tools and feed output back to LLM.
- [ ] **Step 4: Terminal Fix**
    - [ ] Debug Tauri Shell permissions.
    - [ ] Ensure `xterm.js` frontend connects to Rust shell.
