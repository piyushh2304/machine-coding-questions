# Beautiful API Directory & Pagination Implementation Guide

This guide contains the step-by-step instructions, file structures, and code needed to build the perfect Full-Stack Pagination application using Express, React, TailwindCSS, and the DummyJSON API.

**NEW:** Now featuring Debounced Search!

---

## 1. Project Creation & Setup

Open your terminal and create the backend and frontend environments:

```bash
# 1. Create main api folder
mkdir api
cd api

# 2. Setup the Backend
mkdir backend
cd backend
npm init -y
npm install express cors axios nodemon
cd ..

# 3. Setup the Frontend (React + Vite + Tailwind)
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 4. Install Tailwind Vite Plugin & Axios
npm install @tailwindcss/vite tailwindcss axios
cd ..
```

---

## 2. Backend Implementation (Express Proxy)

Navigate to the `backend` folder.

### `backend/package.json`
Update your package to support newer `import` modules and add the `dev` starting script.
```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon server.js",
    "start": "nodemon server.js"
  },
  "dependencies": {
    "axios": "^1.13.6",
    "cors": "^2.8.6",
    "express": "^5.2.1",
    "nodemon": "^3.1.14"
  }
}
```

### `backend/server.js`
This server securely proxies the third-party API request so you don't expose business logic on your frontend. It manages the mathematical skips/limits and dynamically switches to the `search` endpoint!

```javascript
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

// The User API Endpoint (Supports Pagination & Search)
app.get('/api/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || ''; // Grab search term from frontend
        
        const limit = 12; // 12 items per page for a beautiful 3x4 grid
        const skipItems = (page - 1) * limit;

        // If there's a search term, hit dummyjson's search endpoint!
        const API_URL = search 
            ? `https://dummyjson.com/users/search?q=${search}`
            : 'https://dummyjson.com/users';

        // Fetch securely from DummyJSON
        const response = await axios.get(API_URL, {
            params: {
                limit: limit,
                skip: skipItems
            }
        });
        
        // Target response.data.users to extract JUST the array of users, nothing else
        const users = response.data.users; 
        
        res.json({
            page: page,
            users: users,
        });

    } catch (error) {
        console.log("error fetching users", error);
        res.status(500).json({
            error: "failed to fetch users from api"
        });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});
```

---

## 3. Frontend Implementation (React + Tailwind)

Navigate to the `frontend` folder.

### `frontend/vite.config.js`
Make sure the Tailwind Vite plugin is injected correctly.
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### `frontend/src/index.css`
Inject your Tailwind fundamentals.
```css
@import "tailwindcss";
```

### A. The Custom Hook: `frontend/src/hooks/useUsers.js`
This accepts the search string, fetching beautifully.

```javascript
import { useEffect, useState } from "react";
import axios from 'axios';

// Accept the debounced search term directly in the hook!
export function useUsers(initialPage = 1, searchQuery = '') {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    
    // Auto-fetch users whenever the page OR searchQuery changes
    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [currentPage, searchQuery]);
    
    // When the user enters a NEW search, reset to Page 1
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // The core fetching mechanic connecting to our localhost proxy server
    const fetchUsers = async (page, search) => {
        setLoading(true);

        try {
            // Send both page and search as parameters!
            const response = await axios.get('http://localhost:5000/api/users', {
                params: { page, search } 
            });
            setUsers(response.data.users);
        } catch (error) {
            console.log("failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    // Easy helper methods attached to the Next/Prev buttons
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => prev - 1);

    return {
        users,
        currentPage,
        loading,
        handleNextPage,
        handlePrevPage
    };
}
```

### B. The Card UI Component: `frontend/src/components/userCard.jsx`
Takes in a single `user` object and renders an interactive, shadow-dropped sleek UI card.

```javascript
import React from 'react';

const UserCard = React.memo(({ user }) => {
    if (!user) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-6 w-full max-w-sm group">
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img 
                    className="relative w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-gray-50" 
                    src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`} 
                    alt={`${user.firstName} ${user.lastName}`} 
                />
            </div>

            <h2 className="text-xl font-bold text-gray-800 tracking-tight text-center">
                {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-blue-600 font-semibold mb-5 text-center bg-blue-50 px-3 py-1 rounded-full mt-2">
                {user.company?.title || user.role || 'Member'}
            </p>
            
            <div className="w-full bg-slate-50 p-4 rounded-xl space-y-3 mt-auto border border-slate-100">
                <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    <span className="truncate flex-1">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span>{user.phone}</span>
                </div>
            </div>
        </div>
    );
});

export default UserCard;
```

### C. The Central Page: `frontend/src/App.jsx`
Now with **Debounced Search!** This means typing will wait 500ms before hammering the backend API.

```jsx
import React, { useState, useEffect } from 'react';
import { useUsers } from './hooks/useUsers';
import UserCard from './components/userCard';

function App() {
  // 1. Easy Debounced Search Logic
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    // Wait until 500ms of non-typing has passed before committing the search!
    const timer = setTimeout(() => {
        setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer); // Cleanup cancels the timer if user keeps typing
  }, [searchInput]);

  // Pass our committed search term into our powerful Hook
  const { 
    users, 
    currentPage, 
    loading, 
    handleNextPage, 
    handlePrevPage 
  } = useUsers(1, debouncedSearch);

  // If we search, we don't necessarily have 10 pages anymore, but 10 is max default.
  // In a real prod app, the backend returns "total" and we calculate it properly!
  const totalPages = 10; 

  return (
    <div className="min-h-screen p-8 text-slate-800 font-sans bg-slate-50">
      
      {/* 1. Header Hero Display */}
      <header className="mb-8 text-center bg-white py-12 px-4 shadow-sm rounded-2xl mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 tracking-tight">Active Users Directory</h1>
        
        {/* Beautiful Search Input */}
        <div className="max-w-md mx-auto relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
             type="search"
             placeholder="Search directory..."
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-full focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-700"
          />
        </div>

      </header>

      {/* 2. Content Grid Map */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-2xl font-bold animate-pulse text-blue-400">Fetching team members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto place-items-center">
          {users && users.length > 0 ? (
            users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
             <div className="col-span-full h-64 flex flex-col justify-center items-center">
               <span className="text-xl text-slate-400 font-semibold mb-2">No users found matching "{debouncedSearch}"</span>
             </div>
          )}
        </div>
      )}

      {/* 3. Global Pagination Controls */}
      <div className="flex justify-center items-center mt-12 space-x-6 pb-4">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading} 
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${
            currentPage === 1 || loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
          }`}
        >
          Previous
        </button>

        <span className="font-extrabold text-xl text-slate-700 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
           Page {currentPage}
        </span>

        <button 
          onClick={handleNextPage}
          disabled={users && users.length < 12 || loading}
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${
            (users && users.length < 12) || loading 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
          }`}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default App;
```
