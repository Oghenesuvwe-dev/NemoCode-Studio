# NemoCode IDE — Roadmap

Future plans and enhancement priorities.

---

## Current Focus: Stability Release

Complete the remaining Phase 2 tasks to achieve a stable, production-ready IDE.

See [PRIORITY_TASKS.md](./PRIORITY_TASKS.md) for the detailed checklist.

---

## Immediate Priority

### Editor Core

| Feature | Description | Status |
|---------|-------------|--------|
| Find/Replace | Cmd+F search with regex support | ⏳ Pending |
| Format Document | Prettier integration | ⏳ Pending |
| Go to Line | Cmd+G jump to line | ⏳ Pending |
| Multi-cursor | Cmd+Click, Cmd+D | ⏳ Pending |
| Code Folding | Collapse functions/classes | ⏳ Pending |
| Bracket Matching | Highlight matching pairs | ⏳ Pending |
| Split Editor | Side-by-side editing | ⏳ Pending |

### Terminal

| Feature | Description | Status |
|---------|-------------|--------|
| Terminal Tabs | Multiple terminal instances | ⏳ Pending |
| Terminal Split | Horizontal/vertical split | ⏳ Pending |
| Command History | Up/down arrow navigation | ⏳ Pending |
| Shell Selector | Choose bash/zsh/fish | ⏳ Pending |

### Search & Navigation

| Feature | Description | Status |
|---------|-------------|--------|
| Global Search | Cmd+Shift+F across files | ⏳ Pending |
| Go to Definition | Cmd+Click on symbol | ⏳ Pending |
| Symbol Search | Cmd+T fuzzy search | ⏳ Pending |
| Recent Files | Cmd+E quick access | ⏳ Pending |

---

## Short Term (v1.1)

### UI Polish

| Feature | Description |
|---------|-------------|
| Syntax Highlighting | Monaco Editor or Prism.js |
| Theme Switcher | Dark, Light, High Contrast |
| Status Bar | Line/col, encoding, language, git branch |
| Minimap | Code overview on right side |
| Breadcrumbs | File path navigation |
| Loading States | Spinners, skeletons, progress |

### Backend Stability

| Feature | Description |
|---------|-------------|
| WebSocket Reconnection | Auto-reconnect on disconnect |
| Connection Indicator | Show backend status in UI |
| Request Timeout | 30s timeout with retry |
| Response Caching | 5 min TTL for repeated queries |
| Memory Profiling | Fix leaks in agent loop |

### UX Improvements

| Feature | Description |
|---------|-------------|
| Keyboard Shortcuts Help | Document all shortcuts |
| Confirmation Dialogs | Delete, close unsaved, clear |
| Error Messages | Clear, actionable, with suggestions |
| Tooltips | Shortcut hints on hover |

---

## Medium Term (v1.5)

### Git Integration

| Feature | Description |
|---------|-------------|
| Git Panel | Dedicated sidebar section |
| Commit | Stage and commit changes |
| Diff View | Visual file changes |
| Branch Switcher | Create, switch, merge |
| Push/Pull | Sync with remote |
| Conflict Resolution | Merge conflict UI |

### Debug Panel

| Feature | Description |
|---------|-------------|
| Breakpoints | Set/remove in gutter |
| Watch Variables | Monitor values |
| Call Stack | Execution trace |
| Step Controls | Over, into, out |
| Console | Debug output |

### Agent Manager

| Feature | Description |
|---------|-------------|
| Restart Agent | Recover from crashes |
| Configure Agent | Settings modal |
| Export Logs | Save to file |
| Filter Logs | By level (error, warn, info) |
| Task Queue | View pending tasks |
| Priority Setting | High/medium/low |

---

## Long Term (v2.0)

### Browser Architecture (Dual-Browser System)

The IDE uses two separate browser systems for different purposes:

---

**1. Built-in Browser (WebKit) — Inside the IDE**

| Aspect | Detail |
|--------|--------|
| Engine | WebKit (non-Chromium) via Tauri WebView |
| Location | Browser panel inside the IDE |
| Purpose | View web content without leaving the IDE |
| Use Cases | Preview localhost apps, view documentation, render HTML output |
| Control | User browses manually or agent displays content |

---

**2. Desktop Browser Control (Playwright) — User's Local Browser**

| Aspect | Detail |
|--------|--------|
| Engine | User's installed browser (Chrome, Firefox, etc.) via Playwright |
| Location | Opens real browser window on user's desktop |
| Purpose | Agent performs web-based tasks that require a real browser |
| Use Cases | Google searches, open GitHub repos, fill web forms, login to sites |
| Control | Agent controls the browser, user watches actions in real-time |

---

**Why Two Browsers?**

| Built-in (WebKit) | Desktop (Playwright) |
|-------------------|----------------------|
| Lightweight, integrated | Full browser capabilities |
| Quick previews | Complex web interactions |
| Non-Chromium, fast | Real browser compatibility |
| Display only | Click, type, navigate, submit |
| Inside IDE window | Separate desktop window |

**Example Scenarios:**

- "Preview my React app" → Built-in browser shows localhost:3000
- "Search Google for React hooks tutorial" → Agent opens Chrome, searches, returns results
- "Open my GitHub repo and create an issue" → Agent controls desktop browser
- "Show me the MDN docs for fetch" → Built-in browser displays the page

**Implementation Status:**

| Feature | Status |
|---------|--------|
| Built-in WebKit preview | ✅ Implemented |
| Playwright scrape/screenshot | 🟡 Partial |
| Desktop browser control (clicks, forms) | ⏳ Planned |
| Real-time visibility of agent's browser | ⏳ Planned |

### AI Model Specialization

Assign different models to different agent roles for optimal performance.

| Agent | Recommended Model | Purpose |
|-------|-------------------|---------|
| Manager | Llama 3.1 70B | Planning, task decomposition |
| Coder | Qwen 2.5 Coder 32B | Code generation, refactoring |
| Reviewer | GPT-4o | Bug detection, security audit |
| DevOps | Llama 3.1 8B | Fast command execution |

### Voice Input

| Feature | Description |
|---------|-------------|
| Speech-to-Text | Web Speech API |
| Microphone Toggle | Start/stop listening |
| Visual Feedback | Pulsing indicator |
| Wake Word | "Hey Nemo" (future) |

### Advanced Visualizations

| Feature | Description |
|---------|-------------|
| Interactive Graph | Click nodes to open files |
| Code Flow Diagram | Execution path visualization |
| Dependency Tree | Import/export relationships |
| Performance Flame Graph | Profiling visualization |

### Infrastructure

| Feature | Description |
|---------|-------------|
| Remote Backend | Connect to GPU server |
| Docker Sandbox | Isolated code execution |
| Secrets UI | Manage API keys in settings |
| Plugin System | Third-party extensions |

---

## Future Enhancements

### MCP Tool Expansion

| Category | Tools |
|----------|-------|
| Monitoring | Sentry, Datadog, PagerDuty |
| DevOps | Kubernetes, Cloudflare, Ansible |
| Data | Postgres, Redis, Snowflake |
| Design | Figma, Storybook, Framer Motion |
| Communication | Slack, Discord, Gmail |
| Project | Jira, Linear, Notion |

### Collaboration

| Feature | Description |
|---------|-------------|
| Multi-user Editing | Real-time cursor sync |
| Comments | Inline code comments |
| Share Session | Invite link |
| Presence | See who's online |

### Cloud Features

| Feature | Description |
|---------|-------------|
| Cloud Sync | Settings, history, snippets |
| Deployment History | Track past deploys |
| Environment Manager | Dev, staging, prod |
| Cost Monitoring | Cloud spend tracking |

### Mobile

| Feature | Description |
|---------|-------------|
| Companion App | View code on phone |
| Push Notifications | Build status, errors |
| Quick Actions | Approve, reject, restart |

---

## Not Planned

These features are explicitly out of scope:

- Full VS Code extension compatibility
- Electron-based desktop app
- Self-hosted cloud version
- Enterprise SSO (for now)
- Paid features or subscriptions

---

## Contributing

Want to help? Pick a task from [PRIORITY_TASKS.md](./PRIORITY_TASKS.md) and submit a PR.

Priority areas:
1. Editor core features (Find/Replace, Format)
2. Terminal enhancements
3. Search & navigation
4. Documentation improvements

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.1.0 | 2025-11 | Initial Tauri + React setup |
| 0.2.0 | 2025-11 | Phase 1 complete (essential features) |
| 0.3.0 | 2025-12 | Phase 3-4 complete (enterprise, AI) |
| 0.4.0 | TBD | Phase 2 complete (editor core) |
| 1.0.0 | TBD | Stable release |
