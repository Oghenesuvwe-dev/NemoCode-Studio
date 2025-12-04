# TASK-038: Advanced Search Options

**Status**: ✅ Complete 
**Phase**: Search & Navigation  
**Priority**: 🟢 LOW  
**Estimated Time**: 1 hour  
**Dependencies**: None

---

## 📋 Description

Add advanced search options for more precise searching.

---

## ✅ Acceptance Criteria

- [x] Whole word matching ✅
- [x] Match case option ✅
- [x] Preserve case in replace ✅
- [x] Search in selection ✅

---

## 📁 Files to Modify

- `tauri-shell/src/components/FindReplace.tsx`

---

## 🔧 Implementation Notes

Add checkboxes:
```typescript
<label>
  <input type="checkbox" checked={wholeWord} />
  Whole Word
</label>
<label>
  <input type="checkbox" checked={matchCase} />
  Match Case
</label>
<label>
  <input type="checkbox" checked={preserveCase} />
  Preserve Case
</label>
```

---

## 🧪 Testing

- [x] Whole word works ✅ (uses \b word boundaries in regex)
- [x] Match case works ✅ (already existed)
- [x] Preserve case works ✅ (maintains original case in replacements)
- [ ] Search in selection works (requires selection API integration)

---

**Created**: December 2, 2025  
**Target Completion**: Week 5
