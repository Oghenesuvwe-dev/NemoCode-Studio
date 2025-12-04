# Phase 11: Enterprise Infrastructure (Scale & Security) Implementation Plan

## Objective
Transition the IDE from a local prototype to a scalable, secure, enterprise-ready system. This involves decoupling the frontend from the local backend and securing agent execution.

## Features

### 1. Remote Backend Connection
- **Goal**: Allow the Tauri frontend to connect to a remote Python backend (e.g., a powerful GPU server or cloud instance).
- **Implementation**:
    - **Config**: Add a `config.json` or Settings UI to specify the Backend URL (default: `http://localhost:8000`).
    - **Auth**: Implement simple API Key authentication for the remote connection.

### 2. Docker Sandboxing
- **Goal**: Execute agent code and commands inside an isolated Docker container to prevent accidental damage to the host system.
- **Implementation**:
    - **Tool Update**: Modify `run_command` in `agent.py` to use `docker exec` if a `SANDBOX_MODE` flag is set.
    - **Container**: Create a `Dockerfile` for the execution environment (Python/Node.js pre-installed).

### 3. Secrets Management
- **Goal**: Securely store and use API keys (AWS, GitHub, Jira) without hardcoding them.
- **Implementation**:
    - **Vault**: Use a local `.env` file (managed via UI) or system keychain.
    - **Injection**: Inject secrets into the agent's environment variables only during execution.

## Step-by-Step Plan

### Step 1: Remote Configuration
- [ ] Create `SettingsContext` in frontend to manage `backendUrl`.
- [ ] Update `RealChat.tsx` and other components to use the dynamic `backendUrl`.
- [ ] Add a "Settings" modal/tab to configure the URL.

### Step 2: Docker Sandbox
- [ ] Create `sandbox/Dockerfile`.
- [ ] Create `sandbox/docker-compose.yml`.
- [ ] Update `agent.py` to check `SANDBOX_MODE`.
- [ ] Implement `DockerTool` wrapper.

### Step 3: Secrets UI
- [ ] Add "Secrets" section to the Settings tab.
- [ ] Implement backend endpoint `/secrets` (encrypted storage).

## Dependencies
- `docker` (CLI)
- `python-dotenv`
