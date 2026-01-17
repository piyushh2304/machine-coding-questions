# Phase 4 Implementation Guide: User Profile & Security

This guide outlines the steps to implement the **User Profile** system, allowing users to view and update their details (Name, Password).

---

## 🛑 PART 1: Backend Implementation

### 1. Create User Controller
**File:** `backend/controllers/userController.js` (New File)

This controller handles fetching and updating user data.

```javascript
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            token: req.body.token, // Keep existing token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
```

### 2. Create User Routes
**File:** `backend/routes/userRoutes.js` (New File)

Connect the controller to API endpoints.

```javascript
import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;
```

### 3. Register Routes in Server
**File:** `backend/server.js`

Update the server to use the new route.

1.  **Import** the route at the top:
    ```javascript
    import userRoutes from './routes/userRoutes.js';
    ```

2.  **Use** the route (add below `authRoutes`):
    ```javascript
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes); // <--- ADD THIS
    app.use('/api/tasks', taskRoutes);
    ```

---

## 🚀 PART 2: Frontend Implementation

### 1. Create User Service
**File:** `frontend/src/services/userService.jsx` (New File)

```javascript
import api from './api';

export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (userData) => api.put('/users/profile', userData);
```

### 2. Create Profile Page
**File:** `frontend/src/pages/ProfilePage.jsx` (New File)

A beautiful form to update user details.

```jsx
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth-context';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../context/toast-context';
import { ChevronLeft, User, Lock, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, login } = useContext(AuthContext); // login updates local state
    const { toast } = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password && password !== confirmPassword) {
            toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await updateUserProfile({ 
                name, 
                email, 
                password: password || undefined 
            });
            
            // Update local context
            login({ ...user, ...res.data }); 
            
            toast({ title: "Success", description: "Profile updated successfully!" });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast({ 
                title: "Error", 
                description: error.response?.data?.message || "Update failed", 
                variant: "destructive" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-card border border-border/50 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-50" />
                
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-xl">
                        <ChevronLeft />
                    </Button>
                    <h1 className="text-2xl font-bold">Profile Settings</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                            <Input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className="pl-10 bg-muted/50 border-input/50 h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</label>
                        <Input 
                            value={email} 
                            disabled 
                            className="bg-muted/20 border-input/20 h-11 cursor-not-allowed opacity-70"
                        />
                    </div>

                    <div className="pt-4 border-t border-border/30 space-y-4">
                        <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <Input 
                                    type="password"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Leave blank to keep current"
                                    className="pl-10 bg-muted/50 border-input/50 h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground ml-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <Input 
                                    type="password"
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    placeholder="Confirm new password"
                                    className="pl-10 bg-muted/50 border-input/50 h-11"
                                />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white mt-6 font-semibold shadow-lg shadow-violet-600/20" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={18} />}
                        Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
```

### 3. Add Route
**File:** `frontend/src/App.jsx`

1.  **Import** the page:
    ```javascript
    import ProfilePage from './pages/ProfilePage';
    ```

2.  **Add Route** inside `<Routes>`:
    ```jsx
    <Route path="/profile" element={
        <ProtectedRoute>
            <ProfilePage />
        </ProtectedRoute>
    } />
    ```

### 4. Link from Dashboard
**File:** `frontend/src/pages/Dashboard.jsx`

Find the user greeting section (around line 283) and modify it to link to the profile.
You can wrap the name/avatar in a `Link` or add a specific button.

**Example:** Replace the "Hi, User" span with:

```jsx
<Link to="/profile" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2 hover:text-violet-500 transition-colors">
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
        {user.name?.charAt(0) || 'U'}
    </div>
    <span className="hidden md:inline">{user.name?.split(' ')[0] || 'User'}</span>
</Link>
```

(Make sure to import `Link` from `react-router-dom` at the top!)
