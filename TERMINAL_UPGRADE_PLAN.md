# Terminal Upgrade Plan

This document outlines the roadmap for upgrading the NemoCode IDE terminal to a production-grade, stable, and feature-rich component.

## Group 1: Core Stability & Architecture
- [x] **Robust Resizing Sync**: Implement a strict protocol to synchronize frontend (xterm.js) dimensions with backend (PTY) dimensions to prevent text scrambling.
- [x] **Async I/O Buffering**: Optimize the Rust PTY read loop to handle high-throughput output without freezing.
- [ ] **Zombie Process Cleanup**: Ensure `close_pty` reliably kills the process tree.
- [ ] **Proper Signal Handling**: Verify `Ctrl+C`, `Ctrl+Z` behavior.

## Group 2: Advanced Shell Integration
- [x] **Working Directory Support**: Allow spawning terminals in specific directories (e.g., project root).
- [x] **Shell Environment Loading**: Ensure user profiles (`.zshrc`, `.bashrc`) are loaded by using login shells where appropriate.
- [ ] **Command Injection**: Add capability to send text/commands to the terminal programmatically (e.g., for "Run Code" features).

## Group 3: Performance & Rendering
- [x] **WebGL Rendering**: Integrate `@xterm/addon-webgl` for GPU-accelerated rendering (60 FPS scrolling).
- [ ] **Ligature Support**: Enable font ligatures.
- [ ] **Custom Fonts**: Allow user configuration of font family and size.

## Group 4: UI/UX "VS Code" Parity
- [x] **Clickable Links**: Integrate `@xterm/addon-web-links` to detect and open URLs/files.
- [ ] **Theme Synchronization**: deeply integrate IDE theme colors into the terminal.
- [x] **Tabs & Split Improvements**: Refine the sidebar tab UI and split pane behavior.
- [x] **Find in Terminal**: Ensure the search addon is fully functional and styled.
