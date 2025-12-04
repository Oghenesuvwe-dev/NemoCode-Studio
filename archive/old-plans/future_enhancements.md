# 🔮 Future Enhancement Plan: AI Model Specialization

> **Objective**: Optimize agent performance by assigning specialized AI models to specific roles, moving away from the current "one size fits all" (Llama 3.1) approach.

---

## 1. Current Architecture (Phase 13)
*   **Model**: `Llama 3.1` (via Ollama) is used for **all** agents.
*   **Differentiation**: Agents are distinguished only by their **System Prompts**.
*   **Pros**: Simple setup, low resource footprint (single model loaded).
*   **Cons**: "Jack of all trades, master of none." A generalist model may struggle with complex refactoring (Coder) or subtle bug detection (Reviewer).

---

## 2. Target Architecture (Phase 14+)
We will implement a **Multi-Model Orchestration** layer that dynamically routes requests to the best model for the job.

### 🧠 Manager Agent (The Planner)
*   **Role**: High-level reasoning, task decomposition, delegation.
*   **Recommended Model**: **Llama 3.1 70B** or **Claude 3.5 Sonnet**.
*   **Why**: Needs a large context window and superior logic to track complex project states without getting lost.

### 💻 Coder Agent (The Builder)
*   **Role**: Writing syntax-perfect code, refactoring, implementing features.
*   **Recommended Model**: **Qwen 2.5 Coder (32B)** or **DeepSeek Coder V2**.
*   **Why**: These models are fine-tuned specifically on massive code datasets and outperform generalist models on benchmarks like HumanEval.

### 🕵️ Reviewer Agent (The Auditor)
*   **Role**: Finding bugs, security vulnerabilities, and logic errors.
*   **Recommended Model**: **GPT-4o** or **Mistral Large**.
*   **Why**: Requires high attention to detail and "common sense" to spot subtle logical flaws that code-specific models might miss.

### ⚡ DevOps Agent (The Operator)
*   **Role**: Running terminal commands, managing Docker, deployment.
*   **Recommended Model**: **Llama 3.1 8B** or **Mistral Nemo**.
*   **Why**: Speed is key. DevOps tasks are usually short and imperative ("restart the server", "list pods"). A smaller, faster model reduces latency.

---

## 3. Implementation Strategy

### Step 1: Model Registry Update
Update `backend/agent.py` to allow per-agent model configuration in `config.json` or user settings.

```json
{
  "agents": {
    "manager": { "model": "llama3.1:70b" },
    "coder": { "model": "qwen2.5-coder:latest" },
    "reviewer": { "model": "gpt-4o" },
    "devops": { "model": "llama3.1:latest" }
  }
}
```

### Step 2: Dynamic Loading
Implement a "Model Manager" in the backend that can swap models in/out of VRAM (if running locally) or route API calls (if remote) on the fly.

### Step 3: User UI
Add a "Model Matrix" in the Settings panel, allowing users to assign their downloaded Ollama models to specific agents via dropdowns.

---

## 4. IDE Superpowers & Capabilities

### ⚡ Demi Mode ("Demigod Mode")
> *The Agent has high-level control, but respects the User as the ultimate God.*
*   **Concept**: The Agent can control the environment (Terminal, Browser, Files) like a "Demigod", but dangerous actions (deleting root files, deploying to prod) require "Divine Intervention" (User Approval).
*   **Implementation**:
    *   **Read/Write**: Safe (Auto-approved).
    *   **System/Deploy**: Restricted (Requires Confirmation that are granted by the Turbo allow policy).

### 🎮 Current Superpowers
The IDE currently possesses the following "Hands":

1.  **Dual Browser System**

    **A. Built-in Browser (WebKit) — Inside the IDE**
    *   **Engine**: **WebKit** (non-Chromium) via Tauri WebView.
    *   **Location**: Browser panel inside the IDE window.
    *   **Purpose**: View web content without leaving the IDE.
    *   **Use Cases**: Preview localhost apps, view documentation, render HTML output.
    *   **Control**: User browses manually, or agent displays content to user.

    **B. Desktop Browser Control (Playwright) — User's Local Machine**
    *   **Engine**: User's installed browser (Chrome, Firefox, etc.) via Playwright.
    *   **Location**: Opens a real browser window on user's desktop.
    *   **Purpose**: Agent performs web-based tasks that require a real browser.
    *   **Use Cases**: Google searches, open GitHub repos, fill web forms, login to sites, submit data.
    *   **Control**: Agent controls the browser programmatically.
    *   **Visibility**: User watches the agent's browser actions in real-time.
    *   **Status**: Partial (scrape/screenshot working, full control planned).

    **Why Two Browsers?**
    *   Built-in browser is lightweight and stays inside the IDE (WebKit, non-Chromium).
    *   Desktop browser control uses the user's real browser for full web compatibility.
    *   Agent can perform real-world web tasks: search, navigate, fill forms, interact.
    *   Separation keeps IDE fast while enabling powerful browser automation.

    **Example Scenarios:**
    *   "Preview my React app" → Built-in browser shows localhost:3000
    *   "Search Google for how to use useEffect" → Agent opens Chrome, searches, returns results
    *   "Open my GitHub repo and create a new issue" → Agent controls desktop browser
    *   "Show me the Tailwind docs" → Built-in browser displays the page

2.  **Terminal Control (Shell)**
    *   **Capability**: Can execute *any* command available in the user's shell (`zsh`/`bash`). This includes installing packages (`npm`, `pip`), running builds, and managing files.
    *   **Desktop Control**: Can technically modify system settings via CLI (e.g., `defaults write` on Mac), but is not explicitly trained to do so for safety.
3.  **Cloud Control (AWS/Terraform)**
    *   **Capability**: Can list EC2 instances, S3 buckets, and validate Terraform configurations.
4.  **Container Control (Docker)**
    *   **Capability**: Can list, start, and stop Docker containers.

### 🚀 Future Superpowers (MCP Roadmap)
We will expand capabilities by integrating the following **MCP Servers**. These are *not* hardcoded tools but dynamic extensions.

#### 🛡️ Monitoring & Debugging
*   **Sentry**: Fetch stack traces, list recent issues, auto-assign bugs.
*   **Datadog**: Check metrics, query logs.
*   **PagerDuty**: Acknowledge incidents.

#### 🚢 DevOps & Infrastructure
*   **Kubernetes (Helm/Kubectl)**: Deploy charts, rollback releases, inspect pods.
*   **Cloudflare**: Manage DNS records, purge cache.
*   **Ansible**: Run playbooks for local machine configuration (fixing desktop settings safely).

#### 💾 Data & Storage
*   **Postgres/MySQL**: Safe, read-only SQL querying for data inspection.
*   **Redis**: Inspect cache keys.
*   **Snowflake**: Data warehousing queries.

#### 🎨 Design & Product*
**  assess read and write typescript codes in figma
*   **Figma**: Read design tokens, export assets.
*   **Jira/Linear**: Create tickets, update statuses (already partially supported).
*   **Notion/Confluence**: Read/Write documentation.

#### 💬 Communication
*   **Slack/Discord**: Send notifications, summarize threads.
*   **Gmail**: Draft emails (e.g., release announcements).


To fix UI lag and stability issues in a VS Code-compatible IDE built with a
Tauri frontend and Python sidecar (handling AI/MCP), you must address orphaned sidecar processes ("zombies"), IPC (Inter-Process Communication) bottlenecks, and main-thread blocking.
Here is a walkthrough to stabilize the application and best practices for enterprise readiness.
Phase 1: Stability Fixes (The "Hanging" & "Zombie" Issue)
The most common cause of "hanging" in Tauri/Python apps is that the Python sidecar (often packaged with PyInstaller) fails to close when the main app closes. This leaves "zombie" processes that consume RAM/CPU and block ports on restart.
1. Fix Phantom Python Processes
PyInstaller creates two processes: a bootloader (parent) and your script (child). Standard kill() commands often only kill the parent, leaving the script running.

    The Fix: You must terminate the entire process tree.
    Implementation: In your Rust backend (main.rs), implement a window_event listener for the Destroyed event. Do not rely on the default sidecar cleanup.
        Rust: Use a crate like sysinfo to find the child process of your sidecar and kill it explicitly before the app exits.
        Python: Add a "heartbeat" thread in your Python script. If the connection to the Tauri frontend (standard input/output) is silent for 5 seconds, the Python script should sys.exit(0) automatically.

2. Unblock the UI (Main Thread)
If the IDE "lags" while the AI types, you are likely flooding the frontend with events or processing data on the UI thread.

    Debounce Streaming: Do not emit an event for every single token generated by the AI. Buffer tokens in the Python sidecar or Rust backend and send them in chunks (e.g., every 50ms or 10-20 tokens).
    Offload MCP Tool Calls: When the AI calls an MCP tool (e.g., "search_codebase"), this must happen asynchronously in the Rust/Python backend. The UI should only receive a "Tool executing..." status update, never waiting synchronously for the result.

Phase 2: Improving Responsiveness
1. Optimize IPC (Inter-Process Communication)
Sending massive text contexts (for LLMs) via JSON over Tauri's IPC is slow.

    Use Binary Payloads: If sending file contents or images, use MsgPack or raw bytes instead of standard JSON serialization.
    Action: Profile your IPC payload size. If a payload exceeds 1MB, stream it or write it to a temporary file and pass the path.

2. Handle Rate Limits Gracefully
As seen with Antigravity, hitting rate limits causes "death loops."

    Exponential Backoff: If the AI model returns a 429 (Too Many Requests), your Python sidecar must catch this and wait (retrying with exponential backoff) rather than crashing or freezing the UI.
    UI Feedback: Immediately show a "Rate limit reached, pausing..." toast notification so the user doesn't think the app has crashed.

Phase 3: Enterprise Readiness Best Practices
To move from a prototype to an enterprise-ready product, follow these pillars:
1. Security & Compliance

    Sidecar Allowlist: Your tauri.conf.json allows executing binaries. Lock this down. Ensure your Python sidecar can only accept commands from your frontend, not from external scripts.
    Signed Binaries: Enterprise security software (CrowdStrike, Windows Defender) will block unsigned Python executables. You must sign your binaries (EV Code Signing Certificate) for both Windows and macOS (Notarization) in your CI/CD pipeline.
    Secrets Management: Never store API keys in plaintext. Use the OS Keyring (via a Rust crate like keyring) to store user credentials securely.

2. MCP (Model Context Protocol) Optimization

    Cache Tool Definitions: Do not fetch the list of available MCP tools on every single chat turn. Cache them at startup and only refresh if the user installs a new tool.
    Context Pruning: Large codebases bloat the context window, causing lag and high costs. Implement a "Context Manager" in Python that summarizes or truncates files before sending them to the model.

3. Observability (Telemetry)

    Structured Logging: If the Python sidecar crashes, the user sees nothing. Implement OpenTelemetry in your Python script to log errors to a local file or a centralized dashboard (e.g., Sentry/Datadog).
    Crash Reporting: Automatically detect if the sidecar exits with a non-zero code and offer to "Restart AI Service" in the UI without requiring a full app restart.

4. CI/CD & Distribution

    Automated Builds: Use GitHub Actions to build the Rust frontend and PyInstaller sidecar in parallel.
    Updater Loop: Enable Tauri's built-in updater. Enterprise users require predictable, versioned updates, not "silent" web-like changes that break workflows.

Summary Checklist
Area	Action Item	Impact
Stability	Implement "Heartbeat" checks in Python sidecar.	Prevents zombie processes.
Performance	Debounce/Chunk AI streaming tokens (50ms).	Fixes UI typing lag.
Architecture	Move MCP Tool execution to background threads.	Prevents UI freezing during tasks.
Security	Sign binaries (Windows/macOS) & use OS Keyring.	Prevents antivirus blocking.
Reliability	Add "Restart Service" button in UI.	Recovers from crashes without restart.
