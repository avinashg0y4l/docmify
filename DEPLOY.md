
# Deployment Guide for Docmify

## 1. Frontend (Vercel)

1.  Push your code to GitHub.
2.  Log in to [Vercel](https://vercel.com).
3.  Click "Add New..." -> "Project".
4.  Import your repository.
5.  Select the `frontend` directory as the Root Directory.
6.  Vercel should automatically detect Vite/React.
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
7.  Click "Deploy".

## 2. Backend (Render)

1.  Log in to [Render](https://render.com).
2.  Click "New +" -> "Web Service".
3.  Connect your GitHub repository.
4.  Select the `backend` directory as the Root Directory.
5.  Settings:
    *   Runtime: Node
    *   Build Command: `npm install`
    *   Start Command: `node server.js`
6.  Add Environment Variables:
    *   `PORT`: `10000` (or leave default, Render sets `PORT` automatically)
    *   `CORS_ORIGIN`: Your Vercel frontend URL (e.g., `https://docmify.vercel.app`)
7.  Click "Create Web Service".

## 3. Connecting Frontend to Backend

1.  Once Backend is deployed, copy its URL (e.g., `https://docmify-backend.onrender.com`).
2.  In Vercel (Frontend Project Settings -> Environment Variables):
    *   Add `VITE_API_URL` = `https://docmify-backend.onrender.com`
3.  Update `frontend/src/services/api.js` to use `import.meta.env.VITE_API_URL || 'http://localhost:5000/api/pdf'`.

## 4. Security

*   Ensure HTTPS is enabled (default on Vercel/Render).
*   Add security headers in `server.js` using `helmet` logic if needed (already basic in Express).
*   Files are auto-deleted every hour.

