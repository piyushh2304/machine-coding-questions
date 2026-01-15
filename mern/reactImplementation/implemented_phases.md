# Smart Task Manager - Phase 1: Core Foundation & Auth

This file contains all the necessary code and instructions for **Phase 1**. You can copy-paste these into your project files as you build it.

---

## 🛠️ Step 0: Project Setup & Dependencies

First, create your project folders and initialize them.

### 1. Initialize Folders
```bash
mkdir reactImplementation
cd reactImplementation
mkdir backend
mkdir frontend
```

### 2. Backend Dependencies
Run these commands in the `backend/` folder:
```bash
cd backend
npm init -y
npm install express mongoose jsonwebtoken bcryptjs dotenv cors
npm install --save-dev nodemon
```

### 3. Frontend Dependencies
Run these commands in the `frontend/` folder (assuming you used Vite):
```bash
cd ../frontend
# If you haven't created the Vite app yet:
# npx vite@latest . --template react
npm install axios framer-motion lucide-react react-router-dom clsx tailwind-merge
# Shadcn UI initialization (follow prompts)
npx shadcn-ui@latest init
```

---

## 🌐 Backend Implementation

### 1. `.env` (Environment Variables)
File: `backend/.env`
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 2. `server.js` (Entry Point)
File: `backend/server.js`
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### 3. `config/db.js` (Database Connection)
File: `backend/config/db.js`
```javascript
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
```

### 4. `models/User.js` (User Schema)
File: `backend/models/User.js`
```javascript
import mongoose from 'mongoose';

// Simple User schema without pre-save hooks or methods
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

### 5. `controllers/authController.js` (Auth Logic)
File: `backend/controllers/authController.js`
```javascript
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Import bcrypt for manual hashing

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Manual Password Hashing in Controller
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Manual Password Comparison in Controller
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};
```

### 6. `routes/authRoutes.js` (Auth Endpoints)
File: `backend/routes/authRoutes.js`
```javascript
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
```

---

## 🎨 Frontend Implementation

### 1. `src/services/api.js` (Axios Interceptors)
File: `frontend/src/services/api.js`
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor to add JWT token to every request header
api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
});

export default api;
```

### 2. `src/context/AuthContext.jsx` (Global Auth State)
File: `frontend/src/context/AuthContext.jsx`
```javascript
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check localStorage for saved user info on app load
        const storedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUser) setUser(storedUser);
    }, []);

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
```

---
---

## 🎨 Frontend Implementation (Continued)

### 3. `src/components/ProtectedRoute.jsx` (Route Guard)
File: `frontend/src/components/ProtectedRoute.jsx`
```javascript
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // If no user is logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Otherwise, render the requested component
    return children;
};

export default ProtectedRoute;
```

### 4. `src/pages/LoginPage.jsx` (Login UI)
File: `frontend/src/pages/LoginPage.jsx`
```javascript
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            navigate('/dashboard'); // Redirect to dashboard on success
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-screen bg-gray-100"
        >
            <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
                <input 
                    type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded" required
                />
                <input 
                    type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded" required
                />
                <button type="submit" className="w-full p-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Login
                </button>
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
                </p>
            </form>
        </motion.div>
    );
};

export default LoginPage;
```

### 5. `src/App.jsx` (Routing Setup)
File: `frontend/src/App.jsx`
```javascript
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

// Lazy load the Dashboard for performance (Phase 2)
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<div>Register Page (Similar to Login)</div>} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;
```

---

Phase 1 is now complete! Once you've implemented these files, your application will have a working authentication system with global state, protected routes, and basic UI animations.
