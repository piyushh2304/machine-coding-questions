import React from 'react';
import { TodoProvider } from './context/Todocontext';

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