# Folder Structure Reference - BigTVCMS

The project is structured under `src/` to support modular feature development and cross-cutting core abstractions.

```
src/
├── app/                  # Next.js App Router routing entrypoints and layout bootstrap
├── core/                 # Core System Abstraction Layer (Cross-Cutting Concerns)
│   ├── api/              # ApiClient, Axios definitions, Interceptors, Repository interfaces
│   ├── config/           # Application configuration variables, env bindings
│   ├── security/         # Route Guards, Permission policies, JWT handlers
│   ├── storage/          # Local/Session token and persistent store interfaces
│   ├── logger/           # Structured telemetry logging interface
│   ├── errors/           # System-wide exceptions and HTTP translation models
│   └── tests/            # Global Mock Service Worker (MSW) or E2E configurations
├── shared/               # Shared Presentation and Base Utilities
│   ├── components/       # Atomic design UI parts (Button, DataGrid, Modals)
│   ├── layouts/          # Common application layout configurations (Sidebar, Topbar)
│   ├── providers/        # Combined application context providers (Query, Theme)
│   ├── hooks/            # Shared hooks (usePagination, useSorting, useDebounce)
│   ├── services/         # Global utility services (Toast service)
│   ├── utils/            # General helpers
│   ├── constants/        # System-wide enum maps
│   ├── types/            # Base utility typings
│   ├── theme/            # Material UI Theme definition (Dark, Light, RTL)
│   ├── icons/            # Customized SVG wrappers
│   └── assets/           # Local design resources
└── modules/              # Vertical Slice Module Folders
    ├── dashboard/        # CMS Metrics
    ├── auth/             # Authentication Module
    ├── news/             # News Article Management (Featured, Scheduling, SEO)
    ├── category/         # Hierarchy Categories
    ├── tags/             # Media tags
    ├── media/            # Image/Video Asset Library
    ├── users/            # Backend operators management
    ├── roles/            # Role and Permission matrices
    ├── notifications/    # Push, email, SMS triggers
    ├── analytics/        # Performance counters
    └── settings/         # System Settings
```

## Module Directory Pattern
Each feature under `src/modules/[name]` is organized strictly as follows:
- **components/**: Local UI components unique to this module.
- **pages/**: View controller sub-layout nodes.
- **hooks/**: Presenter hooks controlling layout rendering & query bindings.
- **services/**: Use-cases and orchestrations.
- **repositories/**: Implementation of module repositories calling the API wrapper.
- **application/**: State management hooks (Zustand stores, TanStack Queries).
- **domain/**: Validation schemas (Zod) and model definitions.
- **validators/**: Validation wrappers and format rules.
- **dto/**: Request and response interfaces mapping server inputs.
- **mapper/**: Mappers transforming DTOs into Domain Entities.
- **constants/**: Feature specific settings (default filters, flags).
- **types/**: local typescript shapes.
- **routes/**: Nested router helper URLs.
- **tests/**: Module-level unit tests.
