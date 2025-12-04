# TASK-014: Custom Themes

**Status**: 🔴 Not Started  
**Phase**: UI Polish  
**Priority**: 🟢 LOW  
**Estimated Time**: 2 hours  
**Dependencies**: TASK-006 (Monaco Editor)

---

## 📋 Description

Allow users to create and import custom color themes for the editor.

---

## ✅ Acceptance Criteria

- [x] Theme editor UI ✅
- [x] Import/export themes (JSON format) ✅
- [x] Preview themes before applying ✅
- [x] Save custom themes to localStorage ✅
- [x] Include popular themes (Dracula, Monokai, etc.) ✅

---

## 📁 Files to Create

- `tauri-shell/src/components/ThemeEditor.tsx`
- `tauri-shell/src/utils/themes.ts`

---

## 🔧 Implementation Notes

Create theme editor with color pickers for:
- Background colors
- Text colors
- Syntax token colors
- UI element colors

Export as Monaco theme JSON.

---

## 🧪 Testing

- [ ] Theme editor opens
- [ ] Can modify colors
- [ ] Preview works
- [ ] Import/export works
- [ ] Themes persist

---

**Created**: December 2, 2025  
**Target Completion**: Week 4
