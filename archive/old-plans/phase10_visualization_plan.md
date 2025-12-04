# Phase 10: Advanced Visualizations (Insight) Implementation Plan

## Objective
Enhance the IDE's capability to visualize complex information, making it easier for the user to understand code structure, see real-time results, and manage agent tasks.

## Features

### 1. Graph View (Dependency Visualization)
- **Goal**: Visualize the relationship between files in the workspace.
- **Implementation**:
    - Use `react-force-graph` or `recharts` (or a simple SVG implementation if minimizing deps) to render nodes and links.
    - **Backend**: Add a tool/endpoint to analyze imports in the workspace and return a graph JSON (nodes: files, edges: imports).
    - **Frontend**: A new "Graph" tab in the main editor area.

### 2. Live Preview (Component Rendering)
- **Goal**: Render HTML/React components directly in the UI.
- **Implementation**:
    - **Sandboxing**: Use an `iframe` with `srcDoc` to render content safely.
    - **Integration**: The "Visual Output Area" in the Agent Manager (specifically for the Review/Coder agent) will be upgraded to a real preview pane.
    - **Agent Action**: Agents can output a `preview_action` with HTML/Code to trigger this view.

### 3. Kanban Board (Task Management)
- **Goal**: Visualize the Manager Agent's plan as a Kanban board.
- **Implementation**:
    - **UI**: A drag-and-drop interface (using `dnd-kit` or simple HTML5 DnD) in the "Plan" tab.
    - **State**: Sync with the backend's `current_plan`.
    - **Columns**: To Do, In Progress, Done.

## Step-by-Step Plan

### Step 1: Graph View Backend
- [ ] Create `DependencyAnalyzer` class in backend.
- [ ] Add `analyze_dependencies` tool to `NemotronAgent`.
- [ ] Add `/graph` endpoint to `server.py`.

### Step 2: Graph View Frontend
- [ ] Install visualization library (or build custom SVG).
- [ ] Create `GraphComponent.tsx`.
- [ ] Add "Graph" tab to `App.tsx`.

### Step 3: Live Preview
- [ ] Create `PreviewComponent.tsx` (iframe based).
- [ ] Update `App.tsx` to show this component when an agent requests a preview.
- [ ] Update `agent.py` to support `preview_action`.

### Step 4: Kanban Board
- [ ] Create `KanbanBoard.tsx`.
- [ ] Integrate into `App.tsx` (maybe replace the "Plan" text view).

## Dependencies
- `react-force-graph-2d` (optional, might use simple SVG for zero-dep)
- `lucide-react` (icons)
