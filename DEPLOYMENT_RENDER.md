# 🚀 Render Deployment Guide for RentEase

This repository is pre-configured for seamless deployment on **[Render](https://render.com/)**.

---

## ⚡ Method 1: Automatic 1-Click Blueprint (Recommended)

Render can deploy both the **Spring Boot Backend** and **React Frontend** together using the included `render.yaml` blueprint:

1. Sign in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository: `abhishektripathi9/RentEase-PG-Room-Finder`.
4. Render will detect `render.yaml` and display two services:
   - `rentease-backend` (Docker Web Service - Spring Boot)
   - `rentease-frontend` (Static Site - React + Vite)
5. Click **Apply**.
6. Render will automatically build and deploy both services!

---

## 🛠️ Method 2: Manual Setup on Render

If you prefer configuring the services individually:

### Step 1: Deploy Spring Boot Backend (Web Service)
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect `abhishektripathi9/RentEase-PG-Room-Finder`.
3. Configure the following settings:
   - **Name**: `rentease-backend`
   - **Region**: `Oregon (US West)` (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime / Environment**: `Docker`
   - **Dockerfile Path**: `./backend/Dockerfile` (or `Dockerfile` if root context)
   - **Instance Type**: `Free`
4. Under **Health Check Path**, enter: `/api/properties/featured`
5. Click **Create Web Service**.
6. Note down your backend URL (e.g. `https://rentease-backend.onrender.com`).

---

### Step 2: Deploy React Frontend (Static Site)
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect `abhishektripathi9/RentEase-PG-Room-Finder`.
3. Configure:
   - **Name**: `rentease-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Under **Environment Variables**:
   - Add `VITE_API_URL`: `https://rentease-backend.onrender.com/api` *(replace with your actual backend URL from Step 1)*
6. Click **Create Static Site**.

---

## 🔍 Verifying the Deployment
- **API Swagger Documentation**: `https://<your-backend-url>/swagger-ui.html`
- **Featured Properties API**: `https://<your-backend-url>/api/properties/featured`
- **Frontend Portal**: `https://<your-frontend-url>`
