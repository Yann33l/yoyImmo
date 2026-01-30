# Story 1.6: React Query Setup for State Management

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to configure React Query (TanStack Query) for server state management,
So that I have intelligent caching, automatic refetching, and optimistic updates.

## Acceptance Criteria

**AC1: React Query Installation**

**Given** the React frontend is running
**When** I verify React Query is installed
**Then** @tanstack/react-query is in package.json (already done in Story 1-1)

**AC2: QueryClient Configuration**

**Given** React Query is installed
**When** I update the QueryClient with default options:
- `staleTime: 1000 * 60 * 5` (5 minutes)
- `retry: 3`
- `refetchOnWindowFocus: true`
**Then** the QueryClient is configured with sensible defaults

**AC3: QueryClientProvider Integration**

**Given** QueryClient is configured
**When** I wrap the app with `<QueryClientProvider client={queryClient}>`
**Then** React Query hooks are available throughout the application

**AC4: API Client Setup**

**Given** React Query is set up
**When** I create an API client at `src/services/api.ts` with base URL `http://localhost:3000/api/v1`
**Then** the API client is configured for making HTTP requests
**And** the API client includes error interceptors

**AC5: Test Query Hook**

**Given** API client and React Query are configured
**When** I create a test query hook `useHealthCheck` that calls `/api/v1/health`
**Then** the hook returns `{ data, isLoading, isError, error }` states
**And** React Query automatically caches the response
**And** React Query handles loading and error states

**AC6: React Query DevTools**

**Given** the test query works
**When** I add React Query DevTools in development mode
**Then** DevTools are accessible at the bottom of the screen
**And** I can inspect queries, mutations, and cache state

## Tasks / Subtasks

- [x] Task 1: Update QueryClient Configuration (AC: 2)
  - [x] Subtask 1.1: Update `src/providers/QueryProvider.tsx` with retry: 3
  - [x] Subtask 1.2: Update refetchOnWindowFocus to true (currently false)
  - [x] Subtask 1.3: Verify staleTime is 5 minutes (already correct)

- [x] Task 2: Integrate QueryProvider in App (AC: 3)
  - [x] Subtask 2.1: Update `src/main.tsx` to wrap App with QueryProvider
  - [x] Subtask 2.2: Verify React Query context is available in components

- [x] Task 3: Create API Client (AC: 4)
  - [x] Subtask 3.1: Create `src/services/api.ts` with Axios instance
  - [x] Subtask 3.2: Configure base URL as `http://localhost:3000/api/v1`
  - [x] Subtask 3.3: Add request interceptor for auth headers (prepare for future JWT)
  - [x] Subtask 3.4: Add response interceptor for error handling
  - [x] Subtask 3.5: Export typed API methods (get, post, put, delete, patch)

- [x] Task 4: Create useHealthCheck Hook (AC: 5)
  - [x] Subtask 4.1: Create `src/hooks/useHealthCheck.ts`
  - [x] Subtask 4.2: Use useQuery with queryKey ['health']
  - [x] Subtask 4.3: Return { data, isLoading, isError, error, refetch }
  - [x] Subtask 4.4: Add TypeScript types for health response

- [x] Task 5: Install and Configure React Query DevTools (AC: 6)
  - [x] Subtask 5.1: Install @tanstack/react-query-devtools
  - [x] Subtask 5.2: Add ReactQueryDevtools to QueryProvider (dev mode only)
  - [x] Subtask 5.3: Verify DevTools appear in browser (build successful)

- [x] Task 6: Update App to Use useHealthCheck (AC: 5)
  - [x] Subtask 6.1: Refactor App.tsx to use useHealthCheck instead of direct axios
  - [x] Subtask 6.2: Display loading state with spinner icon
  - [x] Subtask 6.3: Display error state with destructive color
  - [x] Subtask 6.4: Added refetch button and timestamp display

- [x] Task 7: Verification & Testing (AC: All)
  - [x] Subtask 7.1: Run `npm run build` and verify no errors ✅
  - [x] Subtask 7.2: Build successful - ready for dev testing
  - [x] Subtask 7.3: DevTools configured in QueryProvider
  - [x] Subtask 7.4: Error handling via isError state

## Dev Notes

### Architecture Compliance Requirements (CRITICAL)

**ADR-010: State Management - React Query + Context**
- React Query (TanStack Query) for server state
- React Context for UI state (minimal)
- No Redux - React Query handles caching, sync, invalidation
- Optimistic updates for mutations
- Retry and background refetch built-in

**ADR-002: Framework Frontend - React with Vite + TypeScript**
- TypeScript types for all API responses
- Strict typing for query hooks

### Previous Story Intelligence

**Story 1-1: Project Initialization**
- @tanstack/react-query v5.90.20 already installed
- axios v1.6.2 already installed
- QueryProvider.tsx exists but NOT used in main.tsx
- Current QueryClient config missing retry: 3
- refetchOnWindowFocus currently false (should be true)

**Story 1-5: Frontend UI Library Setup**
- Path aliases @/ configured
- Tailwind CSS v4 + Shadcn/ui ready
- MainLayout with responsive sidebar
- Components in src/components/ui/

### Current Frontend State Analysis

**Already Done (from Story 1-1):**
```typescript
// src/providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // ✅ Correct
      refetchOnWindowFocus: false, // ❌ Should be true
      // ❌ Missing: retry: 3
    },
  },
});
```

**Missing:**
- QueryProvider not used in main.tsx
- No src/services/api.ts
- No hooks directory
- No React Query DevTools

### File Structure for This Story

```
apps/frontend/src/
├── main.tsx                    # UPDATE: Wrap with QueryProvider
├── providers/
│   └── QueryProvider.tsx       # UPDATE: Add retry, refetchOnWindowFocus, DevTools
├── services/
│   └── api.ts                  # NEW: Axios API client
├── hooks/
│   └── useHealthCheck.ts       # NEW: Health check query hook
└── App.tsx                     # UPDATE: Use useHealthCheck
```

### API Client Pattern (api.ts)

```typescript
import axios, { AxiosError, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token when available
api.interceptors.request.use(
  (config) => {
    // Future: Add JWT token from auth context
    // const token = getAuthToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Future: Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);

// Typed API methods
export const apiGet = <T>(url: string) => api.get<T>(url).then(res => res.data);
export const apiPost = <T>(url: string, data: unknown) => api.post<T>(url, data).then(res => res.data);
export const apiPut = <T>(url: string, data: unknown) => api.put<T>(url, data).then(res => res.data);
export const apiDelete = <T>(url: string) => api.delete<T>(url).then(res => res.data);
```

### useHealthCheck Hook Pattern

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/services/api';

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<HealthResponse>('/health'),
    staleTime: 1000 * 60, // 1 minute for health check
  });
}
```

### QueryProvider with DevTools

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Success Criteria Summary

This story is COMPLETE when:
- [ ] QueryClient configured with staleTime, retry, refetchOnWindowFocus
- [ ] QueryProvider wraps App in main.tsx
- [ ] API client created at src/services/api.ts with interceptors
- [ ] useHealthCheck hook created and working
- [ ] React Query DevTools installed and visible in dev mode
- [ ] App.tsx refactored to use useHealthCheck
- [ ] Loading and error states properly displayed
- [ ] `npm run build` succeeds
- [ ] Health check shows in DevTools cache

### References

- [Source: epics.md#Epic 1 Story 1.6]
- [Source: architecture.md#ADR-010 State Management]
- [TanStack Query v5 Docs](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (dev-story workflow)

### Debug Log References

None

### Completion Notes List

**Story Creation (2026-01-29):**
- Analyzed existing frontend state
- Found React Query partially set up from Story 1-1
- Identified gaps: QueryProvider not used, missing api.ts, missing hooks
- Architecture ADR-010 requirements extracted
- Code patterns provided for api.ts and useHealthCheck

**Implementation (2026-01-29):**
- Updated QueryClient with retry: 3 and refetchOnWindowFocus: true
- Wrapped App with QueryProvider in main.tsx
- Created API client at src/services/api.ts with typed methods and interceptors
- Created useHealthCheck hook with proper typing
- Installed @tanstack/react-query-devtools v5.91.2
- Added ReactQueryDevtools to QueryProvider
- Refactored App.tsx to use useHealthCheck hook
- Added refetch button with loading spinner
- Added timestamp display for last health check
- Build successful: CSS 5.26KB gzipped, JS 84.47KB gzipped

### File List

**Created:**
- apps/frontend/src/services/api.ts
- apps/frontend/src/hooks/useHealthCheck.ts
- apps/frontend/src/services/api-setup.ts (code review fix)
- apps/frontend/src/hooks/useHealthCheck.test.ts (code review fix)
- apps/frontend/.env (code review fix)
- apps/frontend/.env.example (code review fix)

**Modified:**
- apps/frontend/src/providers/QueryProvider.tsx (added retry, refetchOnWindowFocus, DevTools, conditional dev-only)
- apps/frontend/src/main.tsx (wrapped with QueryProvider + ToastProvider)
- apps/frontend/src/App.tsx (refactored to use useHealthCheck, API error handling setup)
- apps/frontend/src/services/api.ts (added env variable, timeout, updated interceptors)
- apps/frontend/src/hooks/useHealthCheck.ts (union type for status, simplified config)
- apps/frontend/package.json (added @tanstack/react-query-devtools + test deps)

**Code Review Fixes (2026-01-30):**
- Changed health status type from string to 'ok' | 'error' | 'degraded' union
- Added environment variable support (VITE_API_URL) with .env and .env.example
- Added API timeout configuration (10 seconds)
- Created toast notification system for API errors (ToastProvider, toast.tsx, api-setup.ts)
- Made React Query DevTools conditional on dev environment
- Simplified useHealthCheck config to avoid conflicts with global defaults
- Created comprehensive test suite (useHealthCheck.test.ts)
- Added loading skeleton to health check display
