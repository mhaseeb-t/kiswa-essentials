# Kiswa Essentials Backend - Serverless (Vercel)

## Deployment

### 1. Setup Environment Variables

Copy `vercel-env.example` to `.env.local` for local testing, then add to Vercel Dashboard:

1. Go to your Vercel project
2. Settings > Environment Variables
3. Add these variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Your JWT signing secret

### 2. Deploy

```bash
cd backend
vercel
```

Or push to GitHub and connect to Vercel.

### 3. Verify Deployment

Check health endpoint:
```
GET https://your-project.vercel.app/api/health
```

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/products` - List products (query: category_id, search, sort, featured, region)
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - List categories

### Auth (POST)
- `POST /api/auth/register` - Register (body: name, email, password)
- `GET /api/auth/login?email=...&password=...` - Login

### Protected (requires Bearer token)
- `GET /api/auth/profile` - Get user profile (header: Authorization: Bearer <token>)
- `POST /api/orders` - Create order (body: items, shippingAddress, paymentId)
- `GET /api/orders/my` - Get user's orders

## Default Admin

```
Email: admin@kiswa.com
Password: admin123
```

## Local Development

```bash
# Still run Express locally
npm run dev

# Or test serverless locally
npx vercel dev
```