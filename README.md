# Online Shop MVP

A simplified Amazon-inspired e-commerce platform built as a TypeScript monorepo with a separated Express API and Next.js App Router frontend.

## Monorepo layout

```text
app/
├── api/   # Express, Prisma, MongoDB, JWT, Zod
└── web/   # Next.js App Router, React, TailwindCSS
```

The backend is intentionally not implemented with Next.js API routes. Railway can deploy each service from its own root directory:

- Frontend service root: `app/web`
- Backend service root: `app/api`

## Prerequisites

- Node.js 20+
- pnpm 9+
- MongoDB replica-set compatible connection string (MongoDB Atlas is recommended for Prisma with MongoDB)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

The API runs on `http://localhost:4000` and the web app runs on `http://localhost:3000`.

## Useful commands

```bash
pnpm dev              # Run API and web together
pnpm build            # Build every workspace
pnpm typecheck        # Type-check every workspace
pnpm lint             # Lint every workspace
pnpm prisma:push      # Apply Prisma schema to MongoDB
```

## API overview

All API routes are versioned under `/api/v1` and return a consistent JSON envelope:

```json
{ "success": true, "data": {}, "message": "Optional message" }
```

Implemented domains:

- Auth: register, login, profile
- Products: listing, details, search, filters, inventory-aware CRUD
- Categories: CRUD
- Cart: persisted user cart with item quantity updates
- Orders: checkout, history, order details, status tracking
- Admin: product, category, inventory, order, and user management through role-protected routes

## Railway deployment notes

Create two Railway services from this repository:

1. API service
   - Root directory: `app/api`
   - Build command: `pnpm install --frozen-lockfile && pnpm prisma:generate && pnpm build`
   - Start command: `pnpm start`
   - Required env: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, optional rate-limit variables
2. Web service
   - Root directory: `app/web`
   - Build command: `pnpm install --frozen-lockfile && pnpm build`
   - Start command: `pnpm start`
   - Required env: `NEXT_PUBLIC_API_URL`

## Security baseline

The API uses Helmet, CORS allow-listing, rate limiting, bcrypt password hashing, JWT auth, role authorization, Zod validation, centralized errors, and Prisma parameterized database access.
