# Coding Standards - BigTVCMS

## Standard Conventions

1. **Strict TypeScript Mode**:
   - `noImplicitAny: true` is strictly enforced.
   - Never use `any` as a type. If a type is uncertain, use `unknown`.

2. **File and Folder Naming**:
   - **Directories**: lowercase kebab-case (e.g. `news-editor`).
   - **Components**: PascalCase (e.g. `NewsListTable.tsx`).
   - **Hooks**: CamelCase prefixed with `use` (e.g. `useNewsEditor.ts`).
   - **Abstractions / Classes**: CamelCase or kebab-case (e.g. `api-client.ts`, `permission-policy.ts`).

3. **Separation of Business Logic**:
   - Components should contain *zero* state orchestrations or direct mutation queries.
   - Data mutations, pagination rules, state updates, and schema validations must be done inside presenter hooks or service orchestrators.

4. **Repository Pattern Rule**:
   - React components and custom page hooks MUST not access Axios/Fetch instances directly.
   - Modules must fetch data through Repository implementations adhering to core `IRepository` interfaces.
