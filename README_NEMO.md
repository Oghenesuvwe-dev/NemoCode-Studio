# 🚀 Nemo Code Agentic IDE

**The Supercharged, AI-First IDE for the Future.**

Nemo Code is not just a text editor; it's an **Agentic IDE** where the AI is a first-class citizen. It doesn't just autocomplete code; it plans, executes, scrapes, manages cloud resources, and heals itself.

---

## ✨ Key Capabilities

### 🧠 1. Autonomous Agent ("The Manager")
*   **Planning Loop**: Ask Nemo to `/plan Build a Todo App`, and it will generate a step-by-step execution plan.
*   **Auto-Execution**: Use `/execute` to have the agent autonomously perform the next step in the plan.
*   **Self-Healing**: If a build fails, Nemo detects the error, analyzes the diagnostics, and proposes a fix automatically.

### 🕷️ 2. Research & Learning ("Live RAG")
*   **Web Browsing**: The agent can browse the web using **Playwright** to read documentation, StackOverflow, or libraries.
*   **Live Learning**: Command the agent to `learn_action` from a URL (e.g., "Learn from https://docs.astro.build"). It scrapes the page, ingests it into its vector database, and immediately answers questions based on that new knowledge.

### ☁️ 3. Cloud Command Center
*   **AWS Integration**: Manage your cloud resources directly from the chat.
    *   "List my EC2 instances"
    *   "Show my S3 buckets"
*   **Infrastructure as Code (IaC)**:
    *   **Generate**: "Create a Terraform template for an RDS database."
    *   **Validate**: "Validate my terraform configuration." (Runs `terraform validate` and explains errors).

### 🐳 4. DevOps Dashboard
*   **Docker View**: See running containers, their status, and image names in the sidebar.
*   **Kubernetes View**: Monitor your current cluster context, node count, and connection status.
*   **Git Integration**: Full Git UI with sync, push, pull, and branch status.

### 🛠️ 5. Advanced Tooling
*   **MCP Client**: Built-in support for the **Model Context Protocol**, allowing connection to external tools (Postgres, Slack, etc.) in a standardized way.
*   **VIM Mode**: Integrated VIM keybindings for power users.
*   **Visual Diff**: Review AI code suggestions with a clear "Accept/Reject" diff view before applying them.

---

## 🚀 Getting Started

### Prerequisites
*   **Ollama**: Installed and running (`ollama serve`).
*   **Model**: `llama3.1` (or compatible model) pulled.
*   **Python 3.10+**: For the backend.
*   **Node.js**: For the VS Code extension.
*   **Terraform**: (Optional) For IaC features (`brew install terraform`).

### Installation
1.  **Clone & Setup**:
    ```bash
    ./start.sh
    ```
    This script will:
    *   Check for Ollama.
    *   Set up the Python backend (`backend/venv`).
    *   Install dependencies (`playwright`, `boto3`, etc.).
    *   Launch the IDE.

### Configuration
*   **AWS Credentials**: Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in your environment to enable Cloud features.
*   **Azure/GCP**: (Coming Soon) Set respective environment variables.

---

## 🤖 Usage Guide

### Chat Commands
| Command | Description |
| :--- | :--- |
| `/plan <goal>` | Create a step-by-step plan for a complex task. |
| `/execute` | Execute the next step in the active plan. |
| `Learn from <url>` | Scrape a website and add it to the agent's knowledge base. |
| `Check <cloud>` | List resources for AWS/Azure (e.g., "Check my EC2s"). |

### Keyboard Shortcuts
*   `Cmd+L` (or `Ctrl+L`): Open Nemotron Chat.
*   `Cmd+Shift+P`: Open Command Palette (Standard VS Code).

---

## 🔮 Future Roadmap (Enhancements)

*   **Turbo Mode**: A "God Mode" toggle to run the entire plan without asking for confirmation between steps.
*   **Enterprise Connectors**: Pre-built MCP servers for Jira, Linear, and Salesforce.
*   **Multi-Agent Swarm**: Separate agents for "Architect", "Coder", and "QA" working in parallel.
*   **Voice Mode**: Talk to Nemo directly.

---

**Built with ❤️ by the Google Deepmind Team.**
