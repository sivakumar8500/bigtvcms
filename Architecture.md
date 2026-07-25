# Architecture & Design Standards - BigTVCMS

## Clean Architecture & Separation of Concerns

We divide our application layers into strictly separated concerns:

```
+-------------------------------------------------------------+
|                     Presentation Layer                      |
| (MUI UI Components, Next.js app pages, Custom Hooks)        |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                      Application Layer                      |
| (Zustand Stores, TanStack Queries, DTOs, Use Cases)         |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                        Domain Layer                         |
| (Domain Models, Validation Schemas, Repository Interfaces)   |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     Infrastructure Layer                    |
| (ApiClient, Storage Strategy, Axios Instance/Mappers)       |
+-------------------------------------------------------------+
```

### Clean Architecture Principles Followed:
1. **Presentation Layer (React & MUI)**: Strictly handles rendering UI and UI state. Zero business logic or direct API calling exists here. Uses controllers, presenter hooks, or use cases.
2. **Application Layer (Use Cases & Orchestration)**: Handles the flow of data. Zustand stores and TanStack Query hooks reside here to coordinate operations.
3. **Domain Layer (Entities & Validation)**: High-level business invariants, models, custom interfaces, and schemas (using Zod validation).
4. **Infrastructure Layer (HTTP Clients & Mappers)**: Converts raw server responses into Domain models. Handles data conversion using the Mapper pattern to prevent changes in server contracts from breaking client UI schemas.

---

## Shared vs. Feature Architecture
BigTVCMS uses a **Vertical Slice / Feature First Architecture**. All logical components (Dashboard, Auth, News, Categories, Media, etc.) are encapsulated inside self-contained modules located in `src/modules/[module_name]`. Cross-cutting infrastructure resides under `src/core` and base components under `src/shared`.
