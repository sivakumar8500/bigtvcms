# Coding Standards - BigTVCMS

This document defines code style, testing guidelines, formatting rules, and development policies for the BigTVCMS enterprise codebase.

---

## TypeScript Standards
- **Strict Mode Enforcement**: Avoid `any`. Use `unknown` for runtime dynamic payloads and cast using type-guards or Zod schemas.
- **Type vs. Interface**: Use `interface` for structural object definitions and contract design. Use `type` for unions, intersections, and aliases.
- **Null Safety**: Avoid non-null assertions (`!`). Use optional chaining (`?.`) and nullish coalescing (`??`).

---

## React & Next.js Standards
- **Function Components**: Use functional components declared with `const ComponentName: React.FC<Props>`.
- **Logic Segregation**: All hooks that interact with Zustand/TanStack Query should be isolated into module custom hooks. Avoid inline calculations within the render loop.
- **Server Components (RSC)**: Layout pages must default to React Server Components unless state synchronization, effects, or user event handlers are needed.

---

## Naming Conventions
| Domain Element | Convention | Example |
| :--- | :--- | :--- |
| **Components** | PascalCase | `NewsPublishDialog.tsx` |
| **Custom Hooks** | camelCase (prefixed with `use`) | `useNewsPublisher.ts` |
| **Repository Contracts** | PascalCase (prefixed with `I`) | `INewsRepository.ts` |
| **Repository Implementations** | PascalCase | `NewsRepository.ts` |
| **DTO Types** | PascalCase (suffixed with `Dto`) | `CreateArticleDto.ts` |
| **Utility Functions** | camelCase | `formatIsoDate.ts` |

---

## Code Formatting
All files must follow Prettier rules defined in [prettier.config.js](file:///d:/projects/live_projects/bigtv_cms/prettier.config.js):
- **Semi**: `true`
- **SingleQuote**: `true`
- **TabWidth**: `2`
- **PrintWidth**: `100`

### Import Order Checklist
1. React / Next.js core modules
2. External packages (e.g. `@mui/material`, `@tanstack/react-query`)
3. Core imports using aliases (`@/core/*`)
4. Shared assets and styles (`@/shared/*`)
5. Local module components (`./components/*`)

---

## Testing & Quality Requirements

### Coverage Threshold Rules
CI pipelines will fail if the code coverage drops below the following values:
- **Lines Coverage**: >80%
- **Branches Coverage**: >80%
- **Functions Coverage**: >80%
- **Statements Coverage**: >80%

### Test Organization
- **Unit & Integration Tests**: Located inside the `tests/` directory of each module using Jest and MSW.
- **E2E Tests**: Located inside the root `tests/e2e/` folder or named with `[name].spec.ts` using Playwright.
- **Mocking**: Always mock API servers using MSW handles to avoid dependencies on live environments.

---

## Pull Request and Code Review Checklist
- [ ] No strict lint rules are bypassed (`eslint-disable` is forbidden).
- [ ] Accessibility: Interactive UI components have correct ARIA labels.
- [ ] Forms: All input validations are bound via Zod schema parsers.
- [ ] Git commit matches conventional changelog format (`feat(news): add preview modal`).
- [ ] Zero commented-out code snippets exist.
