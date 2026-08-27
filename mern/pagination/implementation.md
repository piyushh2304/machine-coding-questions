# Photo Gallery Server-Side Pagination Walkthrough (Using Picsum Photos)

## Overview
This is a beginner-friendly (fresher level) walkthrough to build a photo gallery that fetches high-quality random images from the **Picsum Photos API**. It works directly out-of-the-box, meaning **you don't need any complex Google Cloud setups or API keys!**

We will use **Node.js/Express** for the backend to handle the server-side pagination securely, and **React + Tailwind CSS** for the frontend to display the photos in a beautiful grid.

### Requirements:
- **10 photos per page**.
- **Server-side pagination** (the frontend asks the backend for a specific page, and the backend asks Picsum).
- **Maximum of 15 pages** (enforced by the backend).
- **Tailwind CSS** for styling.

---

## Step 1: Backend Setup (Node.js & Express)

First, create the backend folder and install necessary packages.

### 1. Folder Creation & Initialization
Run these commands in your terminal:
```bash
mkdir backend
cd backend
npm init -y
npm install express cors axios
```

### 2. `server.js`
Create a file named `server.js` in your `backend` folder. This is our main Node server.

```javascript
// backend/server.js

// 1. Import required packages
const express = require('express'); // Web framework for Node.js
const cors = require('cors');       // Allows our React frontend to communicate with this backend
const axios = require('axios');     // Used to make HTTP requests to external APIs (Picsum)

// 2. Initialize our application
const app = express();
app.use(cors()); // Enable CORS to prevent browser blocked request errors

// 3. Route to fetch photos
// When the frontend hits http://localhost:5000/api/photos?page=1, this code runs.
app.get('/api/photos', async (req, res) => {
    try {
        // Parse the requested page number from the URL, automatically defaulting to 1
        const page = parseInt(req.query.page) || 1;
        
        // Enforce our maximum 15 pages requirement
        if (page < 1 || page > 15) {
            return res.status(400).json({ error: "Page must be strictly between 1 and 15" });
        }

        // Call the public Picsum API for photos
        // Example: https://picsum.photos/v2/list?page=1&limit=10
        const response = await axios.get('https://picsum.photos/v2/list', {
            params: {
                page: page, // Which page we want
                limit: 10   // Exactly 10 photos per page
            }
        });

        // The API returns an array of photo objects directly
        const photos = response.data;

        // Send the neatly packaged JSON response back to our React application
        res.json({
            page: page,
            photos: photos,
            totalPages: 15 // Always fixed at 15 for our project requirements
        });

    } catch (error) {
        // If the API call fails, log the error and send a 500 Server Error to the frontend
        console.error("Error fetching photos:", error.message);
        res.status(500).json({ error: "Failed to fetch photos from Picsum API" });
    }
});

// 4. Start the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Backend server is happily running on http://localhost:${PORT}`);
});
```

---

## Step 2: Frontend Setup (React & Tailwind CSS)

Now we will create the React frontend to consume our new backend API.

### 1. Folder Creation & Bootstrap
Open a new terminal window (keep the backend terminal running from Step 1) and run:
```bash
# Create React app with Vite
npm create vite@latest frontend -- --template react
cd frontend

# Install Tailwind CSS v4 and its Vite plugin
npm install tailwindcss @tailwindcss/vite

# Install axios for API calls
npm install axios
```

### 2. Configure Tailwind CSS Styling
Because Tailwind v4 uses Vite plugins directly, you don't need `tailwind.config.js` anymore! 

Open `frontend/vite.config.js` and add the `@tailwindcss/vite` plugin:
```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

Open `frontend/src/index.css` and completely replace its contents with the new import:
```css
/* frontend/src/index.css */
@import "tailwindcss";

/* Adding a nice subtle gray background to our whole document */
body {
  background-color: #f8fafc; 
}
```

### 3. Create Custom Hook (`usePhotos.js`)

To keep our code clean and separate our business logic (fetching data) from our UI (showing images), we will create a custom hook named `usePhotos`.

Create a new folder `frontend/src/hooks` and a file named `usePhotos.js`. Add this code:

```javascript
// frontend/src/hooks/usePhotos.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePhotos(initialPage = 1) {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  
  const totalPages = 15;

  useEffect(() => {
    fetchPhotos(currentPage);
  }, [currentPage]);

  const fetchPhotos = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/photos?page=${page}`);
      setPhotos(response.data.photos);
    } catch (error) {
      console.error("Oops! Failed to fetch photos", error);
      alert("Failed to connect to the backend. Is node server.js running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Return the data and functions so the UI can use them
  return { 
    photos, 
    currentPage, 
    totalPages, 
    isLoading, 
    handleNextPage, 
    handlePrevPage 
  };
}
```

### 4. Component Splitting & React.memo (`PhotoCard.jsx`)

To optimize performance, we are going to extract our individual photo items into their own component and wrap it in `React.memo()`. This ensures that individual photo cards do not re-render uselessly when the parent component updates.

Create a new folder `frontend/src/components` and a file named `PhotoCard.jsx`. Add this code:

```jsx
// frontend/src/components/PhotoCard.jsx
import React from 'react';

// Wrapping the component in React.memo() memoizes the result. 
// It will only re-render if the 'photo' prop actually changes.
const PhotoCard = React.memo(({ photo }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 group">
      <img 
        src={photo.download_url} 
        alt={`Taken by ${photo.author}`} 
        className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="p-4 bg-gray-50 flex flex-col border-t border-gray-100">
        <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Photographer</span>
        <span className="text-sm font-bold text-gray-700 truncate">{photo.author}</span>
      </div>
    </div>
  );
});

export default PhotoCard;
```

### 5. Build the Gallery UI (`App.jsx`)

Now we tie it all together. `App.jsx` uses our `usePhotos` hook for logic, and the `PhotoCard` component for display!
Open `frontend/src/App.jsx` and replace its contents:

```jsx
// frontend/src/App.jsx
import { usePhotos } from './hooks/usePhotos';
import PhotoCard from './components/PhotoCard';

function App() {
  const { 
    photos, 
    currentPage, 
    totalPages, 
    isLoading, 
    handleNextPage, 
    handlePrevPage 
  } = usePhotos(1);

  return (
    <div className="min-h-screen p-8 text-gray-800 font-sans">
      
      {/* 1. Header Section */}
      <header className="mb-8 text-center bg-white py-12 shadow-sm rounded-2xl mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-3 tracking-tight">Awesome Photo Gallery</h1>
        <p className="text-lg text-gray-500 font-medium">Currently viewing Page {currentPage} out of {totalPages}</p>
      </header>

      {/* 2. Loading State vs Display Data */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-2xl font-bold animate-pulse text-indigo-400">Fetching masterpieces...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {photos && photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      {/* 3. Pagination Engine Controls */}
      <div className="flex justify-center items-center mt-12 space-x-6 pb-4">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading} 
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${
            currentPage === 1 || isLoading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'
          }`}
        >
          Previous
        </button>

        <span className="font-extrabold text-xl text-gray-700 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
          {currentPage} <span className="text-gray-300 mx-2">|</span> {totalPages}
        </span>

        <button 
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${
            currentPage === totalPages || isLoading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'
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

---

## How to Run the App Easily (Summary)

Now you just need to start both systems up inside your command line program.
1. Open up **Terminal Window 1** and start the Backend API:
   ```bash
   cd backend
   node server.js
   ```
2. Open up **Terminal Window 2** and start the React app running on Top:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open your favorite web browser and navigate directly to: `http://localhost:5173`. 

Enjoy your effortlessly working server paginated grid full of beautiful photography!
