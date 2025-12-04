# 🚀 Nemo Code IDE 2.0 - "Next Level" Upgrade

The Nemo Code IDE has been upgraded with a powerful new React-based UI and advanced agentic capabilities.

## ✨ New Features

### 1. 🧠 Multi-Model Intelligence
*   **Model Selector**: You can now switch between models (e.g., `llama3.1`, `gpt-4`, `claude-3`) directly from the chat interface.
*   **Dynamic Fetching**: The IDE automatically detects models installed via Ollama.

### 2. 👁️ Context Awareness
*   **@file Mentions**: Type `@` followed by a filename (e.g., `@server.py`) to explicitly add it to the agent's context.
*   **Context Menu**: Right-click any file in the Explorer and select **"Add to Nemotron Context"**.

# 🚀 Nemo Code IDE - Release Notes

---

## ☁️ Phase 13: The Connected Era (Current)
**Status:** ✅ **Released**

The IDE has evolved from a local tool into a **Cloud-Native Powerhouse**.

### 🔌 **Universal Cloud Connectors (MCP)**
> *Connect to AWS, Azure, Google Cloud, and more without leaving your editor.*
- **What it does**: Uses the **Model Context Protocol** to securely connect to external services.
- **How to use**: Go to **Settings > Connectors** and add a provider (e.g., `npx -y @modelcontextprotocol/server-aws`).
- **Benefit**: Your agent can now "see" your S3 buckets, "list" your EC2 instances, and "query" your Postgres database.

### 🤝 **Real-Time Collaboration**
> *Google Docs-style multiplayer coding.*
- **What it does**: Allows multiple users (or you + the Agent) to edit the same file simultaneously.
- **How to use**: Click the **Users Icon** in the sidebar to open the Collaborative Editor.
- **Benefit**: Watch the Agent type code in real-time, or pair program with a colleague over the local network.

### 🚀 **One-Click Deployment**
> *From Localhost to Production in seconds.*
- **What it does**: Automatically detects your project type (Next.js, Static, Worker) and deploys it.
- **Supported Platforms**:
    - ▲ **Vercel** (Next.js / React)
    - ⚡ **Cloudflare** (Workers)
    - 💠 **Netlify** (Static Sites)
    - ☁️ **Render** (Full Stack)
- **How to use**: Click the green **🚀 DEPLOY** button in the Title Bar.

### 🧠 **"Brain & Hands" Architecture**
> *Never wait for the AI again.*
- **What it does**: Decouples the Agent's "thinking" from its "doing".
- **Benefit**: The UI remains responsive while the Agent executes long-running tasks in the background.
- **Safety**: Includes **Persistence** (crash recovery) and **Graceful Interruption** (stop button).

---

## 📦 Phase 12: Polish & Quality (Previous)
**Status:** ✅ **Released**

---

## 🛠️ Feature Inventory & UI Guide

### 🖥️ User Interface (UI)
| Component | Status | Description | Enhancement Opportunity |
| :--- | :--- | :--- | :--- |
| **Chat Interface** | ✅ Active | Main interaction hub. Supports @mentions, slash commands. | Add "Reply" threads for branching conversations. |
| **Terminal Panel** | ✅ Active | Read-only view of agent commands + Interactive shell. | Add multiple tabs and split panes. |
| **Graph View** | ✅ Active | Visualizes file dependencies. | Add interactivity (click node to open file). |
| **Kanban Board** | ✅ Active | Visualizes the Agent's plan. | Allow drag-and-drop reordering of steps. |
| **Browser Preview** | ✅ Active | Shows web apps running on localhost. | Add "Device Emulation" (Mobile/Tablet view). |
| **Connectors Tab** | ✅ Active | Manage MCP servers. | Add a "Marketplace" to browse available MCP servers. |
| **Deploy Button** | ✅ Active | One-click deployment. | Add a "Deployment History" dropdown. |

### 🧰 Agent Tools (The "Hands")
| Tool | Type | Capabilities | Future Enhancement (MCP) |
| :--- | :--- | :--- | :--- |
| **BrowserTool** | Native | Scrape, Screenshot, Render JS. | **Selenium/Puppeteer**: Full interaction (clicks, form fills). |
| **CloudTool** | Native | AWS (EC2/S3) Read-Only. | **AWS MCP**: Full management (Create/Delete resources). |
| **IaCTool** | Native | Terraform Validate. | **Terraform MCP**: `plan` and `apply` with safety checks. |
| **DockerTool** | Native | List/Start/Stop Containers. | **Kubernetes MCP**: Helm charts, Pod logs. |
| **SecretsManager** | Native | Secure Env Var injection. | **Vault MCP**: HashiCorp Vault integration. |
| **DeploymentManager** | Native | Detects Vercel/Netlify/Render. | **GitHub Actions**: Trigger workflows directly. |

---

## 🎮 How to Use

1.  **Restart the IDE**: Run `./start.sh` to load the new extension.
2.  **Open Chat**: Click the Robot icon in the sidebar.
3.  **Select Model**: Choose your preferred model from the dropdown.
4.  **Start Coding**:
    *   *Chat*: "Explain this code."
    *   *Context*: "Fix the bug in @utils.py."
    *   *Plan*: "/plan Create a new REST API for users."



    Preventing Data Loss via "Retry"
Noting user is offline  by loss of internet connection and Offline status.

Here is how this feature enhances data loss prevention:

1. The Problem: "The Black Hole"
In current LLM interfaces, if your internet drops or your computer crashes while the AI is generating a long response or executing a complex plan:

The Stream Breaks: The connection closes.
The Context Vanishes: The AI might have finished "thinking" on the server, but your client never received it.
The State is Corrupt: You are left with a half-written file or a half-finished plan.
2. The Solution: "Stateful Resume"
By implementing a robust Retry/Resume System, we ensure:

Brain & Hands Architecture (Background Worker)
Graceful Interruption
Data Integrity Foundation (The "Retry" capability enabled by the Task Queue).

Persistence: Every "Thought" and "Action" generated by the backend is saved to a local database (SQLite/JSON) before it is sent to the UI.


Enjoy your new Agentic IDE! 🚀
