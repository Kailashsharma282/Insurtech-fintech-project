# Deployment Guide: Vercel & Render

This guide details how to deploy **AgriSure Intelligence** to **Vercel** and **Render** with full PostgreSQL/PostGIS support and automated Prisma client generation.

---

## 1. Deploying to Vercel

Vercel is the recommended platform for Next.js App Router applications, providing edge caching and sub-second asset delivery.

### Method A: Connect Git Repository via Vercel Dashboard (Recommended)
1. Push this project repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel will automatically detect `Next.js` and load [`vercel.json`](./vercel.json).
4. **Build & Output Settings**:
   - **Framework Preset**: Next.js
   - **Build Command**: `prisma generate && next build` (or leave default, which uses `package.json`)
   - **Install Command**: `npm install`
5. **Environment Variables**: Add the following in the Vercel project settings:
   ```env
   NODE_ENV=production
   JWT_SECRET=your-random-32-character-secret-string
   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
   IOT_POLL_INTERVAL_MS=3000
   DEMO_PRIMARY_PLOT=Plot #204
   DEMO_DISTRICT=Nadia
   SIMULATE_SENTINEL_FEEDS=true
   SIMULATE_BANK_GATEWAY=true
   ```
   *(Note: If you don't connect an external PostgreSQL database immediately, the application seamlessly runs on the pre-loaded in-memory store so all 43 pages and endpoints function out of the box).*
6. Click **Deploy**.

### Method B: Deploy using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 2. Deploying to Render

Render supports both native Node.js runtimes and Docker deployments, as well as managed PostgreSQL databases.

### Method A: Deploy via Render Blueprint (One-Click with render.yaml)
1. Push this repository to GitHub or GitLab.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** &rarr; **Blueprint**.
3. Select your repository. Render will detect [`render.yaml`](./render.yaml).
4. Render will automatically configure:
   - Web Service: `agrisure-intelligence` (Node.js runtime, build command `npm install && npm run build`, start command `npm start`)
   - Managed Database: `agrisure-postgres` (PostgreSQL with auto-linked `DATABASE_URL`)
5. Click **Apply**.

### Method B: Deploy as a Docker Web Service on Render
1. Go to **New +** &rarr; **Web Service**.
2. Select your repository and choose **Docker** as the environment.
3. Render will use the included [`Dockerfile`](./Dockerfile).
4. Set the port to `3000` (or `10000`).
5. Configure environment variables matching [`.env.example`](./.env.example).
6. Click **Create Web Service**.

---

## 3. Database Migration & Seeding in Production

If you connect a live PostgreSQL instance with PostGIS enabled:
```bash
# Generate the Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed the database with 25 farmers, 40 farms, 20 IoT devices
npx ts-node prisma/seed.ts
```

---

## 4. Post-Deployment Verification Checklist

Once deployed to your production URL (`https://your-app.vercel.app` or `https://your-app.onrender.com`):
- [ ] Verify homepage loads with 5 KPI cards: `/`
- [ ] Switch to **Farmer Role** and check Plot #204: `/farmer/dashboard`
- [ ] Test the **GA-PSO Optimizer**: `/farmer/optimization`
- [ ] Test the **Disease AI Scanner**: `/farmer/disease`
- [ ] Inspect **Claim #CLM-2026-084**: `/insurer/claims/claim-clm-084`
- [ ] Verify the **IoT Live Ticker (3s)**: `/operations/iot`
- [ ] Verify **Satellite GIS Map**: `/intelligence/map`
