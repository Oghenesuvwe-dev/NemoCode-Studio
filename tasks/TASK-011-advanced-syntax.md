# TASK-011: Advanced Syntax Highlighting

**Status**: 🔴 Not Started  
**Phase**: UI Polish  
**Priority**: 🟡 MEDIUM  
**Estimated Time**: 3 hours  
**Dependencies**: TASK-006 (Monaco Editor)

---

## 📋 Description

Improve syntax highlighting with support for 20+ languages and semantic highlighting.

---

## ✅ Acceptance Criteria

- [x] Support 20+ programming languages ✅
- [x] Semantic highlighting for TypeScript/JavaScript ✅
- [x] Custom theme support ✅
- [x] Syntax error indicators ✅
- [x] Configurable color schemes ✅

---

## 📁 Files to Modify

- `tauri-shell/src/App.tsx`
- `tauri-shell/src/utils/themes.ts` (create)

---

## 🔧 Implementation Notes

Monaco Editor supports many languages by default. Configure:

```typescript
import * as monaco from 'monaco-editor';

// Register additional languages
monaco.languages.register({ id: 'python' });
monaco.languages.register({ id: 'rust' });
// ... etc

// Custom theme
monaco.editor.defineTheme('custom-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Custom token colors
  ],
  colors: {
    // Custom UI colors
  }
});
```

---

## 🧪 Testing

- [ ] Test 20+ languages
- [ ] Semantic highlighting works
- [ ] Custom themes apply
- [ ] Syntax errors show
- [ ] Performance is good

---

## 📝 Notes

- Monaco supports 50+ languages out of the box
- Semantic highlighting requires language server
- Consider adding popular themes (Dracula, Monokai, etc.)

---

**Created**: December 2, 2025  
**Target Completion**: Week 3
