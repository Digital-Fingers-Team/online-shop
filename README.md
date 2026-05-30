# MarketPilot Marketplace MVP

A production-ready Amazon-inspired marketplace MVP built **from the beginning as a pnpm monorepo**. The frontend and backend are intentionally separate applications so they can be deployed independently on Railway.

## Final folder tree

```txt
root/
├── apps/
│   ├── web/                 # Next.js App Router, React, Tailwind CSS
│   └── api/                 # Node.js, Express, MongoDB, Mongoose, JWT REST API
├── packages/
│   ├── types/               # Shared TypeScript DTOs and domain types
│   ├── shared/              # Shared validation schemas and constants
│   └── utils/               # Shared formatting/query helper utilities
├── package.json
├── pnpm-workspace.yaml
├── .gitignore
├── .env.example
└── README.md
```

## Architectural decisions

- **True monorepo boundary:** `apps/web` and `apps/api` are independent workspace apps. Shared domain contracts live in `packages/types`, validation in `packages/shared`, and reusable helpers in `packages/utils`.
- **Frontend:** Next.js App Router with a reusable component layout, Tailwind CSS design primitives, server-rendered product browsing, and client-side authenticated workflows for cart, wishlist, orders, seller tools, and admin tools.
- **Backend:** Express uses clean layers: routes, controllers, services, models, middleware, validation, and error handling. MongoDB access is isolated behind Mongoose models and service functions.
- **Security:** JWT access tokens, refresh-token cookies, password hashing with bcrypt, RBAC middleware, validation via Zod, Helmet security headers, CORS allow-listing, rate limiting, and environment validation.
- **Data model performance:** Mongoose schemas include timestamps, text indexes, seller/category/price/rating indexes, user role indexes, order lookup indexes, and unique cart/wishlist ownership indexes.
- **Railway-ready:** Deploy `apps/web` and `apps/api` as separate Railway services from the same repository with isolated build and start commands.

## Applications

### Frontend: `apps/web`

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- API integration layer in `src/lib/api.ts`
- Auth state provider in `src/providers/AuthProvider.tsx`
- Customer, seller, and admin screens

### Backend: `apps/api`

- Express REST API
- MongoDB/Mongoose schemas for `User`, `Product`, `Order`, `Cart`, and `Wishlist`
- JWT authentication and role authorization
- Service/controller/middleware architecture
- Pagination, filtering, sorting, and full-text search for products

## Getting started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Run one service at a time:

```bash
pnpm dev:web
pnpm dev:api
```

## Environment variables

Copy `.env.example` to `.env` locally and set production values in Railway.

### API service

- `PORT`
- `API_URL`
- `WEB_ORIGIN`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL`
- `BCRYPT_ROUNDS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `COOKIE_DOMAIN`

### Web service

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

## REST API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/products?q=&category=&sort=&page=&limit=`
- `GET /api/products/:id`
- `GET|POST|PATCH|DELETE /api/cart`
- `GET|POST|DELETE /api/wishlist`
- `GET|POST /api/orders`
- `GET|POST|PATCH|DELETE /api/seller/products`
- `GET|PATCH /api/seller/orders`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/suspend`
- `GET|DELETE /api/admin/products`
- `GET /api/admin/orders`

## Railway deployment

Create two Railway services from the same GitHub repository.

### API service

- **Root directory:** `apps/api`
- **Build command:** `pnpm install --frozen-lockfile && pnpm --filter @marketplace/api build`
- **Start command:** `pnpm --filter @marketplace/api start`
- **Required variables:** all API variables listed above.

### Web service

- **Root directory:** `apps/web`
- **Build command:** `pnpm install --frozen-lockfile && pnpm --filter @marketplace/web build`
- **Start command:** `pnpm --filter @marketplace/web start`
- **Required variables:** `NEXT_PUBLIC_API_URL` pointing to the Railway API service `/api` URL and `NEXT_PUBLIC_APP_URL`.

## Production hardening next steps

- Add payment provider integration and webhook reconciliation.
- Replace image URL input with signed uploads to S3 or Cloudinary.
- Add automated test suites with a test MongoDB instance.
- Add audit logs for seller/admin mutations.
- Add background jobs for email, order notifications, and search indexing.
