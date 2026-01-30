# Story 1.2: Prisma ORM Setup with SQLite

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure Prisma ORM with SQLite as the database provider,
So that I have type-safe database access with migration capabilities.

## Acceptance Criteria

**Given** the NestJS backend is initialized
**When** I install Prisma with `npm install @prisma/client` and `npm install -D prisma`
**Then** Prisma packages are added to package.json

**Given** Prisma is installed
**When** I run `npx prisma init --datasource-provider sqlite`
**Then** a `prisma/schema.prisma` file is created with SQLite datasource
**And** a `.env` file is created with `DATABASE_URL="file:./dev.db"`

**Given** Prisma schema is initialized
**When** I add the initial User model with fields: id (UUID), email (String unique), passwordHash (String), createdAt (DateTime)
**And** I run `npx prisma migrate dev --name init`
**Then** the migration is created in `prisma/migrations/`
**And** a SQLite database file is created at `prisma/dev.db`
**And** Prisma Client is generated with TypeScript types

**Given** Prisma is configured
**When** I create a PrismaService in NestJS following NestJS + Prisma integration guide
**Then** the PrismaService is available for dependency injection
**And** database connections are managed properly (connect on init, disconnect on shutdown)

## Tasks / Subtasks

- [x] Task 1: Install Prisma Dependencies (AC: 1)
  - [x] Subtask 1.1: Run `npm install @prisma/client --workspace=backend`
  - [x] Subtask 1.2: Run `npm install -D prisma --workspace=backend`
  - [x] Subtask 1.3: Verify Prisma packages are in backend/package.json dependencies

- [x] Task 2: Initialize Prisma with SQLite Provider (AC: 2)
  - [x] Subtask 2.1: Run `npx prisma init --datasource-provider sqlite` in backend directory
  - [x] Subtask 2.2: Verify `prisma/schema.prisma` file is created with SQLite datasource configuration
  - [x] Subtask 2.3: Verify `.env` file is created with DATABASE_URL pointing to SQLite file
  - [x] Subtask 2.4: Update DATABASE_URL to use yoyimmo-data path: `file:../../yoyimmo-data/database/yoyimmo.db`
  - [x] Subtask 2.5: Update .env.example with correct DATABASE_URL path

- [x] Task 3: Create Initial User Model and Migration (AC: 3)
  - [x] Subtask 3.1: Add User model to prisma/schema.prisma with fields (id UUID, email String unique, passwordHash String, createdAt DateTime)
  - [x] Subtask 3.2: Run `npx prisma migrate dev --name init` to create initial migration
  - [x] Subtask 3.3: Verify migration files are created in `prisma/migrations/` directory
  - [x] Subtask 3.4: Verify SQLite database file is created at configured path
  - [x] Subtask 3.5: Verify Prisma Client is auto-generated with TypeScript types in node_modules/.prisma/client

- [x] Task 4: Create PrismaService for NestJS Integration (AC: 4)
  - [x] Subtask 4.1: Create `src/database/prisma.service.ts` implementing INestApplication lifecycle hooks
  - [x] Subtask 4.2: Implement onModuleInit() to call $connect()
  - [x] Subtask 4.3: Implement onModuleDestroy() to call $disconnect()
  - [x] Subtask 4.4: Create `src/database/prisma.module.ts` exporting PrismaService as global module
  - [x] Subtask 4.5: Import PrismaModule in AppModule

- [x] Task 5: Write Tests for Prisma Integration (AC: All)
  - [x] Subtask 5.1: Create unit test for PrismaService (prisma.service.spec.ts)
  - [x] Subtask 5.2: Test database connection lifecycle (connect/disconnect)
  - [x] Subtask 5.3: Create e2e test verifying User model CRUD operations
  - [x] Subtask 5.4: Run all tests and verify they pass

## Dev Notes

### Architecture Compliance Requirements (CRITICAL)

**ARCH-004: Database Layer (Prisma ORM + SQLite)**
- **ORM**: Prisma 5.x with declarative schema and type-safe client
- **Database**: SQLite 3.x for MVP (portable, zero-config, file-based)
- **Migration System**: Prisma Migrate (declarative, version-controlled)
- **Type Safety**: Full TypeScript integration with auto-generated types
- **Connection Management**: Singleton pattern via NestJS PrismaService
- **Database Location**: `../../yoyimmo-data/database/yoyimmo.db` (external volume for Docker compatibility)

**Key Architecture Decisions:**
- SQLite chosen for offline-first MVP (no server setup required)
- Database file stored in external yoyimmo-data/ volume (survives container restarts)
- Prisma provides type-safe database access preventing runtime errors
- Schema-first approach: define models in schema.prisma, migrations auto-generated
- Future migration path to PostgreSQL available without code changes (just datasource change)

### Prisma Schema Configuration

**Required schema.prisma Structure:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}
```

**Key Schema Elements:**
- `generator client`: Specifies Prisma Client generation (JavaScript/TypeScript)
- `datasource db`: Defines SQLite provider and environment variable for connection
- `@id @default(uuid())`: Primary key using UUID (better for distributed systems)
- `@unique`: Enforces email uniqueness at database level
- `@default(now())`: Auto-populates createdAt timestamp

### Database URL Configuration

**Development (.env):**
```env
DATABASE_URL="file:../../yoyimmo-data/database/yoyimmo.db"
```

**Why this path:**
- `../../` navigates from `apps/backend/` to project root
- `yoyimmo-data/database/` is the persistent storage directory
- `yoyimmo.db` is the SQLite database file
- This path works both locally and in Docker containers (via volume mount)

### NestJS + Prisma Integration Pattern

**PrismaService Implementation (src/database/prisma.service.ts):**
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Why this pattern:**
- Extends `PrismaClient` to inherit all Prisma methods
- Implements `OnModuleInit` to establish connection when NestJS starts
- Implements `OnModuleDestroy` to gracefully close connection on shutdown
- Injectable decorator makes it available for dependency injection
- Connection is managed as a singleton (one connection pool per application)

**PrismaModule (src/database/prisma.module.ts):**
```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Why @Global:**
- Makes PrismaService available to all modules without repeated imports
- Follows NestJS best practice for singleton database services
- Prevents circular dependency issues

### Prisma CLI Commands Reference

**Initialization:**
```bash
npx prisma init --datasource-provider sqlite
```
Creates `prisma/schema.prisma` and `.env` with SQLite configuration.

**Migration Creation:**
```bash
npx prisma migrate dev --name <migration-name>
```
- Generates migration SQL from schema changes
- Applies migration to database
- Regenerates Prisma Client with updated types

**Database Studio (GUI):**
```bash
npx prisma studio
```
Opens browser-based database viewer at http://localhost:5555

**Client Generation (if needed manually):**
```bash
npx prisma generate
```
Regenerates Prisma Client types (auto-run after migrations).

**Migration Reset (dev only):**
```bash
npx prisma migrate reset
```
Drops database, re-runs all migrations, runs seed script.

### Migration Best Practices

1. **Always use descriptive migration names:**
   - Good: `init`, `add-user-model`, `add-property-fields`
   - Bad: `migration1`, `update`, `changes`

2. **Review generated SQL before applying:**
   - Check `prisma/migrations/<timestamp>_<name>/migration.sql`
   - Ensure no data loss in production migrations

3. **Never edit migrations directly:**
   - Always modify `schema.prisma` and generate new migrations
   - Editing migration SQL breaks Prisma's migration tracking

4. **Use seed scripts for development data:**
   - Create `prisma/seed.ts` for sample data
   - Run with `npx prisma db seed`

### Testing Strategy for Prisma Integration

**Unit Tests (prisma.service.spec.ts):**
- Mock PrismaClient methods
- Test connection lifecycle (connect/disconnect)
- Verify service is injectable

**Integration Tests (e2e):**
- Use in-memory SQLite database (`:memory:`)
- Test actual database operations (CRUD)
- Verify migrations apply correctly
- Test constraint violations (unique emails, etc.)

**Test Database Configuration:**
```typescript
// test/prisma-test.service.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file::memory:?cache=shared'
    }
  }
});
```

### Common Pitfalls to Avoid

1. **Hardcoded DATABASE_URL**: Always use environment variables
2. **Missing migrations**: Run `npx prisma migrate dev` after schema changes
3. **Not regenerating client**: Client auto-regenerates, but if types are stale, run `npx prisma generate`
4. **Connection leaks**: Always use PrismaService singleton, don't create new PrismaClient instances
5. **SQLite limitations**: No support for some PostgreSQL features (enums, arrays, JSON operators)
6. **File paths in Docker**: Ensure DATABASE_URL path matches volume mounts

### Success Criteria Summary

This story is COMPLETE when:
- [ ] Prisma packages installed (@prisma/client + prisma dev dependency)
- [ ] prisma/schema.prisma exists with SQLite datasource and User model
- [ ] .env and .env.example updated with correct DATABASE_URL path
- [ ] Initial migration created and applied (prisma/migrations/ populated)
- [ ] SQLite database file exists at yoyimmo-data/database/yoyimmo.db
- [ ] Prisma Client generated with TypeScript types
- [ ] PrismaService created implementing lifecycle hooks
- [ ] PrismaModule created as global module
- [ ] AppModule imports PrismaModule
- [ ] Unit tests for PrismaService pass
- [ ] E2E tests for User model CRUD pass
- [ ] Database connects on app start, disconnects on shutdown

### References

- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\epics.md#Epic 1 Story 1.2]
- [Source: F:\App\BMAD\_bmad-output\planning-artifacts\architecture.md#ARCH-004 Database Layer]
- [Official Prisma Docs: https://www.prisma.io/docs]
- [NestJS + Prisma Guide: https://docs.nestjs.com/recipes/prisma]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (create-story + dev-story workflows)

### Debug Log References

None

### Completion Notes List

**Story Creation (2026-01-28):**
- Story created with comprehensive Prisma ORM and SQLite integration context
- All architecture requirements, NestJS integration patterns, and migration best practices embedded

**Implementation (2026-01-28):**
- ✅ Prisma 5.22.0 installed (@prisma/client + prisma CLI)
- ✅ Note: Downgraded from 7.3.0 to 5.22.0 for Node.js v21.5.0 compatibility
- ✅ Prisma initialized with SQLite datasource
- ✅ DATABASE_URL configured to `file:../../yoyimmo-data/database/yoyimmo.db`
- ✅ User model added to schema.prisma (id UUID, email unique, passwordHash, createdAt)
- ✅ Initial migration created and applied (20260128204616_init)
- ✅ SQLite database created at yoyimmo-data/database/yoyimmo.db (24KB)
- ✅ Prisma Client auto-generated with TypeScript types
- ✅ PrismaService created with lifecycle hooks (onModuleInit/onModuleDestroy)
- ✅ PrismaModule created as @Global module
- ✅ PrismaModule imported in AppModule
- ✅ Unit tests created and passing (4/4 tests)
- ✅ E2E tests created and passing (6/6 User CRUD tests)
- ✅ All 5 tasks and 19 subtasks completed successfully

**Key Technical Decisions:**
- Used Prisma 5.x instead of 7.x due to Node.js version compatibility
- Database file stored in external yoyimmo-data/ volume (Docker-ready)
- @Global decorator on PrismaModule for singleton pattern
- Comprehensive test coverage (unit + e2e) ensures database integration works correctly

### File List

**Created Files:**
- apps/backend/prisma/schema.prisma (Prisma schema with User model)
- apps/backend/prisma/migrations/20260128204616_init/migration.sql (Initial migration)
- apps/backend/prisma/migrations/migration_lock.toml (Migration lock file)
- apps/backend/src/database/prisma.service.ts (PrismaService with lifecycle hooks)
- apps/backend/src/database/prisma.module.ts (Global PrismaModule)
- apps/backend/src/database/prisma.service.spec.ts (Unit tests - 4 tests passing)
- apps/backend/test/prisma.e2e-spec.ts (E2E tests - 6 tests passing)
- yoyimmo-data/database/yoyimmo.db (SQLite database file)

**Modified Files:**
- apps/backend/package.json (added @prisma/client@5.22.0 and prisma@5.22.0)
- apps/backend/.env (updated DATABASE_URL to yoyimmo-data path)
- apps/backend/src/app.module.ts (imported PrismaModule)

**Story File:**
- F:\App\BMAD\_bmad-output\implementation-artifacts\1-2-prisma-orm-setup-with-sqlite.md (this file)
