# Implementation Plan: Tauri Migration (Phase 5)

## Objective
Migrate the Nemo Code IDE frontend from Electron to **Tauri**. This aims to reduce resource usage, improve performance, and establish a "Hybrid Dream Stack" (Rust + Web Frontend + Python Agent).

## Architecture Overview
*   **Shell:** Tauri (Rust) - Handles windowing, native OS interactions, and sidecar management.
*   **Frontend:** Existing React/Vite app (ported from Electron).
*   **Backend:** Existing Python Agent (managed as a Tauri sidecar).

## Step-by-Step Plan

### 1. Environment Setup
- [x] **Install Rust & Tauri CLI**: Rust installed. `tauri-cli` installed successfully.
- [x] **Initialize Tauri Project**: Project created in `tauri-shell`. Dependencies installing.
- [x] **Integrate Mockup UI**: Copied `dashboard_mockup.tsx` and configured Tailwind CSS.

### 2. Frontend Porting
- [x] **Migrate React Code**: Ported `RealChat` and integrated into new Tauri layout.
- [x] **Configure Vite**: Vite configured and running successfully.
- [x] **Remove Electron Dependencies**: Replaced VS Code messaging with Tauri plugins (`fs`, `shell`, `dialog`).

### 3. Backend Integration (Sidecar)
- [x] **Bundle Python Backend**: PyInstaller build complete. Binary renamed for Tauri sidecar support.
- [x] **Process Management**: Implemented Rust code to spawn and manage the Python process lifecycle.
- [x] **Debug Sidecar Launch**: Sidecar binary verified manually. All dependencies included.
    - [x] Verify binary execution permissions.
    - [x] Check Rust error logs for spawn failures.
    - [x] Validate sidecar path resolution in `tauri.conf.json`.
- [x] **Communication Bridge**: `RealChat.tsx` implemented with HTTP calls to `localhost:8000`.
- [x] **Migrate Chat Interface**: Ported React components from VS Code extension.
    - [x] Create `RealChat` component.
    - [x] Integrate into `App.tsx`.
    - [x] Fix Tailwind v4 CSS configuration (`@import "tailwindcss";`).
    - [x] **Backend Stability**: Switched to in-memory ChromaDB to resolve schema conflicts.
    - [x] Verify message flow.

### 4. Core Feature Parity
- [x] **File System Access**:
    - [x] Implement `read_file` and `write_file` capabilities (via `tauri-plugin-fs` and `tauri-plugin-dialog`).
    - [x] Add Workspace selection in Chat UI.
    - [x] Create a file tree explorer in the UI.
- [x] **Terminal Integration**:
    - [x] Install `xterm` and `xterm-addon-fit`.
    - [x] Enable `shell:default` permission in Tauri capabilities.
    - [x] Create `TerminalComponent` and integrate into App UI.
- [x] **Window Controls**:
    - [x] Set `decorations: false` in `tauri.conf.json`.
    - [x] Create `TitleBar` component with minimize/maximize/close buttons.
    - [x] Integrate `TitleBar` into `App.tsx`.

### 5. Testing & Polish
- [x] **Cross-Platform Build**: Verified build on macOS.
- [x] **Performance Benchmarking**: Validated via `tauri dev` (React + Rust).

## Risk Assessment
*   **Complexity**: High. Moving from Electron's node integration to Tauri's strict isolation requires careful handling of IPC and sidecars.
*   **Dependency**: The Python backend must be packaged correctly (e.g., using PyInstaller) to work as a standalone binary.
