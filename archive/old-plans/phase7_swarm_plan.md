# Phase 7: Agent Swarms Implementation Plan

## Objective
Implement a multi-agent system where a "Manager Agent" delegates tasks to specialized sub-agents (Reviewer, Coder, DevOps). This allows for parallel execution and specialized expertise.

## Architecture
- **Manager Agent**: The entry point. Analyzes the user request and creates a plan. Delegates steps to sub-agents.
- **Sub-Agents**:
    - **Coder**: specialized in writing/editing code.
    - **Reviewer**: specialized in reading code and finding bugs/security issues.
    - **DevOps**: specialized in terminal commands, docker, and deployment.
- **Orchestrator**: A Python class that manages the lifecycle of these agents and message passing.

## Step-by-Step Plan

### 1. Backend: Swarm Orchestrator
- [ ] **Define Agent Classes**: Create `CoderAgent`, `ReviewerAgent`, `DevOpsAgent` classes inheriting from a base `BaseAgent`.
- [ ] **Implement Orchestrator**: Create `SwarmOrchestrator` to route messages.
- [ ] **Update /chat Endpoint**: Modify `server.py` to use the Orchestrator instead of the single `NemotronAgent` when appropriate (e.g., if `swarm_mode=True`).

### 2. Backend: Inter-Agent Communication
- [ ] **Message Protocol**: Define a standard JSON format for agent-to-agent messages (sender, recipient, content, status).
- [ ] **Delegation Logic**: Update `ManagerAgent` system prompt to allow it to "call" other agents using a tool (e.g., `delegate_to_coder`).

### 3. Frontend: Swarm UI
- [ ] **Real-Time Status**: Connect the existing Agent Manager UI in `App.tsx` to real backend events.
- [ ] **Streaming Logs**: Ensure logs from *specific* agents appear in their respective cards.
- [ ] **Visual Output**: Implement the "Visual Output" area for agents to show artifacts (e.g., Reviewer shows a diff, DevOps shows a build status).

## Risk Assessment
- **Complexity**: Debugging multi-agent interactions can be hard.
- **Latency**: Multiple LLM calls will increase response time. *Mitigation: Parallel execution where possible.*
- **Loops**: Agents might get into infinite loops talking to each other. *Mitigation: Max turn limit.*
