# TASK-040: File Comparison/Diff

**Status**: 🔴 Not Started  
**Phase**: File Operations  
**Priority**: 🟢 LOW  
**Estimated Time**: 3 hours  
**Dependencies**: TASK-006 (Monaco Editor)

---

## 📋 Description

Compare two files side-by-side with diff highlighting.

---

## ✅ Acceptance Criteria

- [x] Select two files to compare ✅
- [x] Show diff view (side-by-side) ✅
- [x] Highlight changes (added/removed/modified) ✅
- [x] Navigate between changes ✅
- [x] Merge changes option ✅

---

## 📁 Files to Create

- `tauri-shell/src/components/FileDiff.tsx`

---

## 🔧 Implementation Notes

Use Monaco diff editor:
```typescript
import { DiffEditor } from '@monaco-editor/react';

<DiffEditor
  original={originalContent}
  modified={modifiedContent}
  language="javascript"
/>
```

---

## 🧪 Testing

- [ ] Diff view shows
- [ ] Changes highlighted
- [ ] Navigation works
- [ ] Merge works
- [ ] Performance is good

---

**Created**: December 2, 2025  
**Target Completion**: Week 5
