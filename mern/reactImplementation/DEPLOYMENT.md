# Deployment Guide

Your MERN application is configured for deployment. You can deploy it as a **monolith** (backend serves frontend) or **separated** (frontend on Vercel/Netlify, backend on Render/Heroku).

## Option 1: Monolith Deployment (Recommended for Simplicity)

This method deploys both frontend and backend to a single service (e.g., **Render**, **Heroku**, **Railway**).

### Prerequisites
1. Push your code to a formatted GitHub repository.
2. Ensure you have your MongoDB Connection String ready.

### Deploy on Render.com
1. Create a new **Web Service**.
2. Connect your GitHub repository.
3. Configure the following:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: Your secret key.
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.

Render will automatically run the build script (which installs backend/frontend deps and builds the React app) and then start the server.

---

## Option 2: Separated Deployment (Better Performance)

### Backend (Render/Railway)
1. **Root Directory**: `backend` (Important: Change this in settings!)
2. **Build Command**: `npm install`
3. **Start Command**: `npm start` (or `node server.js`)
4. **Env Vars**: Same as above.

### Frontend (Vercel/Netlify)
1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Env Vars**:
   - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://my-backend.onrender.com/api`)
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.

---

## Local Development
To run the full stack locally:
```bash
# Install dependencies in root, backend, and frontend
npm run build 

# Start both servers concurrently
npm run dev
```
