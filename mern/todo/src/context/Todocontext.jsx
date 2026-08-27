import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const TodoContext = createContext()

const API_URL = 'http://localhost:5000/api/todos';

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all')
    const [searchBox, setSearchBox] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    
    //debounced search logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchBox);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchBox]);

    //fetch api logic
    useEffect(() => {
        const loadTodos = async () => {
            try {
                const response = await axios.get(API_URL, {
                    params: {
                        search: debouncedSearch,
                        filter
                    }
                })
                setTodos(response.data);
            } catch (error) {
                console.log("Error fetching data!");
            }
        }
        loadTodos();
    }, [debouncedSearch, filter]);

    const addTodo = async (inputText) => {
        if (!inputText.trim()) return;

        try {
            const response = await axios.post(API_URL, { text: inputText });

            // Directly update UI after success
            setTodos(prev => [response.data, ...prev]);

        } catch (error) {
            alert("Failed to add todo");
        }
    };

    const toggleTodo = async (id, currentStatus) => {
        try {
            await axios.put(`${API_URL}/${id}`, { completed: !currentStatus });

            setTodos(prev =>
                prev.map(t =>
                    t._id === id ? { ...t, completed: !currentStatus } : t
                )
            );

        } catch {
            alert("Failed to update");
        }
    };

    const deleteTodo = async (id) => {
        setTodos(todos.filter(t => t._id !== id));
        await axios.delete(`${API_URL}/${id}`);
    };

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