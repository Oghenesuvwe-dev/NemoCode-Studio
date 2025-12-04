# TASK-035: Replace in Files

**Status**: ✅ Complete  
**Phase**: Search & Navigation  
**Priority**: 🟡 MEDIUM  
**Estimated Time**: 2 hours  
**Dependencies**: None

---

## 📋 Description

Add replace functionality to global search for batch replacements.

---

## ✅ Acceptance Criteria

- [x] Add "Replace" button in search results ✅
- [x] Replace single occurrence ✅
- [x] Replace all in file ✅
- [x] Replace all in workspace ✅
- [x] Confirmation dialog for replace all ✅

---

## 📁 Files to Modify

- `tauri-shell/src/components/GlobalSearch.tsx`

---

## 🔧 Implementation Notes

Add replace UI:
```typescript
<input 
  placeholder="Replace with..."
  value={replaceText}
/>
<button onClick={replaceOne}>Replace</button>
<button onClick={replaceAll}>Replace All</button>
```

Add confirmation for replace all.

---

## 🧪 Testing

- [x] Replace one works ✅
- [x] Replace all in file works ✅
- [x] Replace all in workspace works ✅
- [x] Confirmation shows ✅
- [ ] Undo works (requires file history/git integration)

---

**Created**: December 2, 2025  
**Target Completion**: Week 5
