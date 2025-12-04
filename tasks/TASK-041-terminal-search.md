# TASK-041: Terminal Search

**Status**: ✅ Complete  
**Phase**: Terminal  
**Priority**: 🟢 LOW  
**Estimated Time**: 1 hour  
**Dependencies**: None

---

## 📋 Description

Add search functionality to terminal output.

---

## ✅ Acceptance Criteria

- [x] Cmd+F in terminal to open search ✅
- [x] Highlight matches in terminal ✅
- [x] Navigate between matches (Enter/Shift+Enter) ✅
- [x] Case-sensitive option ✅
- [x] Close with Esc ✅

---

## 📁 Files to Modify

- `tauri-shell/src/components/TerminalComponent.tsx`

---

## 🔧 Implementation Notes

xterm.js has built-in search addon:
```typescript
import { SearchAddon } from 'xterm-addon-search';

const searchAddon = new SearchAddon();
terminal.loadAddon(searchAddon);

// Use searchAddon.findNext() and findPrevious()
```

---

## 🧪 Testing

- [x] Cmd+F opens search ✅
- [x] Matches highlight ✅ (via xterm SearchAddon)
- [x] Navigation works ✅ (Enter/Shift+Enter)
- [x] Case-sensitive works ✅ (xterm SearchAddon default)
- [x] Esc closes ✅

---

**Created**: December 2, 2025  
**Target Completion**: Week 5
