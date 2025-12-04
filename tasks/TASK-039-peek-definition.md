# TASK-039: Peek Definition

**Status**: 🔴 Not Started  
**Phase**: Search & Navigation  
**Priority**: 🟢 LOW  
**Estimated Time**: 2 hours  
**Dependencies**: TASK-006 (Monaco Editor)

---

## 📋 Description

Show definition in inline popup without navigating away.

---

## ✅ Acceptance Criteria

- [x] Alt+F12 to peek definition ✅
- [x] Show definition in inline popup ✅
- [x] Navigate between multiple definitions ✅
- [x] Edit in peek window ✅
- [x] Close with Esc ✅

---

## 📁 Files to Create

- `tauri-shell/src/components/PeekDefinition.tsx`

---

## 🔧 Implementation Notes

Use Monaco's peek widget:
```typescript
editor.addCommand(
  monaco.KeyMod.Alt | monaco.KeyCode.F12,
  () => {
    editor.getAction('editor.action.peekDefinition').run();
  }
);
```

---

## 🧪 Testing

- [ ] Alt+F12 opens peek
- [ ] Definition shows
- [ ] Can edit in peek
- [ ] Esc closes
- [ ] Multiple definitions work

---

**Created**: December 2, 2025  
**Target Completion**: Week 5
