# TASK-013: Inline Hints

**Status**: 🔴 Not Started  
**Phase**: UI Polish  
**Priority**: 🟢 LOW  
**Estimated Time**: 2 hours  
**Dependencies**: TASK-006 (Monaco Editor)

---

## 📋 Description

Add inline parameter hints and type hints for better code understanding.

---

## ✅ Acceptance Criteria

- [x] Show parameter names in function calls ✅
- [x] Show type hints for variables ✅
- [x] Configurable on/off ✅
- [x] Non-intrusive display ✅
- [x] Works with TypeScript/JavaScript ✅

---

## 📁 Files to Modify

- `tauri-shell/src/App.tsx`

---

## 🔧 Implementation Notes

Enable Monaco inlay hints:

```typescript
<Editor
  options={{
    inlayHints: {
      enabled: true,
      fontSize: 12,
      fontFamily: 'monospace',
    },
    // ... other options
  }}
/>
```

---

## 🧪 Testing

- [ ] Parameter hints appear
- [ ] Type hints appear
- [ ] Toggle works
- [ ] Not too intrusive

---

**Created**: December 2, 2025  
**Target Completion**: Week 4
