# Deploying Backend to Render (Subdirectory Setup)

Because your project is located deep inside your repository at `mern/reactImplementation/`, you must configure the **Root Directory** correctly on Render so it knows where to find your code.

## Configuration Steps

1.  **Create a New Web Service** on Render.
2.  **Connect your Repository** (`machine-coding-questions`).
3.  **Settings**:

    | Setting | Value |
    | :--- | :--- |
    | **Root Directory** | `mern/reactImplementation` |
    | **Environment** | `Node` |
    | **Build Command** | `npm run build` |
    | **Start Command** | `npm start` |

    > **Important**: Do NOT set the Root Directory to `mern/reactImplementation/backend` if you want to use the Monolith setup (easier).
    >
    > If you SPECIFICALLY want to deploy **ONLY the backend** (because you are using Vercel for frontend), use these settings instead:
    > *   **Root Directory**: `mern/reactImplementation/backend`
    > *   **Build Command**: `npm install`
    > *   **Start Command**: `npm start`

4.  **Environment Variables**:
    Don't forget to add your variables under the **Environment** tab:
    *   `NODE_ENV`: `production`
    *   `MONGODB_URI`: ...
    *   `JWT_SECRET`: ...
    *   (etc.)

## Why this works
*   **Root Directory**: Tells Render to "cd" into `mern/reactImplementation` before doing anything.
*   **Build Command**: Runs `npm run build` in that folder. Your `package.json` there has a script that installs dependencies for BOTH backend and frontend.
*   **Start Command**: Runs `npm start`, which runs `node backend/server.js`, starting your server.
