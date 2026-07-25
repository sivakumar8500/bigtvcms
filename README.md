# 📺 BigTV CMS

> A modern, multilingual Content Management System for BigTV — built with **Next.js 15**, **Material UI**, and **Clean Architecture** principles. Fully supports **English, Telugu, Hindi, and Malayalam** with **Light & Dark theme** switching.

---

## 🚀 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | Material UI (MUI) v5 |
| **Data Grid** | MUI X Data Grid v7 |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) v4 |
| **Server State** | [TanStack Query](https://tanstack.com/query) v5 |
| **Forms & Validation** | React Hook Form + Zod |
| **HTTP Client** | Axios |
| **i18n** | next-intl (4 languages: EN, TE, HI, ML) |
| **Styling** | Emotion (CSS-in-JS via MUI) |
| **Testing** | Jest + Testing Library |
| **Package Manager** | pnpm |
| **Code Quality** | ESLint + Prettier + Husky |

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** `>= 18.17.0`
- **pnpm** `>= 8.0.0`

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/bigtv-cms.git
cd bigtv-cms
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Authentication
NEXT_PUBLIC_APP_NAME=BigTV CMS
```

---

## 🏃 Running the Application

### Development Mode

```bash
pnpm dev
```

Opens at **http://localhost:3000**. Hot module replacement is enabled.

### Production Build

```bash
# Build the production bundle
pnpm build

# Start the production server
pnpm start
```

### Run on a Custom Port

```bash
pnpm dev -- -p 8800
```

---

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Run Tests with Coverage Report

```bash
pnpm test:coverage
```

Coverage report is generated in:
- **Terminal**: Printed inline after tests run
- **HTML Report**: `coverage/lcov-report/index.html` — open in browser for line-by-line detail
- **LCOV file**: `coverage/lcov.info` — for CI/CD integration

#### Coverage Thresholds (enforced)

| Metric | Minimum |
|--------|---------|
| Statements | **80%** |
| Branches | 50% |
| Functions | 75% |
| Lines | **80%** |

### Run E2E Tests (Playwright)

```bash
pnpm test:e2e
```

---

## 🔧 Code Quality

### Lint

```bash
pnpm lint
```

### Auto-fix Lint Errors

```bash
pnpm lint --fix
```

### Format Code (Prettier)

```bash
pnpm format
```

> **Note**: Husky pre-commit hooks run `lint-staged` automatically on every commit to enforce code quality.

---

## 🏗️ Project Structure

```
bigtv-cms/
├── src/
│   ├── app/                    # Next.js App Router — routing entry points
│   │   ├── layout.tsx          # Root layout (ThemeProvider, QueryProvider)
│   │   ├── dashboard/          # CMS Dashboard page
│   │   ├── reels/              # Reels management page
│   │   ├── categories/         # Category management page
│   │   ├── locations/          # Location management page
│   │   ├── languages/          # Language management page
│   │   ├── aitags/             # AI Tags management page
│   │   ├── login/              # Authentication page
│   │   └── settings/           # System settings page
│   │
│   ├── core/                   # Cross-cutting infrastructure
│   │   ├── api/                # Axios client, interceptors, repository base
│   │   ├── security/           # Permission policies, route guards
│   │   ├── storage/            # Zustand language/auth persistence stores
│   │   └── errors/             # Global error models
│   │
│   ├── shared/                 # Reusable presentation layer
│   │   ├── components/         # Atomic UI components (Button, DataGrid)
│   │   ├── hooks/              # Shared hooks (usePagination, useSorting)
│   │   ├── providers/          # ThemeProvider (light/dark), QueryProvider
│   │   └── layouts/            # Sidebar, Topbar layouts
│   │
│   ├── modules/                # Feature modules (Vertical Slice Architecture)
│   │   ├── category/           # Category CRUD module
│   │   ├── reels/              # Reels CRUD module
│   │   ├── location/           # Location/State CRUD module
│   │   ├── language/           # Language CRUD module
│   │   ├── tags/               # AI Tags CRUD module
│   │   ├── news/               # News Article management
│   │   ├── auth/               # Authentication module
│   │   ├── dashboard/          # Dashboard metrics
│   │   └── settings/           # System settings
│   │
│   ├── messages/               # i18n translation files (en, te, hi, ml)
│   └── i18n/                   # next-intl configuration
│
├── jest.config.js              # Jest + coverage configuration
├── jest.setup.js               # Testing Library DOM setup
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── prettier.config.js          # Prettier formatting rules
└── .eslintrc.json              # ESLint rules
```

### Module Directory Pattern

Each feature module under `src/modules/[name]/` follows this strict structure:

```
modules/[feature]/
├── components/        # UI components unique to this module
├── pages/             # Page view wrappers
├── hooks/             # Controller hooks (state, handlers, pagination)
├── validators/        # Zod schemas for form validation
├── domain/            # TypeScript models/entities
├── repositories/      # API repository implementations
├── services/          # Use cases and orchestration
├── dto/               # Request/Response DTO interfaces
├── mapper/            # DTO → Domain mappers
└── tests/             # Unit tests for this module
```

---

## 🌐 Multilingual Support

The CMS supports **4 languages** out of the box:

| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `te` | Telugu | Telugu |
| `hi` | Hindi | Devanagari |
| `ml` | Malayalam | Malayalam |

Translation files live in `src/messages/`:

```
src/messages/
├── en.json    # English translations
├── te.json    # Telugu translations
├── hi.json    # Hindi translations
└── ml.json    # Malayalam translations
```

Language preference is persisted in `localStorage` via the `useLanguageStore` (Zustand) and also stored as a `NEXT_LOCALE` cookie for server-side rendering support.

> **Rule**: Any static text added to the application **must** have translations in all 4 languages.

---

## 🎨 Theming

The application supports **Light and Dark themes** via `ThemeProvider`:

| Mode | Background | Primary |
|------|-----------|---------|
| **Dark** | `#110d29` (deep violet) | `#a6e2f5` (premium teal) |
| **Light** | `#ffffff` (white) | `#1c1445` (dark violet) |

- Font: **Poppins** (Google Fonts)
- Theme state is managed via `useAppTheme()` hook

---

## 🗺️ Navigation & Pages

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Create News | Main news creation dashboard |
| `/reels` | Reels | Short video reels management |
| `/categories` | Categories | News category hierarchy |
| `/locations` | Locations | State/region management |
| `/languages` | Languages | CMS language configuration |
| `/aitags` | AI Tags | Automated content tagging |
| `/settings` | Settings | System settings |
| `/login` | Login | Authentication |

---

## 🏛️ Architecture

BigTV CMS follows **Clean Architecture** with **Vertical Slice / Feature-First** organization:

```
┌─────────────────────────────────────────┐
│           Presentation Layer             │
│    (MUI Components, Pages, Hooks)        │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│           Application Layer             │
│    (Zustand Stores, TanStack Queries)   │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│             Domain Layer                │
│    (Models, Zod Validators, Interfaces) │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────▼──────────────────────┐
│          Infrastructure Layer           │
│    (Axios Client, Mappers, Repositories)│
└─────────────────────────────────────────┘
```

**Key Principles:**
1. **Presentation Layer** — renders UI only; zero business logic
2. **Application Layer** — orchestrates data flow; Zustand + TanStack Query
3. **Domain Layer** — entities, Zod schemas, repository interfaces
4. **Infrastructure Layer** — HTTP calls, response mappers, storage

---

## 🚢 Deployment

### Docker (Recommended)

```bash
# Build Docker image
docker build -t bigtv-cms:latest .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=https://api.bigtv.in \
  bigtv-cms:latest
```

### Vercel (One-click)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Self-hosted (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Build the project
pnpm build

# Start with PM2
pm2 start npm --name "bigtv-cms" -- start

# Save PM2 process list
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

### Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name cms.bigtv.in;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔄 CI/CD Pipeline (GitHub Actions example)

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test:coverage
      - run: pnpm build
```

---

## 📝 Development Rules

| Rule | Description |
|------|-------------|
| 🌐 **4 Languages** | All static text must have EN, TE, HI, ML translations |
| 🎨 **Dual Theme** | All UI must support Light and Dark mode |
| 🧪 **80% Coverage** | Statement and line coverage must stay above 80% |
| 🏗️ **Module Pattern** | New features must follow the module directory pattern |
| ✅ **Zod Validation** | All form data must be validated via Zod schemas |
| 🔒 **No Business Logic in UI** | Controllers/hooks handle logic; components only render |

---

## 📄 License

Private — © 2024 BigTV. All rights reserved.
