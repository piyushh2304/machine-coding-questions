# Fresher-Friendly MERN Todo App (With Global State via Context API)

You asked to manage global state at the App level. We will use React's **Context API**, which securely holds all of our state and logic in one centralized place so our components can just worry about the UI.

## 1. Project Setup
```bash
# 1. Create your main project folder
mkdir fresher-mern-todo
cd fresher-mern-todo

# 2. Setup Backend folder
mkdir backend
cd backend
npm init -y
npm install express mongoose cors dotenv
cd ..

# 3. Setup Frontend folder (Vite + React)
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react axios
cd ..
```

---

## 2. Backend Code (Separated Architecture & ES Modules)

To keep our backend clean and scalable, we will separate it into **Models**, **Controllers**, **Routes**, and the main **Server** file. We are also using modern ES module syntax (`import`).

### `backend/package.json`
Make sure to add `"type": "module"` so Node.js understands the `import` keywords.
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

### `backend/.env`
```env
MONGO_URI=mongodb://localhost:27017/fresher_todos
PORT=5000
```

### Phase A: `backend/models/Todo.js`
The model defines how your data should look inside MongoDB.
```javascript
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Todo', todoSchema);
```t

### Phase B: `backend/controllers/todoController.js`
Controllers hold all the "Business Logic" (fetching, creating, updating, deleting data).
```javascript
import Todo from '../models/Todo.js';

// GET: Fetch all todos with search
export const getTodos = async (req, res) => {
  try {
    const search = req.query.search || '';
    const filter = req.query.filter || 'all';

    const query = {};
    if (search) query.text = { $regex: search, $options: 'i' }; 
    if (filter === 'active') query.completed = false;
    if (filter === 'completed') query.completed = true;

    const todos = await Todo.find(query).sort({ createdAt: -1 });

    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST: Create a new todo
export const createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({ text: req.body.text });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create' });
  }
};

// PUT: Update a todo true/false status
export const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id, 
      { completed: req.body.completed }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update' });
  }
};

// DELETE: Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};
```

### Phase C: `backend/routes/todoRoutes.js`
Routes connect the API URLs to the Controller functions.
```javascript
import express from 'express';
// Important: Add .js at the end of imports when using ES Modules in Node
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
```

### Phase D: `backend/server.js`
This is your main entry point that wires everything together. It is now incredibly short and clean!
```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Database Connected Successfully!'))
  .catch((err) => console.log('❌ Database Error:', err));

// 2. Register API Routes
app.use('/api/todos', todoRoutes);

// 3. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server listening at port ${PORT}`);
});
```

---

## 3. Frontend Code (React Global State with Context API)

Go to your `frontend` folder and update Tailwind settings.

### `frontend/tailwind.config.js`
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### `frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### Phase A: Create the Global Context
Create `frontend/src/TodoContext.jsx`. This acts as the "App Level Global Brain" holding all state and functions.

```jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create Context
export const TodoContext = createContext();

const API_URL = 'http://localhost:5000/api/todos';

// 2. Create Provider (This wraps your whole App)
export const TodoProvider = ({ children }) => {
  // --- States ---
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchBox, setSearchBox] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // --- Twist: Debounced Search Logic ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchBox);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchBox]);

  // --- Fetch API Logic ---
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: { search: debouncedSearch, filter }
        });
        
        setTodos(response.data);
      } catch (error) {
        console.log("Error fetching data!");
      }
    };
    loadTodos();
  }, [debouncedSearch, filter]);

  // --- Twist: Optimistic UI Logic ---
  const addTodo = async (inputText) => {
    if (inputText === '') return;

    const fakeId = "temp-" + Date.now();
    const fakeTodo = { _id: fakeId, text: inputText, completed: false };
    const previousTodosSnapshot = [...todos];

    setTodos([fakeTodo, ...todos]); // Instant update

    try {
      const response = await axios.post(API_URL, { text: fakeTodo.text });
      setTodos(currentList => 
        currentList.map(task => task._id === fakeId ? response.data : task)
      );
    } catch (error) {
      alert("Failed to save! Rolling back changes.");
      setTodos(previousTodosSnapshot);
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    setTodos(todos.map(t => t._id === id ? { ...t, completed: !currentStatus } : t));
    await axios.put(`${API_URL}/${id}`, { completed: !currentStatus });
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter(t => t._id !== id));
    await axios.delete(`${API_URL}/${id}`);
  };

  // 3. Pass EVERYTHING down through the Context Provider
  return (
    <TodoContext.Provider value={{
      todos, filter, searchBox,
      setFilter, setSearchBox,
      addTodo, toggleTodo, deleteTodo
    }}>
      {children}
    </TodoContext.Provider>
  );
};
```

---

### Phase B: Make the UI Components Consume the Global Brain

Now that the logic lives inside context, the UI files remain incredibly clean. Break them down inside your `src` folder.

### `frontend/src/components/AddTodoForm.jsx`
```jsx
// components/AddTodoForm.jsx
import React, { useState, useContext } from 'react';
import { TodoContext } from '../TodoContext';

export default function AddTodoForm() {
  const { addTodo } = useContext(TodoContext);
  const [inputText, setInputText] = useState(''); // Local state for input field only

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(inputText);
    setInputText(''); 
  };

  return (
    <div className="bg-blue-600 p-6 text-white text-center">
      <h1 className="text-3xl font-bold mb-6">MERN Todo</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded text-black outline-none"
          placeholder="What do you need to do?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="bg-blue-800 px-4 py-2 rounded font-bold hover:bg-blue-900 shadow-md">
          Add Task
        </button>
      </form>
    </div>
  );
}
```

### `frontend/src/components/SearchAndFilter.jsx`
```jsx
// components/SearchAndFilter.jsx
import React, { useContext } from 'react';
import { TodoContext } from '../TodoContext';
import { Search } from 'lucide-react';

export default function SearchAndFilter() {
  const { searchBox, setSearchBox, filter, setFilter } = useContext(TodoContext);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4 border-b">
      
      {/* Search Input */}
      <div className="relative border border-gray-300 rounded-md flex w-full">
        <Search className="absolute ml-2 mt-2 w-5 h-5 text-gray-400" />
        <input 
          className="w-full py-2 pl-9 pr-2 rounded-md bg-transparent outline-none text-black"
          placeholder="Search..."
          value={searchBox}
          onChange={(e) => setSearchBox(e.target.value)}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 p-1 bg-gray-200 rounded-lg">
         {['all', 'active', 'completed'].map(f => (
           <button 
             key={f}
             onClick={() => handleFilterChange(f)} 
             className={`px-3 py-1 rounded-md capitalize font-medium ${filter === f ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
           >
             {f}
           </button>
         ))}
      </div>
    </div>
  );
}
```

### `frontend/src/components/TodoList.jsx`
```jsx
// components/TodoList.jsx
import React, { useContext } from 'react';
import { TodoContext } from '../TodoContext';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

export default function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useContext(TodoContext);

  return (
    <div className="p-4">
      {todos.length === 0 ? (
        <p className="text-gray-500 text-center py-10 font-medium">No tasks found.</p>
      ) : (
        todos.map(task => (
          <div key={task._id} className="flex items-center p-4 border rounded-lg mb-2 bg-white shadow-sm hover:border-blue-300 transition-colors">
            
            <div 
              className="flex gap-4 items-center cursor-pointer flex-1" 
              onClick={() => toggleTodo(task._id, task.completed)}
            >
              <button className="focus:outline-none">
                 {task.completed ? <CheckCircle2 className="text-green-500 w-6 h-6"/> : <Circle className="text-gray-300 w-6 h-6"/>}
              </button>
              
              <span className={`text-lg transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                {task.text}
              </span>
            </div>

            <button onClick={() => deleteTodo(task._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
```

---

### Phase C: Wire it all together in App.jsx

Finally, we inject the context provider at the root so every component has access to the global brain!

### `frontend/src/App.jsx`
```jsx
import React from 'react';
import { TodoProvider } from './TodoContext';

// Import our clean UI components
import AddTodoForm from './components/AddTodoForm';
import SearchAndFilter from './components/SearchAndFilter';
import TodoList from './components/TodoList';

export default function App() {
  return (
    // We wrap everything inside our Global State Provider
    <TodoProvider>
      <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden shadow-gray-200 border border-gray-100">
          
          <AddTodoForm />
          
          <SearchAndFilter />
          
          <TodoList />

        </div>
      </div>
    </TodoProvider>
  );
}
```
