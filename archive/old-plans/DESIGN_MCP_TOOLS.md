# 🎨 Design-Focused MCP Tools for NemoCode-IDE

## Overview

Design-focused MCP tools enable AI agents to generate, manipulate, and integrate design assets directly within the IDE. These tools bridge the gap between code and design, similar to how shadcn/ui provides ready-to-use components.

---

## 1. shadcn/ui MCP Tool

### What It Is
shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. An MCP connector would allow the AI to:

### Capabilities
- **Component Discovery**: List available components (Button, Card, Dialog, etc.)
- **Component Installation**: Add components to project with dependencies
- **Component Customization**: Modify theme, colors, variants
- **Code Generation**: Generate component usage examples
- **Dependency Management**: Auto-install required packages

### Example Usage
```typescript
// AI can execute:
await shadcnMCP.addComponent("button", {
  variant: "outline",
  theme: "dark"
});

// Generates:
// - components/ui/button.tsx
// - Updates tailwind.config.js
// - Installs @radix-ui/react-button
```

### Integration Points
- File system access for component creation
- Package manager integration (npm/pnpm/yarn)
- Tailwind config modification
- TypeScript type generation

---

## 2. MARP MCP Tool (Implemented)

### What It Is
MARP (Markdown Presentation Ecosystem) converts Markdown to presentations (HTML, PDF, PPTX).

### Capabilities
- **Presentation Generation**: Convert Markdown to slides
- **Theme Selection**: Apply built-in themes (default, gaia, uncover)
- **Export Formats**: HTML, PDF, PowerPoint
- **Live Preview**: Real-time slide preview
- **Custom Styling**: CSS customization

### Example Usage
```python
# AI can execute:
await marpMCP.create_presentation(
    markdown_content="""
    # Project Overview
    - Feature 1
    - Feature 2
    
    ---
    
    # Architecture
    ![diagram](./arch.png)
    """,
    output_path="presentation.html",
    theme="gaia"
)
```

### Use Cases
- Generate project documentation slides
- Create technical presentations from code comments
- Auto-generate sprint review decks
- Convert README to presentation

---

## 3. Figma MCP Tool (Stub Implemented)

### What It Is
Figma API integration for design asset management and code generation.

### Capabilities
- **Design Import**: Fetch designs from Figma files
- **Component Export**: Export components as SVG/PNG
- **Design Tokens**: Extract colors, typography, spacing
- **Code Generation**: Convert designs to React/Vue components
- **Collaboration**: Sync design changes with code

### Example Usage
```python
# AI can execute:
design = await figmaMCP.get_file_nodes("file_id")
component = await figmaMCP.export_component(
    file_id="abc123",
    node_id="button-primary",
    format="svg"
)
# Generates React component from Figma design
```

### Use Cases
- Import design system from Figma
- Generate component library from designs
- Sync design tokens with code
- Auto-update UI when designs change

---

## 4. Tailwind MCP Tool (Recommended)

### What It Is
Tailwind CSS utility-first framework integration.

### Capabilities
- **Class Generation**: Generate Tailwind classes from descriptions
- **Config Management**: Modify tailwind.config.js
- **Theme Customization**: Add custom colors, fonts, spacing
- **Component Scaffolding**: Generate styled components
- **Responsive Design**: Auto-generate responsive variants

### Example Usage
```typescript
// AI can execute:
await tailwindMCP.generateClasses({
  description: "Primary button with hover effect",
  responsive: true
});

// Returns:
// "bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg 
//  text-white font-semibold transition-colors 
//  md:px-6 md:py-3"
```

### Use Cases
- Generate utility classes from natural language
- Create responsive layouts
- Build design systems
- Optimize class usage

---

## 5. Storybook MCP Tool (Recommended)

### What It Is
Storybook integration for component documentation and testing.

### Capabilities
- **Story Generation**: Auto-generate stories from components
- **Documentation**: Create component docs
- **Visual Testing**: Capture component snapshots
- **Interaction Testing**: Generate interaction tests
- **Accessibility Checks**: Run a11y audits

### Example Usage
```typescript
// AI can execute:
await storybookMCP.generateStory({
  component: "Button",
  variants: ["primary", "secondary", "outline"],
  props: ["size", "disabled", "loading"]
});

// Generates Button.stories.tsx with all variants
```

### Use Cases
- Auto-document component library
- Generate visual regression tests
- Create interactive component playground
- Ensure accessibility compliance

---

## 6. Iconify MCP Tool (Recommended)

### What It Is
Access to 200,000+ open-source icons from multiple icon sets.

### Capabilities
- **Icon Search**: Search icons by keyword
- **Icon Import**: Add icons to project
- **Format Conversion**: SVG, React, Vue, PNG
- **Icon Customization**: Size, color, stroke
- **Set Management**: Browse icon sets (Material, Feather, etc.)

### Example Usage
```typescript
// AI can execute:
const icons = await iconifyMCP.search("arrow");
await iconifyMCP.addIcon("mdi:arrow-right", {
  format: "react",
  size: 24,
  color: "currentColor"
});

// Generates: components/icons/ArrowRight.tsx
```

### Use Cases
- Quick icon integration
- Consistent icon usage
- Replace icon libraries
- Generate icon components

---

## 7. Framer Motion MCP Tool (Recommended)

### What It Is
Animation library integration for React components.

### Capabilities
- **Animation Generation**: Create animations from descriptions
- **Preset Library**: Access common animation patterns
- **Gesture Handling**: Add drag, hover, tap interactions
- **Layout Animations**: Auto-animate layout changes
- **Orchestration**: Coordinate multiple animations

### Example Usage
```typescript
// AI can execute:
await framerMCP.generateAnimation({
  component: "Modal",
  type: "fade-in",
  duration: 0.3,
  easing: "easeOut"
});

// Generates motion.div with animation config
```

### Use Cases
- Add animations to components
- Create page transitions
- Implement micro-interactions
- Build animated UI

---

## 8. Playwright MCP Tool (Recommended)

### What It Is
End-to-end testing framework integration.

### Capabilities
- **Test Generation**: Generate tests from user flows
- **Visual Testing**: Capture screenshots
- **Accessibility Testing**: Run a11y checks
- **Performance Testing**: Measure page load times
- **Cross-Browser Testing**: Test on multiple browsers

### Example Usage
```typescript
// AI can execute:
await playwrightMCP.generateTest({
  flow: "User login",
  steps: [
    "Navigate to /login",
    "Fill email input",
    "Fill password input",
    "Click submit button",
    "Assert redirect to /dashboard"
  ]
});

// Generates login.spec.ts
```

### Use Cases
- Auto-generate E2E tests
- Visual regression testing
- Accessibility audits
- Performance monitoring

---

## Implementation Priority

### High Priority (Immediate Value)
1. **shadcn/ui MCP** - Component library integration
2. **Tailwind MCP** - Utility class generation
3. **MARP MCP** - ✅ Already implemented

### Medium Priority (Enhanced Workflow)
4. **Iconify MCP** - Icon management
5. **Storybook MCP** - Component documentation
6. **Figma MCP** - Design-to-code workflow

### Low Priority (Advanced Features)
7. **Framer Motion MCP** - Animation library
8. **Playwright MCP** - Testing automation

---

## Integration Architecture

### MCP Tool Structure
```python
class DesignMCPTool:
    def __init__(self, config: Dict):
        self.config = config
    
    async def list_capabilities(self) -> List[str]:
        """List available tool functions."""
        pass
    
    async def execute(self, action: str, params: Dict) -> Dict:
        """Execute tool action."""
        pass
    
    async def validate(self, params: Dict) -> bool:
        """Validate parameters before execution."""
        pass
```

### Agent Integration
```python
# In agent.py
async def handle_design_action(self, action: str, params: Dict):
    """Handle design-related actions."""
    if action == "add_component":
        return await self.shadcn_mcp.addComponent(params)
    elif action == "generate_presentation":
        return await self.marp_mcp.create_presentation(params)
    elif action == "search_icons":
        return await self.iconify_mcp.search(params)
```

---

## Benefits for NemoCode-IDE

### Developer Experience
- **Faster Prototyping**: Generate UI components instantly
- **Consistent Design**: Use design system components
- **Reduced Boilerplate**: Auto-generate common patterns
- **Visual Feedback**: Preview designs in IDE

### AI Capabilities
- **Design Understanding**: AI can reason about UI/UX
- **Component Generation**: Create components from descriptions
- **Design System Adherence**: Follow established patterns
- **Accessibility**: Ensure a11y compliance

### Enterprise Value
- **Design-Dev Sync**: Bridge design and development
- **Component Library**: Build reusable component systems
- **Documentation**: Auto-generate component docs
- **Testing**: Automated visual and E2E tests

---

## Recommended Next Steps

1. **Implement shadcn/ui MCP** (Highest ROI)
   - Component discovery and installation
   - Theme customization
   - Dependency management

2. **Implement Tailwind MCP**
   - Class generation from natural language
   - Config management
   - Responsive design helpers

3. **Implement Iconify MCP**
   - Icon search and import
   - Format conversion
   - Component generation

4. **Enhance MARP MCP** (Already implemented)
   - Add custom themes
   - Live preview in IDE
   - Export to multiple formats

---

## Summary

Design-focused MCP tools transform NemoCode-IDE into a complete design-to-code platform. By integrating tools like shadcn/ui, Tailwind, Iconify, and MARP, the AI can:

✅ Generate production-ready UI components
✅ Apply consistent design systems
✅ Create presentations from code
✅ Import and manage design assets
✅ Automate testing and documentation

**Next Implementation**: shadcn/ui MCP for component library integration

---

**Status**: MARP MCP ✅ Implemented
**Recommended**: shadcn/ui, Tailwind, Iconify MCPs
**Total Design Tools**: 8 identified, 1 implemented
