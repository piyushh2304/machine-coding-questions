import React, { useState, useContext } from 'react';
import { TodoContext } from '../context/Todocontext';

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