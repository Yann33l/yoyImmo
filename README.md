# YoyImmo - Property Management Application

YoyImmo is a full-stack property management application built with React (frontend) and NestJS (backend) using a modern monorepo structure.

## Overview

YoyImmo helps property owners manage their rental properties, tenants, leases, rent payments, expenses, and tax preparation. The application is designed for offline-first operation with local SQLite database storage.

## Project Structure

```
F:\App\BMAD/
├── apps/
│   ├── frontend/              # React + Vite frontend application
│   │   ├── src/               # Source code
│   │   ├── public/            # Static assets
│   │   ├── package.json
│   │   ├── vite.config.ts     # Vite configuration
│   │   └── tsconfig.json      # TypeScript configuration
│   └── backend/               # NestJS backend application
│       ├── src/               # Source code
│       │   ├── main.ts        # Application entry point
│       │   ├── app.module.ts  # Root module
│       │   └── app.service.ts
│       ├── test/              # E2E tests
│       ├── package.json
│       ├── nest-cli.json      # NestJS CLI configuration
│       └── tsconfig.json      # TypeScript configuration
├── yoyimmo-data/              # Persistent data storage (Docker volume)
│   ├── database/              # SQLite database files
│   ├── documents/             # Uploaded documents
│   ├── backups/               # Database backups
│   └── logs/                  # Application logs
├── _bmad/                     # BMAD workflow system
├── _bmad-output/              # Generated planning artifacts
├── package.json               # Root workspace configuration
├── tsconfig.base.json         # Shared TypeScript configuration
├── .gitignore                 # Git ignore patterns
└── README.md                  # This file
```

## Prerequisites

- **Node.js**: v18.x or v20.x (LTS)
- **npm**: v9.x or v10.x (included with Node.js)
- **Git**: For version control

## Quick Start (< 30 minutes setup)

### 1. Install Dependencies

Install all dependencies for both frontend and backend:

```bash
cd F:\App\BMAD
npm install
```

This command automatically installs dependencies for both apps thanks to npm workspaces.

### 2. Start Development Servers

**Option A: Start both servers simultaneously**
```bash
npm run dev
```

**Option B: Start servers individually**

Frontend only (port 5173):
```bash
cd apps/frontend
npm run dev
```

Backend only (port 3000):
```bash
cd apps/backend
npm run start:dev
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Health Check**: http://localhost:3000/api/health

## Available Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend |
| `npm run dev:frontend` | Start frontend only (port 5173) |
| `npm run dev:backend` | Start backend only (port 3000) |

### Build

| Command | Description |
|---------|-------------|
| `npm run build` | Build both applications |
| `npm run build:frontend` | Build frontend (output: `apps/frontend/dist/`) |
| `npm run build:backend` | Build backend (output: `apps/backend/dist/`) |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:frontend` | Run frontend tests |
| `npm run test:backend` | Run backend unit tests |
| `npm run test:e2e` | Run backend E2E tests |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint all projects |
| `npm run lint:frontend` | Lint frontend code |
| `npm run lint:backend` | Lint backend code |

## Technology Stack

### Frontend (ARCH-002)
- **Framework**: React 18+
- **Build Tool**: Vite 5.x (fast HMR, optimized production builds)
- **Language**: TypeScript 5.x (strict mode enabled)
- **Port**: 5173 (development)
- **State Management**: React Query (server state caching)
- **Routing**: React Router
- **Styling**: Tailwind CSS + Shadcn/ui components
- **HTTP Client**: Axios

### Backend (ARCH-003)
- **Framework**: NestJS 10+
- **Language**: TypeScript 5.x (decorators enabled)
- **Port**: 3000 (development)
- **Architecture**: Modular with Dependency Injection
- **Database**: Prisma ORM + SQLite 3.x
- **Testing**: Jest (unit + e2e tests pre-configured)
- **Authentication**: JWT with bcrypt password hashing
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Validation**: class-validator + class-transformer

## Configuration

### Environment Variables

**Frontend** (`.env.local`):
```env
VITE_API_URL=http://localhost:3000
NODE_ENV=development
```

**Backend** (`.env`):
```env
DATABASE_URL=file:./yoyimmo-data/database/yoyimmo.db
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=3600
PORT=3000
```

### CORS Configuration

The backend is configured to accept requests from the frontend (http://localhost:5173) with credentials enabled.

### API Prefix

All backend routes are prefixed with `/api` (e.g., `http://localhost:3000/api/health`).

## Development Workflow

### Adding Dependencies

**Frontend:**
```bash
npm install <package> --workspace=frontend
```

**Backend:**
```bash
npm install <package> --workspace=backend
```

**Root (shared dev dependencies):**
```bash
npm install <package> -D
```

### Creating NestJS Modules

```bash
cd apps/backend
npx nest generate module <module-name>
npx nest generate controller <controller-name>
npx nest generate service <service-name>
```

### Hot Module Replacement (HMR)

- **Frontend**: Vite HMR is enabled by default - changes appear instantly without full page reload
- **Backend**: NestJS watch mode (`--watch`) automatically restarts the server on file changes

## Project Features

YoyImmo provides comprehensive property management capabilities:

1. **Property Management**: Track multiple rental properties with detailed characteristics
2. **Tenant Management**: Maintain tenant profiles and contact information
3. **Lease Contracts**: Create and monitor rental agreements with dates and terms
4. **Rent Tracking**: Ultra-fast 1-click rent payment validation (< 10 seconds)
5. **Expense Tracking**: Upload and categorize tax-deductible expenses
6. **Fiscal Dashboard**: Automated tax preparation with export capabilities
7. **Document Storage**: Centralized document management with quick search
8. **Notifications**: Automated reminders for upcoming rent payments (J-2 alerts)
9. **Reporting**: Comprehensive dashboards and data visualization

## Directory Structure Standards

### Backend Module Structure
Each business module follows this pattern:
```
src/modules/<module-name>/
├── dto/                       # Data Transfer Objects
├── <module>.controller.ts     # HTTP endpoints
├── <module>.controller.spec.ts # Controller tests
├── <module>.service.ts        # Business logic
├── <module>.service.spec.ts   # Service tests
└── <module>.module.ts         # Module definition
```

### Frontend Component Structure
```
src/components/<feature>/
├── <Component>.tsx            # Component implementation
├── <Component>.test.tsx       # Component tests
└── <Component>.css            # Component-specific styles (if needed)
```

## Testing Strategy

### Frontend Testing
- **Framework**: Jest + React Testing Library
- **Location**: Tests co-located with components (`*.test.tsx`)
- **Coverage Target**: > 70% for critical components
- **Approach**: Behavior-based testing (user interactions)

### Backend Testing
- **Framework**: Jest (pre-configured with NestJS)
- **Unit Tests**: Co-located with source (`*.spec.ts`)
- **E2E Tests**: Located in `test/` directory (`*.e2e-spec.ts`)
- **Coverage Target**: > 80% for services

## Version Requirements

- **React**: 18+
- **Vite**: 5.x
- **NestJS**: 10+
- **TypeScript**: 5.x (strict mode)
- **Node.js**: LTS (18.x or 20.x)
- **Prisma**: 5.x
- **SQLite**: 3.x

All versions are actively maintained and compatible as of January 2026.

## Next Steps

- [ ] Configure Prisma ORM with SQLite (Story 1.2)
- [ ] Set up Docker Compose for containerization (Story 1.3)
- [ ] Add infrastructure (logging, error handling, API docs) (Story 1.4)
- [ ] Configure Shadcn/ui component library (Story 1.5)
- [ ] Set up React Query for state management (Story 1.6)
- [ ] Implement backup & restore system (Story 1.7)

## Support & Documentation

- **Architecture Documentation**: `_bmad-output/planning-artifacts/architecture.md`
- **Product Requirements**: `_bmad-output/planning-artifacts/prd.md`
- **Epic Breakdown**: `_bmad-output/planning-artifacts/epics.md`
- **Sprint Status**: `_bmad-output/implementation-artifacts/sprint-status.yaml`

## License

MIT

## Project Context

This project is being developed using the BMAD (Business Methodology and Development) workflow system, which provides structured planning and implementation guidance through the development lifecycle.
