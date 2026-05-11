# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kiswa Essentials - E-Commerce store for UK-based South Asian clothing and perfume brand. Monorepo with separate frontend and backend.

## Deployed URLs
- **Frontend:** https://frontend-lyart-alpha-63.vercel.app
- **Backend API:** https://backend-chi-drab-54.vercel.app/api

## Commands

### Backend (Local - Port 5000)
```bash
cd backend
npm start        # Start server (creates tables on first run)
npm run seed     # Reseed database with sample data
```

### Frontend (Local - Port 5173)
```bash
cd frontend
npm install      # Install dependencies
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```

### Vercel Deployment
```bash
cd backend
vercel --prod    # Deploy backend to Vercel
vercel --prod    # Deploy frontend to Vercel
```

## Architecture

### Backend (`backend/`)
- **Express.js** with raw PostgreSQL via `pg` driver
- Local server uses `server.js` with auto table creation
- Serverless API uses `api/` folder for Vercel Functions

### Serverless API (`backend/api/`) - Vercel
Simplified API structure for Vercel serverless:
- `api/products/index.js` - Products endpoint (GET)
- `api/categories/index.js` - Categories endpoint
- `api/orders/index.js` - Create order (POST)
- `api/orders/my.js` - User's orders (GET)
- `api/auth/index.js` - Register/Login
- `api/auth/profile.js` - User profile
- Each file creates its own DB pool (required for Vercel serverless)

### Frontend (`frontend/src/`)
- **React 19** + Vite with ES modules
- **Tailwind CSS v4** - Uses canonical class names:
  - `bg-linear-to-*` not `bg-gradient-to-*`
  - `max-w-350` not `max-w-[1400px]`
  - `max-w-150` not `max-w-[600px]`
  - `max-w-200` not `max-w-[800px]`
  - `w-150` not `w-[600px]`
  - `w-200` not `w-[800px]`
  - `h-150` not `h-[600px]`
  - `h-200` not `h-[800px]`
  - `min-w-8` not `min-w-[2rem]`
  - `shrink-0` not `flex-shrink-0`
  - `aspect-3/4` not `aspect-[3/4]`
  - `aspect-4/5` not `aspect-[4/5]`
- **Redux Toolkit** for state management (slices in `store/slices/`)
- **React Router v7** for routing
- Pages: `customer/`, `auth/`, `admin/`
- Components: `cart/`, `product/`, `order/`, `layout/`, `ui/`

### Database
- PostgreSQL via Supabase
- Connection string in Vercel env vars as `DATABASE_URL`
- SSL required: `{ ssl: { rejectUnauthorized: false } }`

## CORS Setup
All API endpoints include CORS headers:
```js
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

## Vercel Environment Variables
Set in Vercel dashboard under Project > Settings > Environment Variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens

## Key Patterns

### Backend Response Format
```js
res.json({ success: true, products: [...] })
// or
res.status(400).json({ success: false, message: 'error' })
```

### Frontend API Integration
```js
const API_URL = import.meta.env.VITE_API_URL || 'https://backend-chi-drab-54.vercel.app/api';
fetch(`${API_URL}/products?featured=true`)
```

## Default Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kiswa.com | admin123 |
| Staff | staff@kiswa.com | staff123 |

## Known Issues & Fixes

### Region Detection
- External geo-IP APIs (ipapi.co, ipwho.is) are blocked by CORS on free tiers
- Solution: Default to UK region, users can change manually
- Code: `frontend/src/hooks/useRegionDetection.js`

### Vercel CORS
- All backend API files must include CORS headers manually
- Use `res.setHeader()` for each response

### Cache Issues
- Run `vercel cache purge` to clear stale deployments
