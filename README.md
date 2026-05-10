# Kiswa Essentials - E-Commerce Store

Complete e-commerce frontend and backend for a premium UK-based South Asian clothing and perfume brand.

## Tech Stack

- **Frontend**: React 19 + Vite + Redux Toolkit + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Deployment**: Vercel (Frontend)

## Deploy to Vercel

1. **Push to GitHub** first:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kiswa-essentials.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Vercel Setup**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repo
   - Framework: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL` = Your backend URL

## Backend Deployment (Railway/Render)

For the backend, deploy to Railway or Render:
- Runtime: Node.js
- Start Command: `npm start`
- Environment Variables:
  - `DATABASE_URL` = PostgreSQL connection string
  - `PORT` = 5000
  - `JWT_SECRET` = Your secret key

## Local Development

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kiswa.com | admin123 |
| Staff | staff@kiswa.com | staff123 |
