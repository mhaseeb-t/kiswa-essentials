# Kiswa Essentials Backend - Serverless (Vercel)

## Quick Start

### Local Development

```bash
cd backend
npm install
npm start
# Backend runs on http://localhost:5000
```

### Production (Vercel)

```bash
cd backend
vercel --prod
```

## Mode Switching (Local vs Production)

The backend supports two database modes. Edit `backend/.env`:

### Local Mode (default)
```bash
DATABASE_URL=postgresql://postgres:Malik%40786@localhost:6969/kiswa_essentials
```

### Production Mode (Supabase)
```bash
DATABASE_URL=postgresql://postgres.cagqmgxlrlopxrfxhwou:Rm@kaK9N.hDp9,.@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

Switch by commenting/uncommenting the appropriate line in `.env`.

## Environment Variables

### Required for Vercel
Add these in Vercel Dashboard > Settings > Environment Variables:
- `DATABASE_URL` - Supabase PostgreSQL connection
- `JWT_SECRET` - JWT signing secret (use: `kiswa-super-secret-jwt-key-2026-secure`)

### For Local Development
Edit `backend/.env`:
- `PORT=5000`
- `DATABASE_URL` - Your local PostgreSQL
- `JWT_SECRET` - Your secret

## Deploy to Vercel

```bash
cd backend
vercel --prod
```

Or push to GitHub and Vercel auto-deploys.

## Verify Deployment

```
GET https://backend-chi-drab-54.vercel.app/api/health
```

Expected response:
```json
{"success":true,"message":"Kiswa Essentials API is running","database":"connected"}
```

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Get single product |
| GET | `/api/categories` | List categories |

### Auth
| Method | Endpoint | Body/Query |
|--------|----------|------------|
| POST | `/api/auth/register` | `{name, email, password}` |
| GET | `/api/auth/login` | `?email=...&password=...` |

### Protected (Bearer Token)
| Method | Endpoint | Header |
|--------|----------|--------|
| GET | `/api/auth/profile` | `Authorization: Bearer <token>` |
| POST | `/api/orders` | `{items, shippingAddress}` |
| GET | `/api/orders/my` | `Authorization: Bearer <token>` |

## Testing APIs

```bash
# Health check
curl https://backend-chi-drab-54.vercel.app/api/health

# Get products
curl https://backend-chi-drab-54.vercel.app/api/products

# Get categories
curl https://backend-chi-drab-54.vercel.app/api/categories
```

## Database Schema

- **users**: id, name, email, password, role, phone, address, created_at
- **categories**: id, name, description, image, region_prices
- **products**: id, name, description, price, category_id, stock, images, featured
- **orders**: id, order_id, user_id, items, total, status, shipping info
- **order_items**: id, order_id, product_id, quantity, price

## Default Credentials

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@kiswa.com | admin123  |
| Staff | staff@kiswa.com| staff123  |

## Local Dev Serverless

Test serverless functions locally:
```bash
npx vercel dev
```

## Project Structure

```
backend/api/
├── _lib/
│   ├── db.js      # PostgreSQL connection
│   ├── auth.js    # JWT middleware
│   └── seed.js    # Sample data
├── auth/
│   ├── index.js   # Register, Login
│   └── profile.js # Get profile
├── products/
│   ├── index.js   # List products
│   └── [id].js    # Single product
├── categories/
│   └── index.js   # List categories
├── orders/
│   ├── index.js   # Create order
│   └── my.js      # User orders
└── health.js      # Health check
```

## Live URLs

- **Frontend**: https://frontend-lyart-alpha-63.vercel.app
- **Backend**: https://backend-chi-drab-54.vercel.app
- **API**: https://backend-chi-drab-54.vercel.app/api
