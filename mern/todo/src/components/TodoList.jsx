import React, { useContext } from 'react';
import { TodoContext } from '../context/Todocontext';
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
                                {task.completed ? <CheckCircle2 className="text-green-500 w-6 h-6" /> : <Circle className="text-gray-300 w-6 h-6" />}
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