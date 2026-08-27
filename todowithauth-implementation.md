# MERN Todo App with User Authentication (Beginner Friendly)

This guide walks you through building a Full-Stack Todo application with **JWT Authentication**, **Bcrypt Hashing**, and beautiful UI powered by **Tailwind + Shadcn UI**. We will keep the frontend logic very simple and straight-forward (no confusing optimistic UI).

---

## 1. Project Initialization & Folder Structure

```bash
# We assume you are inside your 'todowithauth' folder
# If not, create and enter it:
# mkdir todowithauth && cd todowithauth

# --- 1. SET UP THE BACKEND ---
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv bcrypt jsonwebtoken
npm install -D nodemon
cd ..

# --- 2. SET UP THE FRONTEND ---
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# --- 3. SET UP SHADCN UI ---
# Initialize shadcn (Say 'yes' to defaults, use 'slate' or 'zinc' color, css variables: yes)
npx shadcn-ui@latest init
# Install the components you'll need:
npx shadcn-ui@latest add card button input
cd ..
```

---

## 2. Backend Code (Node.js + Express + JWT)

Navigate to the `backend` folder.

### `backend/.env`
```env
MONGO_URI=mongodb://localhost:27017/auth_todos
PORT=5000
JWT_SECRET=my_super_secret_jwt_key_123
```

### `backend/package.json`
Make sure to add `"type": "module"`!
```json
{
  ...
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

### A. Models (`backend/models/`)

**`backend/models/User.js`**
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

**`backend/models/Todo.js`**
```javascript
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  // Links the Todo to the specific User who created it
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
```

### B. Middleware (`backend/middleware/authMiddleware.js`)
This protects routes so only logged-in users can access them.
```javascript
import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  // Get token from the headers: "Bearer <token>"
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // we attach the user info (id) to the request!
    next(); // Move on to the controller
  } catch (error) {
    res.status(400).json({ error: 'Token is not valid' });
  }
};
```

### C. Controllers (`backend/controllers/`)

**`backend/controllers/authController.js`**
```javascript
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    // Hash the password securely with a salt of 10 rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT Token containing the user's ID
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
```

**`backend/controllers/todoController.js`**
```javascript
import Todo from '../models/Todo.js';

export const getTodos = async (req, res) => {
  try {
    const search = req.query.search || '';
    
    // Only find todos that belong to the logged in user!
    const query = { user: req.user.id };
    if (search) query.text = { $regex: search, $options: 'i' }; 

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

export const createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({ 
        text: req.body.text,
        user: req.user.id // Attach the user ID from the JWT token middleware
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create' });
  }
};

export const updateTodo = async (req, res) => {
  try {
    // Make sure they can only update THEIR OWN todo
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id }, 
      { completed: req.body.completed }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    // Make sure they can only delete THEIR OWN todo
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
```

### D. Routes (`backend/routes/`)

**`backend/routes/authRoutes.js`**
```javascript
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);

export default router;
```

**`backend/routes/todoRoutes.js`**
```javascript
import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply requireAuth to ALL todo routes!
router.use(requireAuth);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
```

### E. `backend/server.js`
```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB Connected'))
  .catch((err) => console.log('❌ DB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`✅ Server on port ${process.env.PORT || 5000}`);
});
```

---

## 3. Frontend Code (React + Shadcn UI + Auth Context)

Go to your `frontend` folder. Make sure Tailwind and Shadcn are setup.

### A. Auth Context (`frontend/src/context/AuthContext.jsx`)
```jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Handle token side-effects
  useEffect(() => {
    if (!token) {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      return;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }, [token]);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    navigate('/');
  };

  const register = async (email, password) => {
    await axios.post('/api/auth/register', { email, password });
    navigate('/login');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### B. Pages & Dashboard (`frontend/src/App.jsx`)
Replace `App.jsx` with routes for Login/Register and the main Dashboard.

```jsx
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// A simple component to protect the Dashboard route
const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);
    if (!token) return <Navigate to="/login" />;
    return children;
};

export default function App() {
  return (
    <BrowserRouter>
      {/* We wrap everything inside the AuthProvider so Router works inside it */}
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### C. Login Page (`frontend/src/pages/Login.jsx`)
```jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            alert('Login Failed: Check credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-blue-600">Welcome Back</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <Input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
                        <Input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Login</Button>
                        <p className="text-sm text-gray-500">
                            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
```

### D. Register Page (`frontend/src/pages/Register.jsx`)
Similar to the Login page. Copy the login page structure, but call the `register` function inside `handleSubmit` instead, and change the UI text to "Register"!

### E. Dashboard (`frontend/src/pages/Dashboard.jsx`)
This is the simple, honest React approach utilizing Shadcn UI Cards to show Todos.

```jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Search, LogOut, CheckCircle2, Circle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/todos';

export default function Dashboard() {
    const { logout } = useContext(AuthContext);
    const [todos, setTodos] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [search, setSearch] = useState('');

    // Fetch on load, and re-fetch when search changes
    const fetchTodos = async () => {
        try {
            const res = await axios.get(API_URL, { params: { search } });
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [search]); // Very easy search! Every time you type, it fetches.

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!taskInput.trim()) return;
        try {
            // Await the backend. Don't do optimistic UI. Honest logic.
            const res = await axios.post(API_URL, { text: taskInput });
            setTodos([res.data, ...todos]); // Prepend new task
            setTaskInput('');
        } catch (err) {
            alert('Failed to add');
        }
    };

    const handleToggle = async (id, currentStatus) => {
        try {
            const res = await axios.put(`${API_URL}/${id}`, { completed: !currentStatus });
            setTodos(todos.map(t => t._id === id ? res.data : t));
        } catch (err) {
            alert('Failed to update');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setTodos(todos.filter(t => t._id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 py-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-blue-600 text-white p-6 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold">My Tasks</h1>
                <Button onClick={logout} variant="destructive" className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                </Button>
            </div>

            {/* Input & Search Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input 
                        placeholder="Search tasks..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="pl-9"
                    />
                </div>
                
                {/* Add Form */}
                <form onSubmit={handleAdd} className="flex gap-2">
                    <Input 
                        placeholder="Add a new task..." 
                        value={taskInput} 
                        onChange={(e) => setTaskInput(e.target.value)} 
                        className="flex-1"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add</Button>
                </form>
            </div>

            {/* Nice Shadcn UI Cards for the list */}
            <div className="space-y-4">
                {todos.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">You're all caught up!</p>
                ) : (
                    todos.map(todo => (
                        <Card key={todo._id} className={`transition-all ${todo.completed ? 'opacity-60 bg-slate-50' : 'hover:shadow-md'}`}>
                            <CardContent className="p-4 flex justify-between items-center">
                                
                                <div 
                                    className="flex items-center gap-4 flex-1 cursor-pointer"
                                    onClick={() => handleToggle(todo._id, todo.completed)}
                                >
                                    {todo.completed ? (
                                        <CheckCircle2 className="text-green-500 w-6 h-6" />
                                    ) : (
                                        <Circle className="text-gray-300 w-6 h-6" />
                                    )}
                                    <span className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-400' : 'text-slate-800'}`}>
                                        {todo.text}
                                    </span>
                                </div>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => handleDelete(todo._id)} 
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </Button>

                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
```
