# NemoCode IDE - Manual Testing Checklist

**Version**: 1.0  
**Last Updated**: December 2, 2025  
**Current Build**: 63% Complete (82/131 tasks)

---

## 🎯 Testing Overview

This checklist covers all 82 completed features across 7 phases. Each test should be performed and marked with ✅ (pass) or ❌ (fail).

---

## Phase 1: Editor Core (17 features)

### Find & Replace
- [ ] Open file with Cmd+O
- [ ] Press Cmd+F to open Find dialog
- [ ] Search for text - verify highlighting
- [ ] Use Find Next/Previous buttons
- [ ] Press Cmd+H to open Replace dialog
- [ ] Replace single occurrence
- [ ] Replace all occurrences
- [ ] Test regex search (e.g., `\d+`)
- [ ] Test case-sensitive toggle
- [ ] Close dialog with Esc

### Format Document
- [ ] Open a JS/TS file
- [ ] Press Shift+Alt+F to format
- [ ] Verify code is formatted
- [ ] Test with CSS file
- [ ] Test with JSON file
- [ ] Enable Format on Save in command palette
- [ ] Make changes and save - verify auto-format
- [ ] Create .prettierrc file with custom config
- [ ] Verify custom config is applied

### Go to Line
- [ ] Open file with 100+ lines
- [ ] Press Cmd+G
- [ ] Enter line number
- [ ] Verify jump to line
- [ ] Verify line is highlighted
- [ ] Test with invalid line number

### Go to Definition
- [ ] Open TypeScript file
- [ ] Cmd+Click on function name
- [ ] Verify jump to definition
- [ ] Press F12 on variable
- [ ] Verify jump to definition
- [ ] Test with no definition found
- [ ] Verify toast notification

### File Tabs
- [ ] Open multiple files
- [ ] Switch between tabs
- [ ] Pin a tab (click pin icon)
- [ ] Try to close pinned tab - verify prevented
- [ ] Unpin tab
- [ ] Close tab with X button
- [ ] Close tab with unsaved changes - verify confirmation
- [ ] Test "Close All" command
- [ ] Test "Close Others" command

### Undo/Redo
- [ ] Make changes to file
- [ ] Press Cmd+Z to undo
- [ ] Verify change is undone
- [ ] Press Cmd+Shift+Z to redo
- [ ] Verify change is redone
- [ ] Test multiple undo/redo operations

### Breadcrumbs
- [ ] Open file in nested folder
- [ ] Verify breadcrumb path is shown
- [ ] Click on folder in breadcrumb
- [ ] Verify navigation works

### File Changed Banner
- [ ] Open file in external editor
- [ ] Modify and save externally
- [ ] Verify banner appears in IDE
- [ ] Click "Reload" - verify file updates
- [ ] Modify externally again
- [ ] Click "Dismiss" - verify banner closes

### Status Bar
- [ ] Open file
- [ ] Verify line/column number updates
- [ ] Verify total lines shown
- [ ] Verify file size shown (B/KB/MB)
- [ ] Verify language detected correctly
- [ ] Verify encoding shown (UTF-8)
- [ ] Verify connection status indicator

---

## Phase 2: Terminal (12 features)

### Terminal Tabs
- [ ] Click "+" to create new terminal
- [ ] Verify new tab appears
- [ ] Switch between terminal tabs
- [ ] Close terminal tab with X
- [ ] Verify terminal is destroyed

### Terminal Split
- [ ] Click horizontal split button
- [ ] Verify terminal splits side-by-side
- [ ] Click in each pane - verify focus
- [ ] Close split view
- [ ] Click vertical split button
- [ ] Verify terminal splits top/bottom
- [ ] Test commands in each pane

### Terminal Context Menu
- [ ] Right-click in terminal
- [ ] Verify context menu appears
- [ ] Select text and click "Copy"
- [ ] Click "Paste" - verify paste works
- [ ] Click "Select All"
- [ ] Click "Clear Terminal"
- [ ] Click "New Terminal"

### Terminal Operations
- [ ] Type command and press Enter
- [ ] Verify command executes
- [ ] Use Up arrow for history
- [ ] Verify previous command appears
- [ ] Select text with mouse
- [ ] Copy with Cmd+C
- [ ] Paste with Cmd+V
- [ ] Scroll through output
- [ ] Click "Clear" button
- [ ] Click "Kill" button

---

## Phase 3: Search & Navigation (13 features)

### Global Search
- [ ] Press Cmd+Shift+F
- [ ] Enter search term
- [ ] Verify results appear grouped by file
- [ ] Click on result
- [ ] Verify file opens at correct line
- [ ] Test regex search
- [ ] Test case-sensitive search
- [ ] Search for non-existent term
- [ ] Verify "No results" message

### Symbol Search
- [ ] Press Cmd+T
- [ ] Type function name
- [ ] Verify symbols appear
- [ ] Use arrow keys to navigate
- [ ] Press Enter to select
- [ ] Verify jump to symbol
- [ ] Test with class name
- [ ] Test with interface name
- [ ] Test fuzzy matching

### Quick Open
- [ ] Press Cmd+P
- [ ] Type partial filename
- [ ] Verify fuzzy matching works
- [ ] Use arrow keys to navigate
- [ ] Press Enter to open
- [ ] Test with non-existent file

### Recent Files
- [ ] Press Cmd+E
- [ ] Verify recent files list
- [ ] Select file from list
- [ ] Verify file opens
- [ ] Open 20+ files
- [ ] Verify only last 20 shown

### Find in File
- [ ] Press Cmd+F
- [ ] Search for text
- [ ] Verify matches highlighted
- [ ] Click "Find Next"
- [ ] Click "Find Previous"
- [ ] Test with no matches

---

## Phase 4: File Operations (11 features)

### File Tree Operations
- [ ] Click "Open Folder" button
- [ ] Select workspace folder
- [ ] Verify file tree loads
- [ ] Expand/collapse folders
- [ ] Click file to open
- [ ] Right-click file for context menu

### File Creation
- [ ] Click "New File" button
- [ ] Enter filename
- [ ] Press Enter
- [ ] Verify file created
- [ ] Click "New Folder" button
- [ ] Enter folder name
- [ ] Verify folder created

### File Deletion
- [ ] Right-click file
- [ ] Click "Delete"
- [ ] Verify confirmation dialog
- [ ] Confirm deletion
- [ ] Verify file removed

### File Rename
- [ ] Right-click file
- [ ] Click "Rename"
- [ ] Enter new name
- [ ] Verify file renamed

### Drag & Drop
- [ ] Drag file to different folder
- [ ] Verify file moves
- [ ] Drag file to same location
- [ ] Verify no change

### File Save
- [ ] Make changes to file
- [ ] Press Cmd+S
- [ ] Verify file saved
- [ ] Verify unsaved indicator removed
- [ ] Close file without saving
- [ ] Verify confirmation dialog

---

## Phase 5: UI Polish (15 features)

### Theme Switcher
- [ ] Open command palette (Cmd+Shift+P)
- [ ] Type "Theme: Dark"
- [ ] Verify dark theme applied
- [ ] Switch to "Theme: Light"
- [ ] Verify light theme applied
- [ ] Switch to "Theme: High Contrast"
- [ ] Verify high contrast theme applied
- [ ] Reload IDE
- [ ] Verify theme persisted

### Toast Notifications
- [ ] Trigger success action (e.g., save file)
- [ ] Verify green success toast
- [ ] Trigger error action
- [ ] Verify red error toast
- [ ] Trigger warning action
- [ ] Verify yellow warning toast
- [ ] Verify toast auto-dismisses
- [ ] Click X to dismiss manually

### Progress Bar
- [ ] Trigger file operation
- [ ] Verify progress bar appears
- [ ] Verify progress updates
- [ ] Verify completion state

### Confirm Dialog
- [ ] Trigger delete action
- [ ] Verify confirmation dialog
- [ ] Click "Cancel"
- [ ] Verify action cancelled
- [ ] Trigger delete again
- [ ] Check "Don't ask again"
- [ ] Click "Confirm"
- [ ] Trigger delete again
- [ ] Verify no dialog (if implemented)

### Tooltip
- [ ] Hover over button
- [ ] Verify tooltip appears after delay
- [ ] Verify keyboard shortcut shown
- [ ] Move mouse away
- [ ] Verify tooltip disappears

### Keyboard Shortcuts Panel
- [ ] Press Cmd+Shift+P
- [ ] Type "Keyboard Shortcuts"
- [ ] Verify panel opens
- [ ] Verify all shortcuts listed
- [ ] Press Esc to close

### Loading Overlay
- [ ] Trigger long operation
- [ ] Verify loading spinner appears
- [ ] Verify operation completes
- [ ] Verify spinner disappears

### Animations
- [ ] Open toast notification
- [ ] Verify slide-up animation
- [ ] Open modal dialog
- [ ] Verify fade-in animation
- [ ] Close modal
- [ ] Verify smooth transition

---

## Phase 6: Backend (7 features)

### Connection Monitoring
- [ ] Start IDE with backend running
- [ ] Verify green connection indicator
- [ ] Stop backend
- [ ] Verify red connection indicator
- [ ] Verify toast notification
- [ ] Restart backend
- [ ] Verify reconnection detected

### API Retry Logic
- [ ] Stop backend
- [ ] Trigger API call
- [ ] Verify retry attempts
- [ ] Verify error message after retries
- [ ] Restart backend
- [ ] Verify next call succeeds

### Response Caching
- [ ] Make API call
- [ ] Make same call again
- [ ] Verify faster response (cached)
- [ ] Wait 5+ minutes
- [ ] Make call again
- [ ] Verify cache expired

### Error Logging
- [ ] Check backend/logs/ directory
- [ ] Verify log files exist
- [ ] Trigger error
- [ ] Check error log file
- [ ] Verify error logged
- [ ] Verify JSON format

---

## Phase 7: UX & Accessibility (11 features)

### Keyboard Navigation
- [ ] Use Tab to navigate UI
- [ ] Verify focus indicators
- [ ] Use arrow keys in lists
- [ ] Use Enter to select
- [ ] Use Esc to close dialogs
- [ ] Test all keyboard shortcuts

### Confirmation Dialogs
- [ ] Trigger destructive action
- [ ] Verify confirmation required
- [ ] Test "Don't ask again" checkbox
- [ ] Verify preference saved

### Loading States
- [ ] Trigger file save
- [ ] Verify loading indicator
- [ ] Trigger file load
- [ ] Verify loading indicator
- [ ] Verify indicators clear on completion

### Error Messages
- [ ] Trigger various errors
- [ ] Verify clear error messages
- [ ] Verify actionable suggestions
- [ ] Verify toast notifications

### Context Menus
- [ ] Right-click in terminal
- [ ] Verify context menu
- [ ] Right-click in file tree
- [ ] Verify context menu
- [ ] Click outside to close

---

## 🎯 Performance Testing

### File Operations
- [ ] Open file < 1KB - should be instant
- [ ] Open file 100KB - should be < 500ms
- [ ] Open file 1MB - should be < 2s
- [ ] Open file 10MB - should show warning
- [ ] Save file - should be < 500ms
- [ ] Search in 100 files - should be < 2s
- [ ] Search in 1000 files - should be < 5s

### UI Responsiveness
- [ ] Type in editor - no lag
- [ ] Switch tabs - instant
- [ ] Open dialogs - smooth animation
- [ ] Scroll long files - smooth
- [ ] Resize window - responsive

### Memory Usage
- [ ] Open IDE - check initial memory
- [ ] Open 10 files - check memory
- [ ] Open 50 files - check memory
- [ ] Close all files - verify memory released
- [ ] Run for 1 hour - check for leaks

---

## 🐛 Error Scenarios

### Network Errors
- [ ] Disconnect network
- [ ] Trigger API call
- [ ] Verify error handling
- [ ] Verify retry logic
- [ ] Reconnect network
- [ ] Verify recovery

### File System Errors
- [ ] Try to open non-existent file
- [ ] Verify error message
- [ ] Try to save to read-only location
- [ ] Verify error message
- [ ] Delete file externally while open
- [ ] Verify handling

### Invalid Input
- [ ] Enter invalid line number in Go to Line
- [ ] Verify error handling
- [ ] Enter invalid search regex
- [ ] Verify error message
- [ ] Enter invalid filename
- [ ] Verify validation

---

## 📱 Responsive Design

### Window Sizes
- [ ] Test at 1920x1080
- [ ] Test at 1366x768
- [ ] Test at 2560x1440
- [ ] Test at minimum size (800x600)
- [ ] Verify all UI elements visible
- [ ] Verify no overflow issues

### Panel Resizing
- [ ] Resize left sidebar
- [ ] Resize right sidebar
- [ ] Resize bottom panel
- [ ] Verify smooth resizing
- [ ] Verify content adapts

---

## ✅ Test Results Summary

### Pass/Fail Count
- Total Tests: ___
- Passed: ___
- Failed: ___
- Skipped: ___

### Critical Issues Found
1. 
2. 
3. 

### Minor Issues Found
1. 
2. 
3. 

### Performance Issues
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 

---

## 📝 Notes

### Testing Environment
- OS: ___________
- Browser: ___________
- Screen Resolution: ___________
- Backend Version: ___________
- Frontend Version: ___________

### Tester Information
- Name: ___________
- Date: ___________
- Duration: ___________

---

**Status**: Ready for testing  
**Next Steps**: Complete checklist and document issues
