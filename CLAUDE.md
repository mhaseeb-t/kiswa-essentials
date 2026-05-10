# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kiswa Essentials - E-Commerce store for UK-based South Asian clothing and perfume brand. Monorepo with separate frontend and backend.

## Commands

### Backend (Port 5000)
```bash
cd backend
npm start        # Start server (creates tables on first run)
npm run seed     # Reseed database with sample data
```

### Frontend (Port 5173)
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

### Backend (`backend/`)
- **Express.js** with raw PostgreSQL via `pg` driver (NOT MongoDB)
- Tables auto-create via `createTable()` methods on models at startup
- `server.js` handles DB initialization, table creation, and seeding
- Controllers return `{ success, data/error }` response format
- Middleware: `auth` (JWT), `admin` (admin role), `staff` (staff+admin roles), `errorHandler`

### Serverless (`backend/api/`) - Vercel
Alternative serverless API structure for Vercel deployment:
- `api/_lib/db.js` - PostgreSQL connection and table initialization
- `api/_lib/auth.js` - JWT authentication middleware
- `api/_lib/seed.js` - Database seeding
- Route handlers: `api/products/`, `api/categories/`, `api/orders/`, `api/auth/`
- `vercel.json` - Route configuration

## Deployment (Serverless)
```bash
cd backend
vercel --prod    # Deploy to Vercel
vercel dev       # Local development with serverless
```
Set `DATABASE_URL` and `JWT_SECRET` in Vercel dashboard.

### Frontend (`frontend/src/`)
- **React 19** + Vite with ES modules
- **Redux Toolkit** for state management (slices in `store/slices/`)
- **React Router v7** for routing
- API layer in `api/` uses Axios with interceptors for auth tokens
- Pages organized by role: `customer/`, `auth/`, `admin/`
- Components grouped by domain: `cart/`, `product/`, `order/`, `layout/`, `ui/`

### Database
- PostgreSQL (configured via `DATABASE_URL` in `backend/.env`)
- Models use raw SQL via `pg.pool`, not an ORM
- Tables: users, categories, products, orders, order_items

## Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kiswa.com | admin123 |
| Staff | staff@kiswa.com | staff123 |

## Key Patterns

### Backend Response Format
```js
res.json({ success: true, data: [...] })
// or
res.status(400).json({ success: false, error: 'message' })
```

### Frontend API Integration
Axios instance in `api/index.js` auto-attaches JWT token from Redux store.

## Environment Variables
- `backend/.env`: `DATABASE_URL`, `PORT=5000`, `JWT_SECRET`
- `frontend/.env`: `VITE_API_URL=http://localhost:5000`