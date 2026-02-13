# Deployment Guide

This project is configured for deployment on Vercel (Frontend) and Render (Backend).

## 1. Backend Deployment (Render)

1.  Push your code to GitHub.
2.  Go to [Render.com](https://render.com) and create a **New Web Service**.
3.  Connect your GitHub repository.
4.  Select the `backend` folder as the **Root Directory**.
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  Click **Create Web Service**.
8.  **Important**: Copy the URL of your new service (e.g., `https://docmify-backend.onrender.com`).

## 2. Frontend Deployment (Vercel)

1.  Go to [Vercel.com](https://vercel.com) and Add New > Project.
2.  Import your GitHub repository.
3.  Select the `frontend` folder as the **Root Directory**.
4.  In **Environment Variables**, add:
    *   **Name**: `VITE_API_URL`
    *   **Value**: `https://docmify-backend.onrender.com/api/pdf` (Replace with your actual Render URL).
5.  Click **Deploy**.

## 3. Post-Deployment Check

After both are deployed:
1.  Open your Vercel URL.
2.  Try compressing a PDF.
3.  If it fails, check the Browser Console (F12) -> Network tab to see if the request is going to the correct Render URL.
4.  If you get CORS errors, you might need to update `backend/server.js` `cors()` config to explicitly allow your Vercel domain (currently it accepts all origins which is fine for getting started).
