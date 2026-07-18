# LaunchPilot Workspace Rules

## Global UI & Design Rules
- **Color Palette Limits**: Use a maximum of 3 primary colors (+ optional neutral colors). In our implementation:
  - Primaries: **Indigo**, **Blue**, **Purple**
  - Neutral: **Zinc** (ranging from `zinc-950` to `zinc-50`)
- **Visual Consistency**: Maintain consistent layout, spacing, and alignment throughout the project.
- **Unified Component Styles**: All cards and structural containers must have the same visual style, including:
  - Background: `bg-zinc-900`
  - Border: `border border-zinc-800`
  - Corner Radius: `rounded-2xl`
  - Internal Padding: `p-6` (or equivalent `p-4` / `p-8` based on screen sizing requirements)
- **Responsive Layout**: Fully responsive for mobile (stacked full-width components with hamburger drawer), tablet, and desktop viewports.
- **No Dummy Content**: Use realistic data model fallbacks and active inputs (no arbitrary placeholder texts).
