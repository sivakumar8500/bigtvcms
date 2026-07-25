# Reusable Component Guidelines - BigTVCMS

## UI Component Standards

Our design system utilizes Material UI (MUI 5) with dark/light themes, full RTL compatibility, and strict WCAG accessibility rules.

### Design Principles

1. **Atomic Design Hierarchy**:
   - **Atoms**: Primitive building blocks that cannot be broken down further (e.g. `Button`, `TextField`, `Avatar`).
   - **Molecules**: Groups of atoms bound together to form basic units (e.g. `SearchBox` composed of a TextField and an IconButton).
   - **Organisms**: Complex layout modules consisting of molecules/atoms (e.g. `FilterPanel`, `NewsListTable`).
   - **Templates / Layouts**: Contextual wrappers defining responsive layouts (e.g. `SidebarLayout`).

2. **Component Customization Rules**:
   - Reusable components must extend standard MUI type definitions.
   - Use Emotion styled components or standard MUI SX properties mapped to custom theme tokens. Avoid hardcoded hex colors or layout margins.
   - components must be wrapped in `React.memo` or split into optimized sub-components to prevent unnecessary UI renders.
