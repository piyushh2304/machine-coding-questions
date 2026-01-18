# Phase 5 Implementation Guide: Google OAuth Integration

This guide outlines the steps to implement **Google Authentication** using `@react-oauth/google` (Frontend) and `google-auth-library` (Backend).

---

## 🔑 Step 0: Google Cloud Setup

Before writing code, you need a **Google Client ID**.

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a **New Project** (or select existing).
3. Go to **APIs & Services > OAuth consent screen**.
   - Select **External**.
   - App Name: `NexusCore` (or your app name).
   - User Support Email: Your email.
   - Developer Contact Info: Your email.
   - Click **Save & Continue**.
4. Go to **APIs & Services > Credentials**.
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `NexusCore Web Client`.
   - **Authorized JavaScript origins**: `http://localhost:5173` (Frontend).
   - **Authorized redirect URIs**: `http://localhost:5173` (Frontend).
   - Click **Create**.
5. **Copy the Client ID**. You will need this for your `.env` file.

---

## 🛑 PART 1: Backend Implementation

### 1. Install Dependencies
Run this in your `backend` folder:
```bash
npm install google-auth-library
```

### 2. Update User Model
**File:** `backend/models/User.js`

Add `googleId` and `avatar` fields, and make `password` optional (since Google users won't have one).

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Removed required: true for Google users
    googleId: { type: String }, // New field
    avatar: { type: String },   // New field
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

### 3. Update Auth Controller
**File:** `backend/controllers/authController.js`

Add the `googleLogin` function to handle the token verification.

```javascript
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library'; // Import Google Library

// Initialize Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ... existing registerUser and loginUser ...

// @desc    Login with Google
// @route   POST /api/auth/google
export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists but has no googleId, link it
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar = picture;
                await user.save();
            }
        } else {
            // Create new user
            // Generate a random password for internal consistency
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                name,
                email,
                password: hashedPassword,
                googleId,
                avatar: picture
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ message: 'Google authentication failed' });
    }
};
```

### 4. Update Auth Routes
**File:** `backend/routes/authRoutes.js`

Add the new route.

```javascript
import express from 'express';
import { registerUser, loginUser, googleLogin } from '../controllers/authController.js'; // Import googleLogin

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin); // Add this line

export default router;
```

### 5. Update Backend `.env`
Add your Client ID:
```env
GOOGLE_CLIENT_ID=your_pasted_client_id_from_step_0
```

---

## 🚀 PART 2: Frontend Implementation

### 1. Install Dependencies
Run this in your `frontend` folder:
```bash
npm install @react-oauth/google jwt-decode
```

### 2. Configure Environment
**File:** `frontend/.env` (Create if not exists)

```env
VITE_GOOGLE_CLIENT_ID=your_pasted_client_id_from_step_0
```

### 3. Setup Google OAuth Provider
**File:** `frontend/src/main.jsx`

Wrap your app with `GoogleOAuthProvider`.

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
```

### 4. Update Login Page
**File:** `frontend/src/pages/LoginPage.jsx`

Add the Google Login button and handler.

```javascript
// ... existing imports
import { GoogleLogin } from '@react-oauth/google'; // Import Google Button

const LoginPage = () => {
    // ... existing state ...
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // ... existing handleLogin ...

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse; 
            // Send the token to backend
            const { data } = await api.post('/auth/google', { token: credential });
            login(data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Google Logic Failed', error);
            alert('Google Login Failed');
        }
    };

    const handleGoogleError = () => {
        console.log('Login Failed');
        alert('Google Login Failed');
    };

    return (
        // ... container ...
            // ... existing form ...
                
                {/* Add divider and Google Button below the Login button */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300"></span>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="filled_blue"
                        shape="pill"
                    />
                </div>

            // ... Link to register ...
        // ...
    );
};
```

---

## ✅ Verification
1. Restart backend (`npm run dev`).
2. Restart frontend (`npm run dev`).
3. Open Login page.
4. Click "Sign in with Google".
5. Check if you are redirected to the Dashboard and if your data is correct.
