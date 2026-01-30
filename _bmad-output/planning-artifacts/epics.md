---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
workflowType: 'epics-and-stories'
status: 'complete'
completedAt: '2026-01-28'
---

# YoyImmo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for YoyImmo, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1: Gestion des biens immobiliers**
- Création et configuration des propriétés avec leurs caractéristiques (adresse, type de location nu/meublé, surface, valeur d'achat)

**FR2: Gestion des locataires**
- Profils locataires avec informations de contact et historique

**FR3: Gestion des baux**
- Création et suivi des contrats de location avec dates de début/fin, montant du loyer, date de paiement prévue

**FR4: Validation ultra-rapide des loyers**
- 1-clic depuis la page d'accueil pour marquer un loyer comme payé (< 10 secondes)

**FR5: Gestion des paiements partiels**
- Support des paiements incomplets avec suivi du solde restant

**FR6: Rappels automatiques**
- Notification J-2 avant la date de paiement prévue pour anticiper les impayés

**FR7: Détection des impayés**
- Marquage et suivi des loyers non reçus

**FR8: Enregistrement des factures**
- Upload et catégorisation des charges déductibles

**FR9: Association automatique des factures aux biens**
- Chaque facture est liée au bien concerné

**FR10: Catégorisation fiscale des charges**
- Organisation des charges selon les catégories fiscales françaises (travaux, intérêts d'emprunt, assurances, charges de copropriété, etc.)

**FR11: Dashboard fiscal - Totaux annuels**
- Affichage des revenus locatifs totaux et charges déductibles totales

**FR12: Dashboard fiscal - Vue par bien**
- Détail des revenus et charges par propriété

**FR13: Export des données fiscales**
- Export structuré des montants pour faciliter la déclaration d'impôts

**FR14: Stockage local des documents**
- Organisation claire des baux, factures, et autres documents par propriété

**FR15: Recherche rapide de documents**
- Accès rapide à n'importe quel document en < 10 secondes

**FR16: Interface web moderne**
- Page d'accueil centralisée avec vue d'ensemble de tous les biens et statut des loyers

**FR17: Navigation intuitive**
- Accès rapide à toutes les fonctionnalités

**FR18: Design responsive**
- Utilisable sur desktop et mobile

### NonFunctional Requirements

**NFR1: Performance instantanée**
- Application locale instantanée (< 100ms), aucune latence réseau

**NFR2: Dashboard rapide**
- Dashboard charge en < 2 secondes

**NFR3: Disponibilité locale**
- Toujours disponible en local (pas de dépendance cloud/réseau), disponibilité 100%

**NFR4: Fiabilité**
- 0 bugs critiques, < 5 bugs mineurs
- Aucune perte de données, stockage local fiable

**NFR5: Sécurité**
- Authentification utilisateur
- Stockage local avec contrôle total des données par l'utilisateur
- Pas d'envoi de données vers le cloud sans consentement explicite

**NFR6: Scalabilité**
- Support jusqu'à 50 biens sans dégradation
- Performance reste fluide de 1 à 10+ biens

**NFR7: Évolutivité multi-utilisateurs**
- Architecture prête pour multi-utilisateurs et comptes partagés

**NFR8: Évolutivité cloud**
- Architecture prête pour migration cloud future

**NFR9: Simplicité d'adoption**
- Utilisateur opérationnel en < 30 minutes (setup + premier bien configuré)
- Interface suffisamment intuitive pour ne pas nécessiter de documentation

### Additional Requirements

#### Architecture - Starter Templates et Configuration Initiale

**ARCH-001: Starter Template Frontend**
- Utiliser Vite CLI avec template React-TypeScript
- Commande: `npm create vite@latest yoyimmo-frontend -- --template react-ts`

**ARCH-002: Starter Template Backend**
- Utiliser NestJS CLI pour initialisation backend
- Commande: `npx @nestjs/cli@latest new yoyimmo-backend`

**ARCH-003: ORM Setup**
- Ajouter Prisma avec SQLite comme datasource
- Commande: `npx prisma init --datasource-provider sqlite`

**ARCH-004: Docker Compose Setup**
- Configuration Docker Compose orchestrant frontend et backend
- Volume externe `./yoyimmo-data:/app/data` pour persistance
- Ports: Backend 3000, Frontend 8080

#### Architecture - Stack Technologique

**ARCH-005: Database**
- SQLite 3.x comme base relationnelle locale
- Prisma 5.x comme ORM avec abstraction pour migration PostgreSQL future
- Schéma avec 9 modèles: User, Property, Tenant, Lease, Rent, Invoice, Document, Notification, FiscalData

**ARCH-006: Backend Framework**
- NestJS 10+ avec TypeScript
- Architecture modulaire: 9 modules (auth + 6 domaines métier + 2 transversaux)
- Structure: properties, tenants, leases, rents, invoices, documents, notifications, fiscal, common

**ARCH-007: Frontend Framework**
- React 18+ avec Vite 5.x
- TypeScript 5.x en mode strict
- React Router v6 pour navigation SPA

**ARCH-008: État et Cache**
- React Query (TanStack Query) pour gestion état serveur et cache intelligent
- React Context pour état UI minimal (session, préférences)

**ARCH-009: UI Library**
- Shadcn/ui pour composants accessibles (ARIA)
- Tailwind CSS pour styling
- Composants: Forms, Tables, Dialogs, Dropdowns, Date Picker, File Upload, Toast

**ARCH-010: Validation**
- Backend: class-validator + class-transformer (ValidationPipe NestJS)
- Frontend: Zod pour schémas de validation TypeScript-first avec react-hook-form

**ARCH-011: Authentication**
- JWT (Access + Refresh tokens) stockés dans httpOnly cookies
- bcrypt pour hashing des mots de passe
- @nestjs/passport + @nestjs/jwt
- Guards et Strategies NestJS

**ARCH-012: API Architecture**
- REST API avec endpoints RESTful standard
- Versioning: `/api/v1/{resource}`
- Documentation: Swagger/OpenAPI 3.0 via @nestjs/swagger accessible sur `/api/docs`

**ARCH-013: Upload de Fichiers**
- Multer via @nestjs/platform-express
- Validation MIME types (PDF, JPEG, PNG) et taille max 10MB
- Stockage dans volume Docker externe `/app/data/documents`

**ARCH-014: Notifications**
- @nestjs/schedule pour cron jobs (rappels automatiques)
- Cron quotidien 9h00 pour vérification loyers J-2
- Notifications in-app (pas d'email dans MVP)

**ARCH-015: Logging**
- Winston via nest-winston
- Logs structurés (JSON) avec niveaux (error, warn, info, debug)
- Fichiers: `/app/data/logs/error.log`, `/app/data/logs/combined.log`

**ARCH-016: Error Handling**
- Backend: NestJS Exception Filters avec réponses standardisées
- Frontend: Error Boundaries React + Toast notifications

**ARCH-017: Testing**
- Backend: Jest (unit + e2e) pré-configuré NestJS
- Frontend: Jest + React Testing Library
- Cibles MVP: Services backend > 80%, Composants frontend > 70%

#### Architecture - Persistance et Backup

**ARCH-018: Volume Externe Docker**
- Dossier `./yoyimmo-data` monté sur `/app/data` dans container
- Structure: database/, documents/, backups/, logs/
- Garantit persistance lors migration PC ou réinstallation Docker

**ARCH-019: Auto-Backup Quotidien**
- Cron job 3h00 du matin
- Archive .zip de `/app/data` (BDD + documents)
- Rotation 30 jours (suppression automatique backups > 30j)

**ARCH-020: Export/Import Manuel**
- Bouton UI pour export manuel: génère `yoyimmo-backup-{date}.zip`
- Écran initial si base vide: upload .zip pour restauration
- Validation intégrité avec checksum

#### Architecture - Patterns d'Implémentation

**ARCH-021: Naming Patterns - Database**
- Modèles Prisma: PascalCase singulier (User, Property, Lease)
- Colonnes: camelCase (userId, createdAt, monthlyRent)
- Foreign Keys: {model}Id (userId, propertyId, tenantId)
- Relations: camelCase pluriel pour one-to-many (properties, leases)

**ARCH-022: Naming Patterns - API**
- Endpoints: `/api/v1/{resource-pluriel}` (plural resources)
- Query parameters: camelCase
- Actions: verbe en fin kebab-case (mark-paid, refresh-token)

**ARCH-023: Naming Patterns - Backend Code**
- Fichiers: kebab-case (properties.controller.ts, properties.service.ts)
- Classes: PascalCase (PropertiesController, PropertiesService, CreatePropertyDto)
- Méthodes: camelCase (findAll, create, calculateMonthlyRevenue)
- Constantes: SCREAMING_SNAKE_CASE (MAX_FILE_SIZE)

**ARCH-024: Naming Patterns - Frontend Code**
- Fichiers composants: PascalCase (PropertyCard.tsx, PropertyList.tsx)
- Hooks customs: camelCase avec préfixe use (useProperties, useAuth)
- Utilitaires: camelCase (formatCurrency, formatDate)

**ARCH-025: Structure Pattern - Tests Co-Located**
- Tests à côté des fichiers testés
- Suffixe: .spec.ts (backend), .test.tsx (frontend)
- Exemple: properties.service.spec.ts, PropertyCard.test.tsx

**ARCH-026: Format Pattern - API Responses**
- Success: données directes (pas de wrapper {data: ...})
- Erreurs: {statusCode, message, errors[], timestamp, path}
- Dates: ISO 8601 format (DateTime Prisma → ISO string)

**ARCH-027: Format Pattern - JSON Fields**
- Nomenclature: camelCase pour tous les champs JSON
- Booléens: true/false (jamais 1/0)
- Null: explicite pour champs optionnels

**ARCH-028: Communication Pattern - React Query Keys**
- Format array: ['domain', id?, filters?]
- Exemples: ['properties'], ['properties', id], ['rents', {status: 'pending'}]

**ARCH-029: Communication Pattern - Events**
- Nommage: SCREAMING_SNAKE_CASE (RENT_REMINDER, PAYMENT_RECEIVED)
- Payload structuré avec timestamp et metadata

**ARCH-030: Process Pattern - Loading States**
- React Query gère automatiquement isLoading, isError, isSuccess
- Skeleton UI pour chargements initiaux
- Optimistic updates pour mutations rapides

**ARCH-031: Process Pattern - Error Recovery**
- React Query retry automatique (3 tentatives)
- Error boundaries pour erreurs UI critiques
- Toast notifications pour erreurs utilisateur

**ARCH-032: Deployment Pattern - Two-Phase Strategy**
- Phase 1 (MVP): Docker Compose pour itérations rapides
- Phase 2 (Production): Electron ou Tauri pour installation 1-clic
- Volume externe garantit migration facile entre phases

### FR Coverage Map

**Functional Requirements:**

- **FR1** → Epic 3: Property & Tenant Management - Créer et configurer biens immobiliers
- **FR2** → Epic 3: Property & Tenant Management - Ajouter et gérer locataires
- **FR3** → Epic 4: Lease Contract Management - Créer et suivre contrats de location (baux)
- **FR4** → Epic 5: Rent Tracking & Payment Validation - Validation ultra-rapide loyers (1-clic < 10 sec)
- **FR5** → Epic 5: Rent Tracking & Payment Validation - Gestion paiements partiels
- **FR6** → Epic 9: Automated Notifications & Reminders - Rappels automatiques J-2
- **FR7** → Epic 5: Rent Tracking & Payment Validation - Détection et marquage impayés
- **FR8** → Epic 8: Invoice & Expense Tracking - Enregistrement factures (upload)
- **FR9** → Epic 8: Invoice & Expense Tracking - Association factures aux biens
- **FR10** → Epic 8: Invoice & Expense Tracking - Catégorisation fiscale charges
- **FR11** → Epic 6: Fiscal Dashboard & Tax Preparation - Dashboard fiscal totaux annuels
- **FR12** → Epic 6: Fiscal Dashboard & Tax Preparation - Dashboard fiscal vue par bien
- **FR13** → Epic 6: Fiscal Dashboard & Tax Preparation - Export données fiscales
- **FR14** → Epic 7: Document Storage & Quick Search - Stockage local documents organisé
- **FR15** → Epic 7: Document Storage & Quick Search - Recherche rapide documents (< 10 sec)
- **FR16** → Transversal (tous epics) - Interface web moderne
- **FR17** → Transversal (tous epics) - Navigation intuitive
- **FR18** → Transversal (tous epics) - Design responsive

**Non-Functional Requirements:**

- **NFR1** → Transversal (tous epics) - Performance instantanée (< 100ms)
- **NFR2** → Epic 6: Fiscal Dashboard & Tax Preparation - Dashboard charge < 2 sec
- **NFR3** → Transversal (tous epics) - Disponibilité locale 100%
- **NFR4** → Transversal (tous epics) - Fiabilité (0 bugs critiques, aucune perte données)
- **NFR5** → Epic 2: User Authentication & Data Security - Sécurité authentification et données
- **NFR6** → Epic 3, 4, 5 - Scalabilité support 50 biens
- **NFR7** → Epic 2: User Authentication & Data Security - Évolutivité multi-utilisateurs (architecture)
- **NFR8** → Architecture globale - Évolutivité cloud (Prisma ORM abstraction)
- **NFR9** → Epic 1: Application Setup & Infrastructure - Simplicité adoption (< 30 min)

**Architecture Requirements:**

- **ARCH-001 à ARCH-004** → Epic 1: Application Setup & Infrastructure - Starters & Docker setup
- **ARCH-005 à ARCH-010** → Epic 1: Application Setup & Infrastructure - Stack technologique
- **ARCH-011** → Epic 2: User Authentication & Data Security - Authentification JWT
- **ARCH-012** → Epic 1: Application Setup & Infrastructure - API REST & Swagger
- **ARCH-013** → Epic 7 & Epic 8 - Upload fichiers Multer
- **ARCH-014** → Epic 9: Automated Notifications & Reminders - Notifications & Cron jobs
- **ARCH-015** → Epic 1: Application Setup & Infrastructure - Logging Winston
- **ARCH-016** → Epic 1 & Epic 2 - Error handling
- **ARCH-017** → Transversal (tous epics) - Testing Jest
- **ARCH-018 à ARCH-020** → Epic 1: Application Setup & Infrastructure - Persistance & Backup
- **ARCH-021 à ARCH-031** → Transversal (tous epics) - Patterns implémentation
- **ARCH-032** → Epic 1: Application Setup & Infrastructure - Déploiement bi-phasé

**Coverage Summary:**
- ✅ 18/18 Functional Requirements mapped
- ✅ 9/9 Non-Functional Requirements mapped
- ✅ 32/32 Architecture Requirements mapped
- ✅ 100% coverage across 9 epics

## Epic List

### Epic 1: Application Setup & Infrastructure

**User Value:** "Installer et démarrer YoyImmo localement en moins de 30 minutes avec toutes mes données sécurisées"

**User Outcomes:**
- Installer Docker Compose et démarrer l'application
- Accéder à YoyImmo via navigateur
- Avoir la garantie que mes données sont persistantes (volume externe)
- Pouvoir migrer entre PCs facilement

**FRs covered:** Infrastructure habilitante (pas de FRs directs)
**NFRs covered:** NFR9 (simplicité adoption)
**ARCHs covered:** ARCH-001, ARCH-002, ARCH-003, ARCH-004, ARCH-005, ARCH-006, ARCH-007, ARCH-008, ARCH-009, ARCH-010, ARCH-012, ARCH-015, ARCH-016, ARCH-017, ARCH-018, ARCH-019, ARCH-020, ARCH-032

---

### Epic 2: User Authentication & Data Security

**User Value:** "Protéger mes données financières sensibles avec un accès sécurisé personnel"

**User Outcomes:**
- Créer mon compte utilisateur
- Me connecter de manière sécurisée (JWT httpOnly)
- Gérer mon profil
- Avoir mes données isolées et protégées

**FRs covered:** Sécurité transversale (pas de FRs directs)
**NFRs covered:** NFR5 (sécurité), NFR7 (évolutivité multi-utilisateurs)
**ARCHs covered:** ARCH-011, ARCH-016

---

### Epic 3: Property & Tenant Management

**User Value:** "Enregistrer et gérer mon patrimoine immobilier avec tous mes locataires"

**User Outcomes:**
- Créer et configurer mes biens immobiliers (adresse, surface, type, prix achat)
- Ajouter et gérer mes locataires (infos contact, historique)
- Voir la liste complète de mon patrimoine
- Consulter les détails de chaque bien

**FRs covered:** FR1, FR2
**NFRs covered:** NFR1 (performance instantanée), NFR6 (scalabilité 50 biens)
**ARCHs covered:** ARCH-008, ARCH-009, ARCH-010, ARCH-021 à ARCH-027

---

### Epic 4: Lease Contract Management

**User Value:** "Créer et suivre tous mes contrats de location avec dates et montants"

**User Outcomes:**
- Créer des baux de location (dates début/fin, montant loyer, date paiement)
- Associer un bail à un bien et un locataire
- Voir l'historique des baux par bien
- Consulter les baux actifs et terminés

**FRs covered:** FR3
**NFRs covered:** NFR1, NFR6
**ARCHs covered:** ARCH-008, ARCH-009, ARCH-010, ARCH-021 à ARCH-027

---

### Epic 5: Rent Tracking & Payment Validation

**User Value:** "Valider mes loyers en 1-clic et suivre les paiements partiels et impayés"

**User Outcomes:**
- Valider un loyer payé en < 10 secondes depuis la page d'accueil (1-clic)
- Gérer les paiements partiels avec suivi du solde restant
- Détecter et marquer les loyers impayés
- Voir l'historique complet des paiements par bien

**FRs covered:** FR4, FR5, FR7
**NFRs covered:** NFR1 (< 100ms), NFR2 (dashboard < 2 sec)
**ARCHs covered:** ARCH-008, ARCH-009, ARCH-010, ARCH-026, ARCH-030

---

### Epic 6: Fiscal Dashboard & Tax Preparation

**User Value:** "Préparer ma déclaration fiscale en moins de 1 heure avec tous les totaux pré-calculés"

**User Outcomes:**
- Voir mes revenus locatifs totaux et charges déductibles totales (année fiscale)
- Consulter le détail par bien (revenus vs charges)
- Exporter les données structurées pour ma déclaration d'impôts
- Passer de 10-15h à < 1h de préparation fiscale

**FRs covered:** FR11, FR12, FR13
**NFRs covered:** NFR2 (dashboard < 2 sec)
**ARCHs covered:** ARCH-008, ARCH-026

---

### Epic 7: Document Storage & Quick Search

**User Value:** "Stocker tous mes documents et retrouver n'importe lequel en moins de 10 secondes"

**User Outcomes:**
- Stocker baux, factures, diagnostics organisés par bien
- Rechercher et retrouver n'importe quel document en < 10 secondes
- Télécharger et consulter mes documents à tout moment
- Avoir mes documents sauvegardés localement avec backup automatique

**FRs covered:** FR14, FR15
**NFRs covered:** NFR3 (disponibilité locale), NFR4 (aucune perte données)
**ARCHs covered:** ARCH-013, ARCH-018, ARCH-019, ARCH-020

---

### Epic 8: Invoice & Expense Tracking

**User Value:** "Enregistrer et catégoriser toutes mes charges déductibles par bien"

**User Outcomes:**
- Uploader des factures en < 60 secondes
- Associer automatiquement chaque facture au bien concerné
- Catégoriser selon les catégories fiscales françaises (travaux, intérêts, assurances, etc.)
- Voir l'historique des dépenses par bien

**FRs covered:** FR8, FR9, FR10
**NFRs covered:** NFR1
**ARCHs covered:** ARCH-013, ARCH-026

---

### Epic 9: Automated Notifications & Reminders

**User Value:** "Être alerté automatiquement J-2 avant les échéances de loyer pour anticiper les impayés"

**User Outcomes:**
- Recevoir des rappels automatiques 2 jours avant chaque loyer
- Ne plus avoir à suivre manuellement les dates de paiement
- Être notifié des loyers en retard
- Consulter mon historique de notifications

**FRs covered:** FR6
**NFRs covered:** NFR3 (disponibilité locale 100%)
**ARCHs covered:** ARCH-014, ARCH-029

---

## Epic 1: Application Setup & Infrastructure

**Epic Goal:** Installer et démarrer YoyImmo localement en moins de 30 minutes avec toutes mes données sécurisées

### Story 1.1: Project Initialization with Starter Templates

As a developer,
I want to initialize the YoyImmo project with official starter templates (Vite + NestJS),
So that I have a solid foundation with modern tooling and best practices.

**Acceptance Criteria:**

**Given** I have Node.js and npm installed
**When** I execute the frontend initialization command `npm create vite@latest yoyimmo-frontend -- --template react-ts`
**Then** a new Vite project is created with React 18+ and TypeScript 5.x
**And** the frontend starts on `http://localhost:5173` with Hot Module Replacement working

**Given** I have Node.js and npm installed
**When** I execute the backend initialization command `npx @nestjs/cli@latest new yoyimmo-backend`
**Then** a new NestJS project is created with TypeScript
**And** the backend starts on `http://localhost:3000` with auto-reload working
**And** Jest is pre-configured for unit and e2e tests

**Given** both projects are initialized
**When** I run `npm install` in both directories
**Then** all dependencies install successfully without errors
**And** the project structure follows ARCH-001 and ARCH-002 specifications

---

### Story 1.2: Prisma ORM Setup with SQLite

As a developer,
I want to configure Prisma ORM with SQLite as the database provider,
So that I have type-safe database access with migration capabilities.

**Acceptance Criteria:**

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

---

### Story 1.3: Docker Compose Configuration with External Volume

As a developer,
I want to configure Docker Compose to orchestrate frontend and backend with an external persistent volume,
So that the application runs consistently and data persists across container restarts.

**Acceptance Criteria:**

**Given** frontend and backend projects are initialized
**When** I create a `docker-compose.yml` at the project root
**Then** it defines services for `frontend` and `backend` with version 3.8+

**Given** docker-compose.yml is created
**When** I configure the backend service with:
- Build context: `./backend`
- Ports: `3000:3000`
- Volume mount: `./yoyimmo-data:/app/data`
**Then** the backend container has access to the external `yoyimmo-data` directory

**Given** docker-compose.yml is configured
**When** I configure the frontend service with:
- Build context: `./frontend`
- Ports: `8080:80` (production build served via nginx)
**Then** the frontend is accessible on port 8080

**Given** Docker Compose is fully configured
**When** I run `docker-compose up -d`
**Then** both containers start successfully
**And** frontend is accessible at `http://localhost:8080`
**And** backend is accessible at `http://localhost:3000`
**And** the `./yoyimmo-data` directory exists and is mounted correctly

**Given** containers are running
**When** I create a file in `/app/data` inside the backend container
**Then** the file appears in `./yoyimmo-data` on the host machine
**And** data persists after running `docker-compose down` and `docker-compose up`

---

### Story 1.4: Core Infrastructure Setup (Logging, Error Handling, API Docs)

As a developer,
I want to configure logging, error handling, and API documentation,
So that the application has proper observability and developer experience.

**Acceptance Criteria:**

**Given** the NestJS backend is running
**When** I install and configure Winston via `nest-winston`
**Then** structured JSON logs are written to console
**And** error logs are written to `/app/data/logs/error.log`
**And** combined logs are written to `/app/data/logs/combined.log`
**And** log entries include timestamp, level, message, and context

**Given** Winston is configured
**When** an unhandled exception occurs in a controller
**Then** a global Exception Filter catches it
**And** returns a standardized error response: `{statusCode, message, errors[], timestamp, path}`
**And** the error is logged with full stack trace

**Given** the backend is running
**When** I install and configure `@nestjs/swagger`
**Then** Swagger documentation is accessible at `http://localhost:3000/api/docs`
**And** the API documentation includes title "YoyImmo API", version "1.0", and description
**And** all future endpoints will be auto-documented using decorators

**Given** core infrastructure is set up
**When** I verify the setup with a test endpoint `/api/v1/health`
**Then** it returns `{status: 'ok', timestamp: ISO8601}` with 200 status
**And** the request/response is logged via Winston
**And** the endpoint appears in Swagger documentation

---

### Story 1.5: Frontend UI Library Setup (Shadcn/ui + Tailwind)

As a developer,
I want to set up Tailwind CSS and Shadcn/ui components,
So that I have a consistent, accessible design system for building the UI.

**Acceptance Criteria:**

**Given** the Vite React project is initialized
**When** I install Tailwind CSS with `npm install -D tailwindcss postcss autoprefixer`
**And** I run `npx tailwindcss init -p`
**Then** `tailwind.config.js` and `postcss.config.js` are created

**Given** Tailwind is installed
**When** I configure Tailwind content paths to include `./src/**/*.{js,ts,jsx,tsx}`
**And** I add Tailwind directives to `src/index.css`
**Then** Tailwind utility classes are available throughout the application
**And** the production build tree-shakes unused CSS

**Given** Tailwind is configured
**When** I run `npx shadcn-ui@latest init`
**Then** Shadcn/ui is initialized with configuration for Tailwind
**And** a `components.json` configuration file is created

**Given** Shadcn/ui is initialized
**When** I add base components with `npx shadcn-ui@latest add button form input table dialog select`
**Then** components are copied to `src/components/ui/`
**And** components are accessible, following ARIA best practices
**And** components are fully customizable (not a package dependency)

**Given** UI library is set up
**When** I create a basic layout component with navigation sidebar
**Then** the layout uses Shadcn/ui components and Tailwind styling
**And** the layout is responsive (desktop and mobile)
**And** the application has a consistent look and feel

---

### Story 1.6: React Query Setup for State Management

As a developer,
I want to configure React Query (TanStack Query) for server state management,
So that I have intelligent caching, automatic refetching, and optimistic updates.

**Acceptance Criteria:**

**Given** the React frontend is running
**When** I install React Query with `npm install @tanstack/react-query`
**Then** React Query is added to package.json

**Given** React Query is installed
**When** I create a QueryClient with default options:
- `staleTime: 1000 * 60 * 5` (5 minutes)
- `retry: 3`
- `refetchOnWindowFocus: true`
**Then** the QueryClient is configured with sensible defaults

**Given** QueryClient is configured
**When** I wrap the app with `<QueryClientProvider client={queryClient}>`
**Then** React Query hooks are available throughout the application

**Given** React Query is set up
**When** I install Axios with `npm install axios`
**And** I create an API client at `src/services/api.ts` with base URL `http://localhost:3000/api/v1`
**Then** the API client is configured for making HTTP requests
**And** the API client includes error interceptors

**Given** API client and React Query are configured
**When** I create a test query hook `useHealthCheck` that calls `/api/v1/health`
**Then** the hook returns `{ data, isLoading, isError, error }` states
**And** React Query automatically caches the response
**And** React Query handles loading and error states

**Given** the test query works
**When** I add React Query DevTools in development mode
**Then** DevTools are accessible at the bottom of the screen
**And** I can inspect queries, mutations, and cache state

---

### Story 1.7: Backup & Restore System

As a user,
I want automatic backups and manual export/import capabilities,
So that my data is protected and I can migrate between computers easily.

**Acceptance Criteria:**

**Given** the backend is running with volume mounted at `/app/data`
**When** I configure a cron job using `@nestjs/schedule` to run daily at 3:00 AM
**Then** the cron job executes a backup task automatically

**Given** the backup cron job runs
**When** the backup task executes
**Then** it creates a ZIP archive of `/app/data` (database + documents)
**And** the archive is named `yoyimmo-backup-YYYY-MM-DD.zip`
**And** the archive is saved to `/app/data/backups/`
**And** backups older than 30 days are automatically deleted (rotation)

**Given** the backend API is available
**When** I create an endpoint `POST /api/v1/backup/export`
**Then** it generates a backup ZIP immediately (same format as auto-backup)
**And** returns the ZIP file for download via HTTP response
**And** the operation is logged

**Given** the backup system is working
**When** I create an endpoint `POST /api/v1/backup/import` accepting a ZIP file
**Then** it validates the ZIP structure and integrity (checksum)
**And** extracts the contents to `/app/data`
**And** replaces the existing database and documents
**And** returns success or error response

**Given** the import endpoint exists
**When** the application starts with an empty database
**Then** a frontend screen prompts: "Upload backup to restore data"
**And** provides a file upload button that calls the import endpoint
**And** displays progress and success/error messages

**Given** backup/restore is fully implemented
**When** I test the complete migration workflow:
1. Export backup from "PC 1"
2. Copy backup file to "PC 2"
3. Import backup on "PC 2"
**Then** all data (database + documents) is successfully migrated
**And** the application works identically on "PC 2"

---

## Epic 2: User Authentication & Data Security

**Epic Goal:** Protéger mes données financières sensibles avec un accès sécurisé personnel

### Story 2.1: User Registration with Password Hashing

As a user,
I want to create an account with email and password,
So that I can securely access my property management data.

**Acceptance Criteria:**

**Given** the backend has the User model in Prisma schema
**When** I create a POST endpoint `/api/v1/auth/register` accepting `{email, password}`
**Then** the endpoint validates email format and password strength (min 8 chars, 1 uppercase, 1 number)
**And** returns 400 with error details if validation fails

**Given** valid registration data is submitted
**When** the password is hashed using bcrypt with salt rounds = 10
**Then** only the hash is stored in the database (never plain text)
**And** the original password is never logged or exposed

**Given** a user tries to register with an existing email
**When** the registration endpoint is called
**Then** it returns 409 Conflict with message "Email already exists"
**And** no duplicate user is created

**Given** registration is successful
**When** a new user is created
**Then** the response returns 201 Created with `{id, email, createdAt}` (no password)
**And** the user record is stored in the database
**And** the operation is logged (without sensitive data)

---

### Story 2.2: User Login with JWT Authentication

As a user,
I want to log in with my email and password,
So that I can access my protected property data.

**Acceptance Criteria:**

**Given** the backend has JWT dependencies installed (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`)
**When** I create a POST endpoint `/api/v1/auth/login` accepting `{email, password}`
**Then** the endpoint validates the input format

**Given** valid credentials are submitted
**When** the login endpoint verifies the email exists in the database
**And** compares the password with the stored hash using bcrypt
**Then** if credentials are valid, generate a JWT access token (expires in 15 minutes)
**And** generate a JWT refresh token (expires in 7 days)

**Given** JWT tokens are generated
**When** the login response is sent
**Then** the access token is set as an httpOnly cookie named `access_token`
**And** the refresh token is set as an httpOnly cookie named `refresh_token`
**And** both cookies have `secure: true` in production and `sameSite: 'strict'`
**And** the response body returns `{user: {id, email}, message: 'Login successful'}`

**Given** invalid credentials are submitted
**When** the email doesn't exist or password is incorrect
**Then** return 401 Unauthorized with message "Invalid credentials"
**And** do not reveal which part (email/password) is incorrect (security)

---

### Story 2.3: JWT Refresh Token Implementation

As a user,
I want my session to refresh automatically,
So that I don't have to log in repeatedly while using the application.

**Acceptance Criteria:**

**Given** the user has a valid refresh token in cookies
**When** I create a POST endpoint `/api/v1/auth/refresh`
**Then** the endpoint reads the refresh_token from httpOnly cookies

**Given** a valid refresh token is provided
**When** the token is verified and decoded
**Then** generate a new access token (15 minutes expiry)
**And** optionally rotate the refresh token (new 7-day token)
**And** set both as httpOnly cookies
**And** return 200 with `{message: 'Token refreshed'}`

**Given** the refresh token is invalid or expired
**When** the refresh endpoint is called
**Then** return 401 Unauthorized
**And** clear all auth cookies
**And** the frontend should redirect to login

**Given** the frontend API client is configured
**When** an API request receives 401 Unauthorized
**Then** automatically call `/api/v1/auth/refresh` to get a new token
**And** retry the original request with the new token
**And** if refresh fails, redirect to login page

---

### Story 2.4: Protected Routes with Auth Guards

As a developer,
I want to protect API endpoints with authentication,
So that only logged-in users can access their data.

**Acceptance Criteria:**

**Given** JWT authentication is configured
**When** I create a JwtAuthGuard using Passport's JWT strategy
**Then** the guard validates the access_token from httpOnly cookies
**And** decodes the token to extract user information (id, email)
**And** attaches the user to the request object

**Given** the JwtAuthGuard exists
**When** I apply `@UseGuards(JwtAuthGuard)` to a controller or route
**Then** unauthenticated requests return 401 Unauthorized
**And** authenticated requests proceed with `req.user` populated

**Given** the guard is applied to all future endpoints
**When** I create a decorator `@CurrentUser()` to extract user from request
**Then** controllers can access the authenticated user easily
**And** the pattern is consistent across all protected routes

**Given** a protected endpoint is called without authentication
**When** the request has no valid access token
**Then** return 401 with `{statusCode: 401, message: 'Unauthorized', timestamp, path}`
**And** the error follows the standardized format from Story 1.4

---

### Story 2.5: User Profile Management

As a user,
I want to view and update my profile information,
So that I can manage my account details.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** I create a GET endpoint `/api/v1/users/me` protected by JwtAuthGuard
**Then** it returns the current user's profile `{id, email, createdAt}`
**And** the password hash is never included in the response

**Given** the user wants to change their password
**When** I create a PATCH endpoint `/api/v1/users/me/password` accepting `{currentPassword, newPassword}`
**Then** it validates the currentPassword against the stored hash
**And** validates the newPassword meets strength requirements
**And** hashes the new password with bcrypt
**And** updates the database with the new hash
**And** returns 200 with message "Password updated successfully"

**Given** an incorrect current password is provided
**When** the password change endpoint is called
**Then** return 401 with message "Current password is incorrect"
**And** do not update the password

**Given** the user wants to log out
**When** I create a POST endpoint `/api/v1/auth/logout`
**Then** it clears all auth cookies (access_token, refresh_token)
**And** returns 200 with message "Logged out successfully"

**Given** the frontend has authentication state
**When** I implement login/logout functionality
**Then** the app redirects to dashboard after successful login
**And** redirects to login page after logout
**And** displays user email in the header when logged in

---

## Epic 3: Property & Tenant Management

**Epic Goal:** Enregistrer et gérer mon patrimoine immobilier avec tous mes locataires

### Story 3.1: Property Data Model and CRUD API

As a property owner,
I want to create and manage my properties,
So that I can track my real estate portfolio.

**Acceptance Criteria:**

**Given** the Prisma schema exists
**When** I add the Property model with fields:
- id (String UUID), userId (String), address (String), surface (Int), type (String), purchasePrice (Float optional), createdAt (DateTime)
**Then** the model follows ARCH-021 naming conventions (camelCase)
**And** userId establishes a relation to User model

**Given** the Property model is defined
**When** I run `npx prisma migrate dev --name add_property`
**Then** the migration creates the property table in SQLite
**And** Prisma Client types are regenerated

**Given** the Property table exists
**When** I create a PropertiesModule with controller, service, and DTOs
**Then** the module structure follows NestJS conventions from ARCH-023

**Given** the Properties module is set up
**When** I create POST `/api/v1/properties` endpoint accepting:
```typescript
{
  address: string,
  surface: number,
  type: 'furnished' | 'unfurnished',
  purchasePrice?: number
}
```
**Then** it validates the DTO using class-validator
**And** automatically associates the property with the authenticated user (req.user.id)
**And** returns 201 with the created property

**Given** properties exist for a user
**When** I create GET `/api/v1/properties` endpoint
**Then** it returns only properties belonging to the authenticated user
**And** supports query parameter `?type=furnished` for filtering
**And** returns properties sorted by createdAt descending

**Given** a specific property exists
**When** I create GET `/api/v1/properties/:id` endpoint
**Then** it returns the property if it belongs to the authenticated user
**And** returns 404 if property doesn't exist
**And** returns 403 if property belongs to another user

**Given** a property needs updating
**When** I create PATCH `/api/v1/properties/:id` endpoint accepting partial updates
**Then** it validates ownership before updating
**And** returns 200 with updated property
**And** only updates provided fields (partial update)

**Given** a property needs deletion
**When** I create DELETE `/api/v1/properties/:id` endpoint
**Then** it validates ownership before deleting
**And** returns 204 No Content on success
**And** all related data (leases, documents) cascade delete or are handled appropriately

---

### Story 3.2: Tenant Data Model and CRUD API

As a property owner,
I want to manage my tenant information,
So that I can track who is renting my properties.

**Acceptance Criteria:**

**Given** the Prisma schema exists
**When** I add the Tenant model with fields:
- id (String UUID), userId (String), firstName (String), lastName (String), email (String), phone (String optional), createdAt (DateTime)
**Then** the model follows naming conventions (camelCase, userId foreign key)
**And** userId establishes relation to User model

**Given** the Tenant model is defined
**When** I run the migration `npx prisma migrate dev --name add_tenant`
**Then** the tenant table is created
**And** Prisma Client is regenerated

**Given** the Tenant table exists
**When** I create a TenantsModule with controller, service, and DTOs
**Then** the module structure follows NestJS conventions

**Given** the Tenants module is set up
**When** I create POST `/api/v1/tenants` endpoint accepting:
```typescript
{
  firstName: string,
  lastName: string,
  email: string,
  phone?: string
}
```
**Then** it validates email format
**And** associates tenant with authenticated user
**And** returns 201 with created tenant

**Given** tenants exist
**When** I create GET `/api/v1/tenants` endpoint
**Then** it returns only tenants belonging to the authenticated user
**And** supports search by name: `?search=john`
**And** returns tenants sorted by lastName, firstName

**Given** a specific tenant exists
**When** I create GET `/api/v1/tenants/:id` endpoint
**Then** it returns the tenant if ownership is valid
**And** handles 404 and 403 appropriately

**Given** tenant information changes
**When** I create PATCH `/api/v1/tenants/:id` endpoint
**Then** it validates ownership and updates tenant
**And** returns 200 with updated tenant

**Given** a tenant is no longer needed
**When** I create DELETE `/api/v1/tenants/:id` endpoint
**Then** it validates no active leases exist for this tenant
**And** returns 400 if active leases exist with message "Cannot delete tenant with active leases"
**And** deletes successfully if no dependencies exist

---

### Story 3.3: Properties Frontend - List and Create

As a property owner,
I want to view and create properties through a user-friendly interface,
So that I can easily manage my portfolio.

**Acceptance Criteria:**

**Given** React Query and Shadcn/ui are configured
**When** I create a `src/services/propertiesApi.ts` file with:
- `fetchProperties()` - GET /api/v1/properties
- `createProperty(data)` - POST /api/v1/properties
**Then** all functions use the configured API client with auth

**Given** the API functions exist
**When** I create custom hooks in `src/hooks/useProperties.ts`:
- `useProperties()` - calls fetchProperties with React Query
- `useCreateProperty()` - mutation for creating property
**Then** hooks follow query key pattern: `['properties']`

**Given** the hooks exist
**When** I create a PropertiesPage component at `src/pages/PropertiesPage.tsx`
**Then** it uses useProperties() to fetch and display properties
**And** shows loading skeleton while fetching
**And** shows error toast if fetch fails
**And** displays properties in a Shadcn/ui Table component

**Given** the properties table is displayed
**When** each row shows: address, surface, type, purchasePrice, actions
**Then** the table is responsive
**And** includes "Add Property" button in the header

**Given** the user clicks "Add Property"
**When** a Dialog opens with a form using react-hook-form + Zod validation
**Then** the form includes fields: address, surface, type (select), purchasePrice (optional)
**And** validates address (min 5 chars), surface (positive number), type (enum)

**Given** the user submits the form with valid data
**When** the form calls useCreateProperty mutation
**Then** it shows loading state on submit button
**And** displays success toast on success
**And** closes dialog and invalidates `['properties']` query (refetch)
**And** the new property appears in the table

**Given** the form submission fails
**When** the API returns an error
**Then** display error toast with the error message
**And** keep the dialog open with form data intact

---

### Story 3.4: Tenants Frontend - List and Create

As a property owner,
I want to view and create tenants through a user-friendly interface,
So that I can manage my tenant relationships.

**Acceptance Criteria:**

**Given** the frontend architecture is established
**When** I create `src/services/tenantsApi.ts` with CRUD functions
**And** create `src/hooks/useTenants.ts` with custom hooks
**Then** the pattern matches the properties implementation from Story 3.3

**Given** the API and hooks exist
**When** I create TenantsPage component at `src/pages/TenantsPage.tsx`
**Then** it displays tenants in a Shadcn/ui Table
**And** shows columns: full name, email, phone, actions
**And** includes search functionality using query parameter

**Given** the search input exists
**When** the user types in the search field
**Then** it debounces the input (500ms)
**And** calls GET `/api/v1/tenants?search={query}`
**And** updates the table with filtered results

**Given** the user clicks "Add Tenant"
**When** a Dialog opens with a form
**Then** the form includes fields: firstName, lastName, email, phone (optional)
**And** validates email format and required fields

**Given** the form is submitted
**When** the mutation succeeds
**Then** show success toast, close dialog, refetch tenants
**And** handle errors appropriately

---

### Story 3.5: Property Details Page with Overview

As a property owner,
I want to see detailed information about a specific property,
So that I can access all related data in one place.

**Acceptance Criteria:**

**Given** a property exists
**When** the user clicks on a property row in the table
**Then** navigate to `/properties/:id` route
**And** render PropertyDetailsPage component

**Given** PropertyDetailsPage is rendered
**When** I use `useProperty(id)` hook to fetch property details
**Then** display property information in a card layout:
- Address (prominent header)
- Surface area with unit (m²)
- Type (Meublé/Non meublé)
- Purchase price (formatted as currency)
- Created date

**Given** the property details are displayed
**When** I add tabs for related sections: Overview, Leases, Documents
**Then** the Overview tab shows property summary
**And** includes an "Edit Property" button
**And** includes a "Delete Property" button (with confirmation)

**Given** the user clicks "Edit Property"
**When** a Dialog opens pre-filled with current values
**Then** allow editing all property fields
**And** use PATCH endpoint to update
**And** show success/error feedback

**Given** the user clicks "Delete Property"
**When** a confirmation dialog appears
**Then** warn about cascade deletion of related data
**And** require explicit confirmation
**And** call DELETE endpoint and navigate back to list on success

---

## Epic 4: Lease Contract Management

**Epic Goal:** Créer et suivre tous mes contrats de location avec dates et montants

### Story 4.1: Lease Data Model and CRUD API

As a property owner,
I want to create and manage lease contracts linking properties to tenants,
So that I can track rental agreements with all their details.

**Acceptance Criteria:**

**Given** Property and Tenant models exist
**When** I add the Lease model to Prisma schema with fields:
- id (UUID), propertyId (String), tenantId (String), monthlyRent (Float), startDate (DateTime), endDate (DateTime optional), paymentDueDate (Int 1-31), createdAt (DateTime)
**Then** the model establishes relations to Property and Tenant
**And** follows naming conventions (camelCase, foreign keys)

**Given** the Lease model is defined
**When** I run migration `npx prisma migrate dev --name add_lease`
**Then** the lease table is created with proper foreign key constraints
**And** Prisma Client is regenerated

**Given** the Lease table exists
**When** I create LeasesModule with controller, service, and DTOs
**Then** the module structure follows NestJS conventions

**Given** the Leases module is set up
**When** I create POST `/api/v1/leases` endpoint accepting:
```typescript
{
  propertyId: string,
  tenantId: string,
  monthlyRent: number,
  startDate: string (ISO 8601),
  endDate?: string (ISO 8601),
  paymentDueDate: number (1-31)
}
```
**Then** it validates propertyId and tenantId belong to authenticated user
**And** validates monthlyRent is positive
**And** validates paymentDueDate is between 1 and 31
**And** validates endDate is after startDate if provided
**And** returns 201 with created lease including property and tenant details

**Given** leases exist
**When** I create GET `/api/v1/leases` endpoint
**Then** it returns leases for properties owned by authenticated user
**And** includes related property and tenant data (eager loading)
**And** supports filtering: `?propertyId={id}`, `?tenantId={id}`, `?status=active`
**And** determines status based on dates: active if startDate <= now < endDate

**Given** a specific lease exists
**When** I create GET `/api/v1/leases/:id` endpoint
**Then** it returns lease with property and tenant details
**And** validates ownership through propertyId
**And** returns 403 if property belongs to another user

**Given** a lease needs updating
**When** I create PATCH `/api/v1/leases/:id` endpoint
**Then** allows updating monthlyRent, endDate, paymentDueDate
**And** prevents changing propertyId or tenantId (business rule)
**And** validates ownership and returns updated lease

**Given** a lease needs termination
**When** I create DELETE `/api/v1/leases/:id` or PATCH with endDate endpoint
**Then** it checks for unpaid rents before deletion
**And** warns if unpaid rents exist
**And** allows deletion if confirmed or no dependencies

---

### Story 4.2: Lease Frontend - Create and List

As a property owner,
I want to create and view lease contracts through the interface,
So that I can easily manage rental agreements.

**Acceptance Criteria:**

**Given** the backend lease API exists
**When** I create `src/services/leasesApi.ts` with CRUD functions
**And** create `src/hooks/useLeases.ts` with React Query hooks
**Then** the API functions use the configured client with auth

**Given** the API and hooks exist
**When** I create LeasesPage component at `src/pages/LeasesPage.tsx`
**Then** it displays leases in a Shadcn/ui Table
**And** shows columns: property address, tenant name, monthly rent, start date, end date, status, actions
**And** formats currency using `formatCurrency()` utility
**And** formats dates using `formatDate()` utility

**Given** the leases table is displayed
**When** the status column is rendered
**Then** active leases show green badge "Active"
**And** ended leases show gray badge "Ended"
**And** future leases show blue badge "Upcoming"

**Given** the user clicks "Create Lease"
**When** a Dialog opens with a form
**Then** the form includes:
- Property select (dropdown of user's properties)
- Tenant select (dropdown of user's tenants)
- Monthly rent (number input with currency symbol)
- Start date (date picker)
- End date (date picker, optional)
- Payment due date (number 1-31)

**Given** property and tenant dropdowns exist
**When** the form loads
**Then** fetch properties and tenants using React Query
**And** populate dropdowns with addresses and full names
**And** show loading state while fetching

**Given** the form is filled with valid data
**When** the user submits
**Then** call useCreateLease mutation
**And** validate dates client-side before submitting
**And** show success toast and refetch leases on success
**And** handle errors with toast notifications

---

### Story 4.3: Lease Details and History View

As a property owner,
I want to view lease details and history for each property,
So that I can track rental agreements over time.

**Acceptance Criteria:**

**Given** PropertyDetailsPage exists (Story 3.5)
**When** I add a "Leases" tab
**Then** it displays all leases for the current property
**And** shows current active lease prominently at the top
**And** shows historical leases below in chronological order

**Given** the Leases tab is displayed
**When** an active lease exists
**Then** display lease card showing:
- Tenant name (linked to tenant details)
- Monthly rent amount
- Lease duration (start - end dates)
- Payment due date (e.g., "15th of each month")
- Status badge
- "Edit Lease" and "End Lease" buttons

**Given** historical leases exist
**When** displaying the history section
**Then** show compact lease cards with:
- Tenant name
- Duration and rent amount
- "Ended" status
- "View Details" link

**Given** the user clicks "Edit Lease"
**When** a Dialog opens pre-filled with lease data
**Then** allow editing monthlyRent, endDate, paymentDueDate
**And** prevent editing propertyId, tenantId, startDate
**And** validate and save changes

**Given** the user clicks "End Lease"
**When** a confirmation dialog appears
**Then** ask for end date (defaults to today)
**And** warn about unpaid rents if any exist
**And** update lease endDate on confirmation
**And** update lease status to "Ended"

**Given** TenantDetailsPage exists (similar to PropertyDetailsPage)
**When** I add a "Leases" tab on TenantDetailsPage
**Then** show all leases (past and present) for this tenant
**And** display properties they've rented
**And** provide same lease management actions

---

## Epic 5: Rent Tracking & Payment Validation

**Epic Goal:** Valider mes loyers en 1-clic et suivre les paiements partiels et impayés

### Story 5.1: Rent Data Model and Payment Tracking API

As a property owner,
I want to track rent payments for each lease,
So that I can monitor which rents are paid, pending, or overdue.

**Acceptance Criteria:**

**Given** the Lease model exists
**When** I add the Rent model to Prisma schema with fields:
- id (UUID), leaseId (String), dueDate (DateTime), amount (Float), paidAmount (Float default 0), paidDate (DateTime optional), status (String default 'pending'), createdAt (DateTime)
**Then** the model establishes relation to Lease
**And** follows naming conventions

**Given** the Rent model is defined
**When** I run migration `npx prisma migrate dev --name add_rent`
**Then** the rent table is created
**And** status enum supports: 'pending', 'paid', 'partial', 'overdue'

**Given** the Rent table exists
**When** I create RentsModule with controller, service, and DTOs
**Then** the module structure follows conventions

**Given** a new lease is created
**When** the lease creation triggers rent generation
**Then** automatically create rent records for the lease duration
**And** generate rents based on paymentDueDate (e.g., 15th of each month)
**And** set dueDate from startDate until endDate
**And** set amount to monthlyRent
**And** set initial status to 'pending'

**Given** rents exist
**When** I create GET `/api/v1/rents` endpoint
**Then** it returns rents for authenticated user's properties
**And** includes related lease, property, and tenant data
**And** supports filtering: `?status=pending`, `?propertyId={id}`, `?leaseId={id}`
**And** supports date range: `?from=2026-01-01&to=2026-12-31`
**And** sorts by dueDate ascending by default

**Given** rent status needs updating
**When** today's date > dueDate and status is 'pending'
**Then** automatically update status to 'overdue'
**And** this check runs via a daily cron job or on-demand during queries

**Given** a specific rent exists
**When** I create GET `/api/v1/rents/:id` endpoint
**Then** return rent with all related data
**And** validate ownership through lease → property → user

---

### Story 5.2: Mark Rent as Paid API

As a property owner,
I want to mark a rent as fully or partially paid,
So that I can track payment status accurately.

**Acceptance Criteria:**

**Given** a pending or partial rent exists
**When** I create POST `/api/v1/rents/:id/mark-paid` endpoint accepting:
```typescript
{
  paidAmount: number,
  paidDate: string (ISO 8601, defaults to today)
}
```
**Then** validate paidAmount is positive and <= remaining balance
**And** validate ownership through lease chain

**Given** valid payment data is submitted
**When** the mark-paid endpoint is called
**Then** add paidAmount to existing rent.paidAmount
**And** set paidDate to provided or current date
**And** update status:
- 'paid' if paidAmount >= amount (fully paid)
- 'partial' if paidAmount < amount (partially paid)
**And** return 200 with updated rent

**Given** the rent is fully paid
**When** paidAmount >= amount
**Then** status becomes 'paid'
**And** paidDate is recorded
**And** the rent appears as paid in all views

**Given** the rent is partially paid
**When** paidAmount < amount
**Then** status becomes 'partial'
**And** remaining balance is calculated: amount - paidAmount
**And** the partial payment is recorded with date

**Given** a rent is overpaid
**When** paidAmount > amount
**Then** return 400 with error "Payment exceeds rent amount"
**And** suggest proper amount to pay

---

### Story 5.3: Rent Payment Dashboard (Home Page)

As a property owner,
I want to see all pending and overdue rents on my dashboard,
So that I can quickly validate payments and track income.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** I create DashboardPage component at `src/pages/DashboardPage.tsx`
**Then** it becomes the default home page route `/`

**Given** the Dashboard loads
**When** I use `useRents({status: ['pending', 'overdue']})` hook
**Then** fetch all pending and overdue rents
**And** show loading skeleton while fetching

**Given** rents are fetched
**When** displaying the dashboard
**Then** show summary cards at the top:
- Total pending rents (count)
- Total pending amount (sum of pending amounts)
- Overdue rents (count with red badge)
- Overdue amount (sum with red color)

**Given** the summary cards are displayed
**When** showing the rents list below
**Then** group rents by status: "Overdue" section first, then "Pending"
**And** each rent shows:
- Property address
- Tenant name
- Due date (formatted, with "overdue by X days" if late)
- Amount (formatted currency)
- Status badge
- "Mark Paid" button (prominent, primary color)

**Given** the user clicks "Mark Paid" button
**When** a quick Dialog opens
**Then** show pre-filled form:
- Amount (defaulted to full amount)
- Date paid (defaulted to today)
- "Full Payment" / "Partial Payment" quick toggle
**And** allow editing amount for partial payments

**Given** the user confirms payment
**When** the form is submitted
**Then** call POST `/api/v1/rents/:id/mark-paid`
**And** show success toast
**And** invalidate rents query to refetch updated data
**And** the rent disappears from pending list if fully paid
**And** moves to payment history

**Given** the payment action completes in < 10 seconds (FR4)
**When** from clicking "Mark Paid" to confirmation
**Then** the entire flow takes < 10 seconds
**And** uses optimistic updates for instant UI feedback

---

### Story 5.4: Rent Payment History

As a property owner,
I want to view payment history for properties and leases,
So that I can track income over time.

**Acceptance Criteria:**

**Given** PropertyDetailsPage exists
**When** I add a "Rent History" tab
**Then** it displays all rents for the property's leases
**And** shows filters: All / Paid / Pending / Overdue

**Given** the Rent History tab is displayed
**When** showing paid rents
**Then** display table with columns:
- Month/Period (based on dueDate)
- Tenant name
- Amount due
- Amount paid
- Paid date
- Status badge

**Given** partial payments exist
**When** displaying rent history
**Then** highlight partial payments with warning badge
**And** show: "Paid €500 of €800 (€300 remaining)"
**And** allow "Mark Remaining Paid" action

**Given** the user filters by status
**When** selecting "Paid" filter
**Then** show only fully paid rents
**And** calculate total paid income displayed at top

**Given** the user views lease details
**When** LeaseDetailsPage displays rent history for specific lease
**Then** show chronological payment timeline
**And** indicate payment patterns (always on time, often late, etc.)

---

### Story 5.5: Overdue Rent Detection and Visual Indicators

As a property owner,
I want to automatically detect overdue rents,
So that I can identify payment issues quickly.

**Acceptance Criteria:**

**Given** rents exist in the database
**When** I create a daily cron job at 9:00 AM
**Then** the job queries all rents where status='pending' AND dueDate < today
**And** updates their status to 'overdue'

**Given** the cron job runs
**When** rents become overdue
**Then** log the status change
**And** prepare data for notification system (Epic 9)

**Given** overdue rents exist
**When** displaying rents in any view (dashboard, property details, lease details)
**Then** overdue rents appear with:
- Red status badge "OVERDUE"
- Days overdue calculated and displayed ("5 days overdue")
- Sorted to top of lists (highest priority)
- Distinct visual styling (red border or background tint)

**Given** the dashboard loads
**When** overdue rents exist
**Then** show prominent alert banner at top:
- "You have X overdue payments totaling €Y"
- "View Details" button to scroll to overdue section
- Red color scheme for urgency

**Given** an overdue rent is paid
**When** the payment is marked
**Then** status changes to 'paid'
**And** the rent moves to payment history
**And** overdue counter decreases

---

## Epic 6: Fiscal Dashboard & Tax Preparation

**Epic Goal:** Préparer ma déclaration fiscale en moins de 1 heure avec tous les totaux pré-calculés

### Story 6.1: Fiscal Data Model and Calculation Service

As a property owner,
I want to automatically calculate my taxable income and deductible expenses,
So that I can prepare my tax declaration easily.

**Acceptance Criteria:**

**Given** Rent and Invoice models exist
**When** I create FiscalModule with service and controller
**Then** the module structure follows NestJS conventions

**Given** the fiscal service exists
**When** I create a method `calculateAnnualFiscalData(userId, year)`
**Then** it queries all paid rents for the year
**And** sums total rental income (revenus locatifs)
**And** queries all invoices for the year
**And** sums expenses by fiscal category
**And** returns structured fiscal data

**Given** the calculation service works
**When** I create GET `/api/v1/fiscal/annual/:year` endpoint
**Then** it returns:
```typescript
{
  year: number,
  totalIncome: number,
  totalExpenses: number,
  netIncome: number,
  expensesByCategory: {
    travaux: number,
    interetsEmprunt: number,
    assurances: number,
    chargesCopropriete: number,
    taxeFonciere: number,
    fraisGestion: number,
    autres: number
  },
  properties: [{
    id: string,
    address: string,
    income: number,
    expenses: number,
    netIncome: number
  }]
}
```
**And** validates the user owns all properties
**And** caches the result for performance (5 minute cache)

**Given** the endpoint exists
**When** called with year parameter
**Then** returns fiscal data in < 2 seconds (NFR2)
**And** handles edge cases (no data, incomplete year, etc.)

---

### Story 6.2: Invoice Data Model for Expense Tracking

As a property owner,
I want to record and categorize my expenses,
So that they are included in my fiscal calculations.

**Acceptance Criteria:**

**Given** the Property model exists
**When** I add the Invoice model to Prisma schema with fields:
- id (UUID), propertyId (String), amount (Float), category (String), description (String), invoiceDate (DateTime), createdAt (DateTime)
**Then** the model establishes relation to Property
**And** follows naming conventions

**Given** the Invoice model is defined
**When** I run migration `npx prisma migrate dev --name add_invoice`
**Then** the invoice table is created

**Given** the Invoice table exists
**When** I create InvoicesModule with controller, service, and DTOs
**Then** the module structure follows conventions

**Given** the Invoices module is set up
**When** I create POST `/api/v1/invoices` endpoint accepting:
```typescript
{
  propertyId: string,
  amount: number,
  category: 'travaux' | 'interetsEmprunt' | 'assurances' | 'chargesCopropriete' | 'taxeFonciere' | 'fraisGestion' | 'autres',
  description: string,
  invoiceDate: string (ISO 8601)
}
```
**Then** it validates propertyId ownership
**And** validates amount is positive
**And** validates category is in allowed list
**And** returns 201 with created invoice

**Given** invoices exist
**When** I create GET `/api/v1/invoices` endpoint
**Then** it returns invoices for user's properties
**And** supports filtering: `?propertyId={id}`, `?category={cat}`, `?year={year}`
**And** includes related property data
**And** sorts by invoiceDate descending

---

### Story 6.3: Fiscal Dashboard Frontend

As a property owner,
I want to view my annual fiscal summary with visual charts,
So that I can quickly understand my tax situation.

**Acceptance Criteria:**

**Given** the fiscal API exists
**When** I create `src/services/fiscalApi.ts` with fiscal functions
**And** create `src/hooks/useFiscal.ts` with React Query hooks
**Then** the hooks fetch fiscal data by year

**Given** the fiscal hooks exist
**When** I create FiscalDashboardPage at `src/pages/FiscalDashboardPage.tsx`
**Then** it displays year selector (default: current year)
**And** fetches fiscal data for selected year

**Given** fiscal data is loaded
**When** displaying the dashboard
**Then** show summary cards at top:
- Total rental income (large, prominent)
- Total deductible expenses
- Net taxable income (income - expenses)
- Effective rate indicator

**Given** summary cards are displayed
**When** showing expenses breakdown
**Then** display pie chart or bar chart showing expenses by category
**And** show percentage of each category
**And** use distinct colors for each category
**And** include legend

**Given** the expenses chart is displayed
**When** showing property-by-property breakdown
**Then** display table with columns:
- Property address
- Annual income
- Annual expenses
- Net income
- Profitability % (net/income * 100)
**And** sort by net income descending
**And** show totals row at bottom

**Given** the dashboard loads with data
**When** rendering is complete
**Then** the entire dashboard loads in < 2 seconds (NFR2)
**And** uses skeleton loading for initial state

---

### Story 6.4: Fiscal Data Export

As a property owner,
I want to export my fiscal data in a structured format,
So that I can easily fill my tax declaration forms.

**Acceptance Criteria:**

**Given** the fiscal API exists
**When** I create GET `/api/v1/fiscal/annual/:year/export` endpoint
**Then** it generates a fiscal export file

**Given** the export endpoint is called
**When** generating the export
**Then** create a JSON file with structured data:
```json
{
  "year": 2026,
  "declarant": {
    "email": "user@example.com"
  },
  "revenusFonciers": {
    "total": 12000,
    "details": [...]
  },
  "chargesDeductibles": {
    "total": 3500,
    "parCategorie": {...}
  },
  "resultatNet": 8500
}
```
**And** return as downloadable JSON file
**And** include generation timestamp

**Given** the export JSON exists
**When** I add CSV export option
**Then** create GET `/api/v1/fiscal/annual/:year/export?format=csv`
**And** generate CSV with rows:
- Property, Income, Expenses (by category), Net Income

**Given** the export endpoints exist
**When** I add "Export" buttons to FiscalDashboardPage
**Then** show dropdown menu: "Export as JSON" / "Export as CSV"
**And** trigger file download on click
**And** show success toast with file name

**Given** the export is triggered
**When** the file downloads
**Then** filename format: `yoyimmo-fiscal-{year}-{date}.{ext}`
**And** the file contains complete, accurate data matching the dashboard

---

## Epic 7: Document Storage & Quick Search

**Epic Goal:** Stocker tous mes documents et retrouver n'importe lequel en moins de 10 secondes

### Story 7.1: Document Data Model and File Upload API

As a property owner,
I want to upload documents and associate them with properties,
So that I can store all my paperwork digitally.

**Acceptance Criteria:**

**Given** the Property model exists
**When** I add the Document model to Prisma schema with fields:
- id (UUID), propertyId (String), type (String), fileName (String), filePath (String), fileSize (Int), mimeType (String), uploadedAt (DateTime)
**Then** the model establishes relation to Property
**And** follows naming conventions

**Given** the Document model is defined
**When** I run migration `npx prisma migrate dev --name add_document`
**Then** the document table is created

**Given** the Document table exists
**When** I create DocumentsModule with controller, service, and DTOs
**Then** the module structure follows conventions

**Given** the Documents module is set up
**When** I configure Multer for file uploads with:
- Storage destination: `/app/data/documents/{propertyId}/`
- Allowed MIME types: PDF, JPEG, PNG
- Max file size: 10MB
**Then** Multer is configured per ARCH-013 specification

**Given** Multer is configured
**When** I create POST `/api/v1/documents/upload` endpoint accepting multipart/form-data:
- file (required)
- propertyId (required)
- type ('lease' | 'invoice' | 'diagnostic' | 'other')
**Then** it validates propertyId ownership
**And** validates file MIME type and size
**And** generates unique filename: `{timestamp}-{uuid}-{originalName}`
**And** saves file to `/app/data/documents/{propertyId}/`
**And** creates document record in database
**And** returns 201 with document metadata

**Given** a file upload fails
**When** the file is too large or wrong type
**Then** return 400 with clear error message
**And** do not save anything to disk or database

---

### Story 7.2: Document List and Download API

As a property owner,
I want to view and download my stored documents,
So that I can access my paperwork anytime.

**Acceptance Criteria:**

**Given** documents exist in the database
**When** I create GET `/api/v1/documents` endpoint
**Then** it returns documents for user's properties
**And** includes related property data
**And** supports filtering: `?propertyId={id}`, `?type={type}`
**And** sorts by uploadedAt descending

**Given** a specific document exists
**When** I create GET `/api/v1/documents/:id` endpoint
**Then** return document metadata
**And** validate ownership through propertyId

**Given** the user wants to download a document
**When** I create GET `/api/v1/documents/:id/download` endpoint
**Then** validate ownership
**And** stream the file from `/app/data/documents/` using fs.createReadStream()
**And** set correct Content-Type header based on mimeType
**And** set Content-Disposition: attachment; filename="{originalFileName}"
**And** handle file not found errors (404)

**Given** the user wants to delete a document
**When** I create DELETE `/api/v1/documents/:id` endpoint
**Then** validate ownership
**And** delete file from filesystem
**And** delete document record from database
**And** return 204 No Content

---

### Story 7.3: Document Search and Filtering Frontend

As a property owner,
I want to search and filter my documents quickly,
So that I can find any document in < 10 seconds (FR15).

**Acceptance Criteria:**

**Given** the documents API exists
**When** I create `src/services/documentsApi.ts` with CRUD functions
**And** create `src/hooks/useDocuments.ts` with React Query hooks
**Then** the API functions use the configured client with auth

**Given** the documents hooks exist
**When** I create DocumentsPage at `src/pages/DocumentsPage.tsx`
**Then** it displays documents in a table or card grid
**And** shows: filename, type badge, property address, upload date, file size, download/delete actions

**Given** DocumentsPage is displayed
**When** I add search input at the top
**Then** search filters documents by filename (client-side for speed)
**And** debounces input (300ms)
**And** highlights matching text

**Given** search and filters exist
**When** I add filter dropdowns for:
- Property (all properties dropdown)
- Type (lease/invoice/diagnostic/other)
**Then** filters work in combination
**And** update URL query params for bookmarkability
**And** search + filters find documents in < 10 seconds (FR15)

**Given** the user clicks download icon
**When** the download action is triggered
**Then** call GET `/api/v1/documents/:id/download`
**And** trigger browser file download
**And** show toast confirmation

**Given** the user clicks delete icon
**When** a confirmation dialog appears
**Then** require confirmation
**And** call DELETE endpoint
**And** remove from list with optimistic update
**And** show success toast

---

### Story 7.4: Document Upload Frontend

As a property owner,
I want to upload documents through a user-friendly interface,
So that I can easily store my paperwork.

**Acceptance Criteria:**

**Given** DocumentsPage exists
**When** I add an "Upload Document" button
**Then** clicking opens a Dialog with upload form

**Given** the upload Dialog is open
**When** displaying the form
**Then** show:
- Property select dropdown
- Document type select (lease/invoice/diagnostic/other)
- File input (drag & drop + click to browse)
- Upload progress bar (hidden initially)

**Given** the user selects a file
**When** the file is chosen
**Then** validate file type (PDF, JPEG, PNG) client-side
**And** validate file size < 10MB client-side
**And** show preview: filename, size, type
**And** display error if validation fails

**Given** the form is filled
**When** the user clicks "Upload"
**Then** create FormData with file, propertyId, type
**And** call POST `/api/v1/documents/upload` with multipart/form-data
**And** show progress bar during upload
**And** disable form during upload

**Given** upload succeeds
**When** the response is received
**Then** show success toast with filename
**And** close dialog
**And** invalidate documents query to show new document
**And** the entire upload flow completes in < 60 seconds (Epic 8 goal)

**Given** upload fails
**When** an error occurs
**Then** show error toast with message
**And** keep dialog open
**And** allow retry

---

### Story 7.5: Documents Tab on Property Details

As a property owner,
I want to see all documents for a specific property,
So that I can access property-specific paperwork easily.

**Acceptance Criteria:**

**Given** PropertyDetailsPage exists (Story 3.5)
**When** I add a "Documents" tab
**Then** it displays all documents for the current property
**And** uses same table/grid layout as DocumentsPage

**Given** the Documents tab is displayed
**When** showing documents
**Then** group by type: Leases, Invoices, Diagnostics, Other
**And** show count for each type
**And** allow expanding/collapsing groups

**Given** the user is viewing property documents
**When** I add "Upload Document" button to this tab
**Then** open upload dialog pre-filled with current propertyId
**And** user only needs to select file and type
**And** upload adds document to current property

**Given** documents are displayed
**When** the user downloads or deletes
**Then** actions work identically to DocumentsPage
**And** the tab updates immediately after changes

---

## Epic 8: Invoice & Expense Tracking

**Epic Goal:** Enregistrer et catégoriser toutes mes charges déductibles par bien

### Story 8.1: Invoice Frontend - Create and List

As a property owner,
I want to create and view invoices through the interface,
So that I can track my expenses easily.

**Acceptance Criteria:**

**Given** the invoices API exists (from Story 6.2)
**When** I create `src/services/invoicesApi.ts` with CRUD functions
**And** create `src/hooks/useInvoices.ts` with React Query hooks
**Then** the API functions use the configured client with auth

**Given** the invoices hooks exist
**When** I create InvoicesPage at `src/pages/InvoicesPage.tsx`
**Then** it displays invoices in a table
**And** shows columns: property address, description, amount, category, date, actions
**And** formats currency and dates
**And** includes "Add Invoice" button

**Given** the invoices table is displayed
**When** showing the category column
**Then** display category badges with distinct colors:
- Travaux (blue)
- Intérêts d'emprunt (purple)
- Assurances (green)
- Charges de copropriété (orange)
- Taxe foncière (red)
- Frais de gestion (gray)
- Autres (neutral)

**Given** the user clicks "Add Invoice"
**When** a Dialog opens with a form
**Then** the form includes:
- Property select dropdown
- Amount (number input with € symbol)
- Category select (with descriptions)
- Description (text area)
- Invoice date (date picker, defaults to today)

**Given** the form is filled with valid data
**When** the user submits
**Then** call useCreateInvoice mutation
**And** show success toast
**And** close dialog and refetch invoices
**And** the new invoice appears in the table
**And** the entire flow completes in < 60 seconds (Epic 8 goal)

---

### Story 8.2: Invoice with Document Upload Integration

As a property owner,
I want to attach document files to invoices,
So that I have proof for all my expenses.

**Acceptance Criteria:**

**Given** the Invoice model exists
**When** I add optional documentId field to Invoice model
**Then** it establishes optional relation to Document model

**Given** the relation is established
**When** I update the create invoice form
**Then** add optional "Attach Document" file upload section
**And** allow uploading a document during invoice creation

**Given** the user uploads a document with invoice
**When** the form is submitted
**Then** first upload the document via POST `/api/v1/documents/upload`
**And** receive documentId from upload response
**And** then create invoice with documentId included
**And** handle errors in either step gracefully

**Given** an invoice has an attached document
**When** displaying the invoice in the table
**Then** show document icon with tooltip: filename
**And** clicking icon downloads the document
**And** the document appears in both Invoices and Documents views

**Given** the user views property details
**When** on the Documents tab
**Then** invoices with attached documents show linkage
**And** clicking invoice document navigates to invoice details

---

### Story 8.3: Invoice Categorization with Helper Descriptions

As a property owner,
I want clear guidance on fiscal categories,
So that I categorize my expenses correctly for tax purposes.

**Acceptance Criteria:**

**Given** the invoice creation form exists
**When** displaying the category select dropdown
**Then** each option includes:
- Category name
- Helper description (what qualifies)

**Given** the category select is rendered
**When** showing options
**Then** display:
- "Travaux" - "Réparations, rénovations, améliorations"
- "Intérêts d'emprunt" - "Intérêts de prêt immobilier"
- "Assurances" - "Assurance habitation, PNO, GLI"
- "Charges de copropriété" - "Charges payées au syndic"
- "Taxe foncière" - "Impôt foncier annuel"
- "Frais de gestion" - "Honoraires agence, comptable"
- "Autres" - "Autres charges déductibles"

**Given** the user hovers over a category
**When** a tooltip or help icon is available
**Then** show additional examples and tax rules
**And** link to external documentation if helpful (optional)

**Given** invoices are categorized
**When** viewing fiscal dashboard (Story 6.3)
**Then** expenses are correctly summed by category
**And** categories match French tax declaration forms (2044)

---

### Story 8.4: Bulk Invoice Import (Optional Enhancement)

As a property owner,
I want to import multiple invoices from a CSV file,
So that I can quickly add historical data.

**Acceptance Criteria:**

**Given** the invoices API exists
**When** I create POST `/api/v1/invoices/import` endpoint accepting CSV file
**Then** validate CSV format: propertyId, amount, category, description, invoiceDate
**And** validate all propertyIds belong to user
**And** validate all categories are valid
**And** parse dates correctly

**Given** a valid CSV is uploaded
**When** processing the import
**Then** create invoice records in bulk
**And** return summary: {created: number, failed: number, errors: []}
**And** rollback on critical errors (transaction)

**Given** the import endpoint exists
**When** I add "Import CSV" button to InvoicesPage
**Then** open file upload dialog
**And** accept .csv files only
**And** show progress during import
**And** display summary results with success/error counts

**Given** import is complete
**When** displaying results
**Then** show table of imported invoices
**And** highlight errors with red badges
**And** allow fixing errors and re-importing

---

## Epic 9: Automated Notifications & Reminders

**Epic Goal:** Être alerté automatiquement J-2 avant les échéances de loyer pour anticiper les impayés

### Story 9.1: Notification Data Model and Service

As a property owner,
I want to receive notifications for important events,
So that I never miss rent due dates or other key actions.

**Acceptance Criteria:**

**Given** the Prisma schema exists
**When** I add the Notification model with fields:
- id (UUID), userId (String), type (String), title (String), message (String), relatedId (String optional), read (Boolean default false), createdAt (DateTime)
**Then** the model establishes relation to User
**And** follows naming conventions

**Given** the Notification model is defined
**When** I run migration `npx prisma migrate dev --name add_notification`
**Then** the notification table is created

**Given** the Notification table exists
**When** I create NotificationsModule with controller, service, and DTOs
**Then** the module structure follows conventions

**Given** the Notifications module is set up
**When** I create the notification service with method `createNotification(userId, type, title, message, relatedId?)`
**Then** it creates a notification record in the database
**And** returns the created notification

**Given** notifications exist
**When** I create GET `/api/v1/notifications` endpoint
**Then** it returns notifications for authenticated user
**And** supports filtering: `?read=false` (unread only)
**And** sorts by createdAt descending

**Given** the user views a notification
**When** I create PATCH `/api/v1/notifications/:id/read` endpoint
**Then** it marks the notification as read
**And** returns 200 with updated notification

**Given** the user wants to clear old notifications
**When** I create DELETE `/api/v1/notifications/:id` endpoint
**Then** validate ownership and delete
**And** return 204 No Content

---

### Story 9.2: Rent Reminder Cron Job (J-2)

As a property owner,
I want automatic reminders 2 days before rent is due,
So that I can anticipate incoming payments.

**Acceptance Criteria:**

**Given** the notification service exists
**When** I configure a cron job using `@nestjs/schedule` to run daily at 9:00 AM
**Then** the cron job executes the rent reminder task

**Given** the cron job runs
**When** checking for upcoming rents
**Then** query all rents where:
- status = 'pending'
- dueDate = today + 2 days
- lease is active
**And** for each rent found, create a notification

**Given** a rent is due in 2 days
**When** creating the notification
**Then** set type = 'RENT_REMINDER'
**And** set title = "Loyer à venir"
**And** set message = "Loyer de {tenant} pour {property} dû le {dueDate} ({amount}€)"
**And** set relatedId = rentId
**And** log the notification creation

**Given** the notification is created
**When** the user logs in
**Then** the notification appears in the notification center
**And** displays with info badge (blue)

---

### Story 9.3: Notification Center Frontend

As a property owner,
I want to view my notifications in a dedicated interface,
So that I can stay informed about important events.

**Acceptance Criteria:**

**Given** the notifications API exists
**When** I create `src/services/notificationsApi.ts` with CRUD functions
**And** create `src/hooks/useNotifications.ts` with React Query hooks
**Then** the API functions use the configured client with auth

**Given** the notifications hooks exist
**When** I add a notification icon to the app header
**Then** display bell icon with unread count badge
**And** badge shows number of unread notifications
**And** badge is red if count > 0

**Given** the user clicks the notification icon
**When** a dropdown opens
**Then** display list of recent notifications (last 10)
**And** show notification type icon, title, and relative time ("2 hours ago")
**And** unread notifications have blue background tint

**Given** notifications are displayed in dropdown
**When** the user clicks a notification
**Then** mark it as read
**And** navigate to related resource if relatedId exists:
- RENT_REMINDER → `/dashboard` (rent list)
- RENT_OVERDUE → `/dashboard`
- LEASE_ENDING → `/leases/:id`
**And** close the dropdown

**Given** the user wants to see all notifications
**When** I add "View All" link in dropdown footer
**Then** navigate to `/notifications` page
**And** display full NotificationsPage with all notifications

**Given** NotificationsPage is rendered
**When** displaying notifications
**Then** show list with:
- Type badge
- Title and message
- Timestamp
- Mark as read/unread toggle
- Delete button
**And** filter tabs: All / Unread / Read

---

### Story 9.4: Additional Notification Types

As a property owner,
I want notifications for various important events,
So that I stay informed about my portfolio.

**Acceptance Criteria:**

**Given** the notification system exists
**When** a rent becomes overdue (Story 5.5 cron job)
**Then** create notification:
- type = 'RENT_OVERDUE'
- title = "Loyer impayé"
- message = "Loyer de {tenant} pour {property} est en retard de {days} jours ({amount}€)"
- relatedId = rentId

**Given** a lease is ending soon
**When** I create a cron job checking leases ending in 30 days
**Then** create notification:
- type = 'LEASE_ENDING'
- title = "Bail arrivant à échéance"
- message = "Le bail de {tenant} pour {property} se termine le {endDate}"
- relatedId = leaseId

**Given** a payment is received (rent marked as paid)
**When** the mark-paid action completes
**Then** create notification:
- type = 'PAYMENT_RECEIVED'
- title = "Paiement reçu"
- message = "Loyer de {tenant} pour {property} a été marqué comme payé ({amount}€)"
- relatedId = rentId

**Given** notifications of different types exist
**When** displaying in notification center
**Then** use distinct icons and colors:
- RENT_REMINDER → info icon, blue
- RENT_OVERDUE → alert icon, red
- LEASE_ENDING → warning icon, orange
- PAYMENT_RECEIVED → checkmark icon, green

---

### Story 9.5: Notification Preferences (Optional)

As a property owner,
I want to configure which notifications I receive,
So that I only get alerts I care about.

**Acceptance Criteria:**

**Given** the user profile exists
**When** I add notification preferences to User model:
```typescript
notificationPreferences: {
  rentReminders: boolean (default true),
  rentOverdue: boolean (default true),
  leaseEnding: boolean (default true),
  paymentReceived: boolean (default false)
}
```
**Then** store as JSON field in database

**Given** preferences are stored
**When** I create GET `/api/v1/users/me/notification-preferences` endpoint
**Then** return user's current preferences

**Given** the user wants to update preferences
**When** I create PATCH `/api/v1/users/me/notification-preferences` endpoint
**Then** allow updating each preference boolean
**And** validate the structure
**And** return updated preferences

**Given** preferences are configured
**When** creating notifications in cron jobs or event handlers
**Then** check user preferences first
**And** only create notification if preference is enabled
**And** log skipped notifications for audit

**Given** the frontend exists
**When** I add a Settings page at `/settings`
**Then** display notification preferences section
**And** show toggle switches for each preference type
**And** save changes on toggle
**And** show success toast on save

---
