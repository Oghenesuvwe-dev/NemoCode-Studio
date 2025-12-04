# Next Actions - Nemo Code IDE Stability Implementation

**Current Status**: App.tsx refactored and building successfully ✅  
**Next Phase**: Implement search features and keyboard shortcuts  
**Estimated Time**: 8-12 hours

---

## 🎯 Immediate Next Steps (Priority Order)

### 1. Implement Find/Replace Feature (2-3 hours)
**File**: `tauri-shell/src/components/FindReplace.tsx`

**What to do**:
- [ ] Create modal dialog for find/replace
- [ ] Add regex support
- [ ] Add case-sensitive toggle
- [ ] Add "Replace All" button
- [ ] Highlight matches in editor
- [ ] Keyboard shortcut: Cmd+F (find), Cmd+H (replace)

**Code Template**:
```typescript
interface FindReplaceProps {
  isOpen: boolean;
  onClose: () => void;
  onFind: (text: string, regex: boolean, caseSensitive: boolean) => void;
  onReplace: (text: string, replacement: string) => void;
}

const FindReplace: React.FC<FindReplaceProps> = ({ isOpen, onClose, onFind, onReplace }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  return (
    <div className="modal">
      {/* Find input */}
      {/* Replace input */}
      {/* Buttons: Find, Replace, Replace All */}
      {/* Toggles: Regex, Case Sensitive */}
    </div>
  );
};
```

### 2. Implement Go to Line Feature (1-2 hours)
**File**: `tauri-shell/src/components/GoToLine.tsx`

**What to do**:
- [ ] Create modal with line number input
- [ ] Jump to line in editor
- [ ] Highlight the line
- [ ] Keyboard shortcut: Cmd+G

**Code Template**:
```typescript
interface GoToLineProps {
  isOpen: boolean;
  onClose: () => void;
  totalLines: number;
  onGoToLine: (line: number) => void;
}

const GoToLine: React.FC<GoToLineProps> = ({ isOpen, onClose, totalLines, onGoToLine }) => {
  const [lineNumber, setLineNumber] = useState('');

  return (
    <div className="modal">
      <input
        type="number"
        placeholder={`Enter line number (1-${totalLines})`}
        value={lineNumber}
        onChange={(e) => setLineNumber(e.target.value)}
      />
      <button onClick={() => onGoToLine(parseInt(lineNumber))}>Go</button>
    </div>
  );
};
```

### 3. Implement Global Search (2-3 hours)
**File**: `tauri-shell/src/components/GlobalSearch.tsx`

**What to do**:
- [ ] Create search input
- [ ] Search across all files in workspace
- [ ] Show results grouped by file
- [ ] Click result to jump to file/line
- [ ] Keyboard shortcut: Cmd+Shift+F

**Code Template**:
```typescript
interface SearchResult {
  file: string;
  line: number;
  column: number;
  text: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  workspacePath: string;
  onResultSelect: (result: SearchResult) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, workspacePath, onResultSelect }) => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = async (text: string) => {
    // Call backend API to search
    const response = await fetch('http://localhost:8000/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: text, path: workspacePath }),
    });
    const data = await response.json();
    setResults(data.results);
  };

  return (
    <div className="modal">
      <input
        type="text"
        placeholder="Search files..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="results">
        {results.map((result) => (
          <div key={`${result.file}:${result.line}`} onClick={() => onResultSelect(result)}>
            {result.file}:{result.line} - {result.text}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 4. Implement Quick Open (1-2 hours)
**File**: `tauri-shell/src/components/QuickOpen.tsx`

**What to do**:
- [ ] Create file search dialog
- [ ] Fuzzy matching for file names
- [ ] Show recent files first
- [ ] Click to open file
- [ ] Keyboard shortcut: Cmd+P

### 5. Implement Symbol Search (1-2 hours)
**File**: `tauri-shell/src/components/SymbolSearch.tsx`

**What to do**:
- [ ] Search for functions, classes, variables
- [ ] Show symbol type (function, class, etc.)
- [ ] Jump to symbol definition
- [ ] Keyboard shortcut: Cmd+T

### 6. Wire Up Keyboard Shortcuts in App.tsx (1-2 hours)
**File**: `tauri-shell/src/App.tsx`

**What to do**:
- [ ] Add keyboard event listeners for all shortcuts
- [ ] Show/hide modals based on shortcuts
- [ ] Pass correct props to components
- [ ] Test all shortcuts

**Shortcuts to implement**:
```
Cmd+F   → Find
Cmd+H   → Replace
Cmd+G   → Go to Line
Cmd+P   → Quick Open
Cmd+Shift+F → Global Search
Cmd+T   → Symbol Search
Cmd+B   → Toggle Sidebar (already done)
Cmd+?   → Show Keyboard Shortcuts
```

---

## 📋 Implementation Checklist

### Phase 1: Search Features (4-6 hours)
- [ ] Find/Replace modal
- [ ] Go to Line modal
- [ ] Global Search modal
- [ ] Quick Open modal
- [ ] Symbol Search modal

### Phase 2: Keyboard Shortcuts (2-3 hours)
- [ ] Add keyboard event listeners
- [ ] Wire up all shortcuts
- [ ] Test all shortcuts
- [ ] Show keyboard shortcuts help

### Phase 3: Testing & Polish (2-3 hours)
- [ ] Test all features
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] Check for console errors

---

## 🔧 Technical Considerations

### Backend API Endpoints Needed
```
POST /api/search
  - Query: search text
  - Path: workspace path
  - Returns: array of SearchResult

GET /api/files/{path}
  - Returns: file content

POST /api/files/save
  - Path: file path
  - Content: file content
  - Returns: success/error
```

### Component Props to Update
```typescript
// App.tsx needs to pass these props:
<FindReplace
  isOpen={showFindReplace}
  onClose={() => setShowFindReplace(false)}
  onFind={handleFind}
  onReplace={handleReplace}
/>

<GoToLine
  isOpen={showGoToLine}
  onClose={() => setShowGoToLine(false)}
  totalLines={activeTab?.content.split('\n').length || 0}
  onGoToLine={handleGoToLine}
/>

// etc.
```

### State to Add to App.tsx
```typescript
const [showFindReplace, setShowFindReplace] = useState(false);
const [showGoToLine, setShowGoToLine] = useState(false);
const [showGlobalSearch, setShowGlobalSearch] = useState(false);
const [showQuickOpen, setShowQuickOpen] = useState(false);
const [showSymbolSearch, setShowSymbolSearch] = useState(false);
const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
```

---

## 📊 Estimated Timeline

| Task | Duration | Status |
|------|----------|--------|
| Find/Replace | 2-3 hours | ⏳ Next |
| Go to Line | 1-2 hours | ⏳ Next |
| Global Search | 2-3 hours | ⏳ Next |
| Quick Open | 1-2 hours | ⏳ Next |
| Symbol Search | 1-2 hours | ⏳ Next |
| Keyboard Shortcuts | 2-3 hours | ⏳ Next |
| Testing & Polish | 2-3 hours | ⏳ Next |
| **Total** | **12-18 hours** | ⏳ Next |

---

## 🎯 Success Criteria

When all of these are done, Stage 1 will be 60% complete:
- [ ] Find/Replace working
- [ ] Go to Line working
- [ ] Global Search working
- [ ] Quick Open working
- [ ] Symbol Search working
- [ ] All keyboard shortcuts working
- [ ] No console errors
- [ ] No crashes

---

## 💡 Tips for Implementation

1. **Start with Find/Replace** - It's the most commonly used feature
2. **Test each feature immediately** - Don't wait until the end
3. **Use the backend API** - Don't try to search locally
4. **Keep modals simple** - Focus on functionality, not design
5. **Add error handling** - Show user-friendly error messages
6. **Test keyboard shortcuts** - Make sure they don't conflict

---

## 🚀 How to Proceed

1. **Pick one feature** (e.g., Find/Replace)
2. **Implement the component** (create the modal)
3. **Add to App.tsx** (add state and keyboard shortcut)
4. **Test thoroughly** (make sure it works)
5. **Move to next feature** (repeat)

**Estimated time per feature**: 1-2 hours

---

## 📝 Notes

- All components should follow the existing pattern
- Use Tailwind CSS for styling
- Use TypeScript for type safety
- Add error handling for all API calls
- Test on different screen sizes
- Keep components focused and simple

---

**Ready to start?** Pick a feature and begin implementation!

**Questions?** Refer to the existing components for examples.

**Need help?** Check the STABILITY_ROADMAP.md for more details.

