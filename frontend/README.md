# Kiswa Essentials - Frontend

Luxurious e-commerce frontend for UK-based South Asian clothing and perfume brand.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Features

- React 19 + Vite
- Redux Toolkit for state management
- React Router v7 for navigation
- Tailwind CSS for styling
- Axios for API calls

## Environment Variables

Create `frontend/.env`:

```bash
# Local backend
VITE_API_URL=http://localhost:5000/api

# Production backend (Vercel)
VITE_API_URL=https://backend-chi-drab-54.vercel.app/api
```

## Testing Locally

### 1. Backend Setup (Local PostgreSQL)

Make sure PostgreSQL is running locally:
```bash
# Start your local PostgreSQL server
# Connection: postgresql://postgres:Malik%40786@localhost:6969/kiswa_essentials
```

### 2. Start Backend

```bash
cd backend
npm start
# Backend runs on http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Test Flow

1. Open http://localhost:5173
2. Browse products on homepage
3. Register or login
4. Add to cart, checkout

## Tech Stack

- **Framework**: React 19 + Vite
- **State**: Redux Toolkit
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **API**: Axios with interceptors
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Project Structure

```
frontend/src/
├── api/           # Axios API calls
├── components/    # Reusable components
│   ├── cart/      # Cart components
│   ├── layout/    # Navbar, Footer
│   ├── product/   # Product cards, details
│   └── ui/        # Buttons, inputs, etc.
├── pages/         # Route pages
│   ├── auth/      # Login, Register
│   ├── customer/  # Shop, Cart, Checkout
│   └── admin/     # Admin dashboard
├── store/         # Redux store
│   └── slices/    # Auth, Cart, etc.
└── hooks/         # Custom hooks
```

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Default Credentials

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@kiswa.com | admin123  |
| Staff | staff@kiswa.com| staff123  |

## Deployment

Frontend deploys to: https://frontend-lyart-alpha-63.vercel.app

See root README.md for full project documentation.
