# 🛠️ Tool Enrichment Briefing

> **Current Status**: The IDE is equipped with a modern, "Agentic" toolset. It favors **Playwright** over Selenium and **MCP** over hardcoded integrations.

---

## 1. Current Tool State

### 🌐 Browser Automation
*   **Tool**: **Playwright** (`backend/browser_tool.py`)
*   **Status**: ✅ **Active**
*   **Why not Selenium?**: Playwright is faster, handles modern dynamic web apps (React/Vue) better, and has superior headless performance.
*   **Capabilities**:
    *   `scrape_url`: Reads documentation and web pages.
    *   `screenshot`: Takes visual snapshots for the agent.
    *   `dynamic`: Renders JavaScript before scraping.

### ☁️ Cloud & Infrastructure
*   **Tool**: **AWS Boto3** (`backend/cloud_tool.py`) + **Terraform** (`iac_tool.py`)
*   **Status**: ✅ **Active**
*   **Capabilities**:
    *   **AWS**: List EC2 instances, S3 buckets.
    *   **Terraform**: Validate configurations, generate templates.
*   **Helm/Kubernetes**: ❌ **Not currently native**. The agent can run `helm` commands via the terminal, but has no specialized tool wrapper yet.

### 📊 Monitoring & Debugging
*   **Tool**: None (Sentry/Datadog not integrated).
*   **Status**: ❌ **Missing**
*   **Impact**: The agent cannot currently "check Sentry for recent errors" to auto-debug production issues.

### 🔌 The Universal Connector (MCP)
*   **Tool**: **Model Context Protocol** (`backend/mcp_client.py`)
*   **Status**: ✅ **Active**
*   **Role**: The gateway to *everything else*. Instead of hardcoding Sentry or Helm, we connect to their MCP servers.

---

## 2. Best Practices for Enrichment

### 🏆 Rule #1: Don't Hardcode, Use MCP
*   **Old Way**: Writing a `sentry_tool.py` class in the backend.
*   **New Way**: Running a local MCP server (e.g., `@modelcontextprotocol/server-sentry`).
*   **Why**:
    *   **Security**: Credentials live in the MCP server process, not the IDE.
    *   **Updates**: You can update the Sentry tool without updating the IDE.
    *   **Stability**: If the Sentry tool crashes, it doesn't take down the IDE.

### 📦 Rule #2: Sandbox Dangerous Tools
*   **Context**: Tools like **Helm** or **Kubectl** have high privileges.
*   **Practice**: Ensure these tools run inside the **Docker Sandbox** (Phase 11) or have strict confirmation prompts before execution.

### 👁️ Rule #3: Visual Feedback
*   **Context**: When an agent uses a tool like Selenium/Playwright.
*   **Practice**: Show a "Browser Preview" window (Phase 10) so the user sees what the agent sees. Don't run headless browsers completely in the dark.

---

## 3. Recommended Next Enrichments

| Tool | Category | Integration Method | Benefit |
| :--- | :--- | :--- | :--- |
| **Sentry** | Debugging | **MCP** | Allow agent to fetch stack traces and auto-fix bugs. |
| **Helm** | DevOps | **CLI Wrapper** | Allow agent to deploy/rollback K8s charts. |
| **Postgres** | Database | **MCP** | Safe SQL querying and schema inspection. |
| **Figma** | Design | **MCP** | Read design tokens and generate CSS automatically. |
