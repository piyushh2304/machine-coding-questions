# Deploying React Frontend to Vercel (Subdirectory Setup)

Since your project has a `frontend` folder inside the GitHub repository, you need to tell Vercel to specifically look in that folder.

## Step-by-Step Guide

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import Git Repository**: Select your `reactImplementation` (or `nexus-core-mern`) repository.
3.  **Configure Project** (Crucial Step):
    *   **Project Name**: Leave as is or change it.
    *   **Framework Preset**: Vercel should auto-detect **Vite**. If not, select it.
    *   **Root Directory**:
        *   Click **"Edit"** next to **Root Directory**.
        *   Select the `frontend` folder from the list.
        *   Click **"Continue"**.
    *   **Build and Output Settings** (Auto-detected based on Vite, but verify):
        *   **Build Command**: `vite build` (or `npm run build`)
        *   **Output Directory**: `dist`
        *   **Install Command**: `npm install`
4.  **Environment Variables**:
    *   Expand the **"Environment Variables"** section.
    *   Add the following variable to connect to your backend:
        *   **Key**: `VITE_API_BASE_URL`
        *   **Value**: Your deployed backend URL (e.g., `https://your-backend-service.onrender.com/api`) or `http://localhost:5000/api` if testing (though this won't work for public users).
        *   *Note: If you haven't deployed the backend yet, you can add this later in the Vercel Project Settings.*
5.  Click **"Deploy"**.

## Common Issues & Fixes

### "404 Not Found" on Refresh
Single Page Applications (SPAs) like React need a rewrite rule to handle routing.
**If you see 404s when refreshing pages like `/login`:**
1.  Create a file named `vercel.json` inside your `frontend` folder.
2.  Add this content:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
3.  Push the changes.

### CORS Errors
If your frontend cannot talk to the backend:
*   Ensure your **Backend** `server.js` has the correct `CLIENT_URL` (your Vercel domain) allowed in the CORS configuration.
