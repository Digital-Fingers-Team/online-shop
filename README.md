# MarketPilot Marketplace MVP

MarketPilot is a production-oriented marketplace foundation inspired by Amazon but scoped for a startup MVP. It uses the Next.js App Router, React, TypeScript, Tailwind CSS, MongoDB with Mongoose, REST API routes, JWT access/refresh authentication, and role-based authorization.

## Architectural decisions

- **App Router first:** server-rendered marketplace, profile, dashboard, cart, order, and product pages live under `src/app`.
- **Service layer separation:** API route handlers stay thin and delegate business workflows to `src/lib/services`.
- **Central validation and errors:** Zod schemas validate input, while `AppError` and `handler` provide consistent JSON error responses.
- **Secure auth model:** passwords are hashed with bcrypt, access and refresh JWTs are stored in HTTP-only cookies, and protected routes are enforced with middleware plus API-level role checks.
- **MongoDB performance:** Mongoose schemas define required fields, timestamps, and indexes for search, filtering, user lookups, seller products, cart ownership, and order history.
- **Startup-realistic uploads:** seller product creation accepts image URLs in the MVP. The same service/API boundary can be extended to signed S3 or Cloudinary uploads.

## Project structure

```txt
src/app                 App Router pages and REST API route handlers
src/components          Reusable layout, UI, and product components
src/lib/auth.ts         JWT, cookies, password hashing, role guards
src/lib/db.ts           Cached Mongoose connection
src/lib/models          User, Product, Order, Cart, Wishlist schemas
src/lib/services        Product, cart, order, wishlist, admin business logic
src/lib/validation      Zod request validation schemas
src/middleware.ts       Route-level role protection
```

## Getting started

1. Install dependencies with pnpm.

```bash
pnpm install
```

2. Copy the environment template and set production-grade secrets.

```bash
cp .env.example .env.local
```

3. Start MongoDB locally or point `MONGODB_URI` at MongoDB Atlas.

4. Run the development server.

```bash
pnpm dev
```

## Environment variables

See `.env.example` for all supported settings:

- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `ACCESS_TOKEN_TTL`
- `REFRESH_TOKEN_TTL`
- `NEXT_PUBLIC_APP_URL`
- `BCRYPT_ROUNDS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

## Roles and permissions

- **Customer:** browse products, manage cart, wishlist, profile, and orders.
- **Seller:** customer privileges plus seller dashboard, product management, inventory, and seller order status updates.
- **Admin:** marketplace statistics, user/seller suspension, product moderation, and order oversight.

## REST API overview

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### Marketplace

- `GET /api/products?q=&category=&sort=&page=&limit=`
- `GET /api/products/:id`

### Cart and wishlist

- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:productId`
- `DELETE /api/cart/:productId`
- `GET /api/wishlist`
- `POST /api/wishlist`

### Orders

- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/seller/orders/:id`

### Seller

- `GET /api/seller/products`
- `POST /api/seller/products`
- `PATCH /api/seller/products/:id`
- `DELETE /api/seller/products/:id`

### Admin

- `GET /api/admin/stats`
- `PATCH /api/admin/users/:id/suspend`
- `DELETE /api/admin/products/:id`

## Production hardening checklist

- Replace development JWT secrets before deployment.
- Use MongoDB Atlas with backups and IP/network controls.
- Move image uploads to signed S3 or Cloudinary uploads.
- Add payment provider integration and webhook reconciliation.
- Add audit logging for admin and seller actions.
- Add integration tests with a test MongoDB instance.
