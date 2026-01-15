import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import * as taskService from '../services/taskService';
import { useDebounce } from '../hooks/useDebounce';
import {
    Plus, Search, Trash2, Edit2,
    LogOut, CheckCircle2, Clock, X,
    AlertCircle, Loader2, Filter,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#121214] border border-white/5 w-full max-w-lg rounded-[3rem] p-10 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black tracking-tight">{task ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Title</label>
                        <input
                            name="title"
                            defaultValue={task?.title || ''}
                            required
                            placeholder="e.g., Finalize project roadmap"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-semibold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Description</label>
                        <textarea
                            name="description"
                            defaultValue={task?.description || ''}
                            placeholder="Add core details..."
                            rows="3"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-medium resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Priority</label>
                            <select
                                name="priority"
                                defaultValue={task?.priority || 'medium'}
                                className="w-full bg-[#1c1c1f] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Status</label>
                            <select
                                name="status"
                                defaultValue={task?.status || 'todo'}
                                className="w-full bg-[#1c1c1f] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-all text-zinc-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-bold shadow-xl shadow-violet-600/20 hover:bg-violet-500 transition-all active:scale-95"
                        >
                            {task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    // States
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(searchTerm, 500);

    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Fetch Tasks
    const fetchTasks = async () => {
        if (!user) return;
        setIsRefreshing(true);
        try {
            const response = await taskService.getTasks(page, debouncedSearch, statusFilter, priorityFilter);
            setTasks(response.data.tasks || []);
            setPages(response.data.pages || 1);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Effect for fetching logic
    useEffect(() => {
        if (!loading) fetchTasks();
    }, [page, debouncedSearch, statusFilter, priorityFilter, loading, user]);

    // Reset page on search or filter change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, statusFilter, priorityFilter]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const taskData = Object.fromEntries(formData);

        try {
            if (editingTask) {
                await taskService.updateTask(editingTask._id, taskData);
            } else {
                await taskService.createTask(taskData);
            }
            setIsModalOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            alert('Operation failed! Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task forever?')) {
            try {
                await taskService.deleteTask(id);
                fetchTasks();
            } catch (error) {
                alert('Delete failed');
            }
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await taskService.updateTask(task._id, { ...task, status: newStatus });
            fetchTasks();
        } catch (error) {
            console.log('Status update failed');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="animate-spin text-violet-500" size={40} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0b0b0d] text-zinc-100 font-inter">
            <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-600/20">
                            <CheckCircle2 className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">Nexus<span className="text-violet-500">Flow</span></span>
                    </div>

                    <div className="flex-1 max-w-xl relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-violet-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 w-full focus:outline-none focus:border-violet-500/50 transition-all text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="p-2.5 rounded-2xl hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                            <Filter size={16} className="text-zinc-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-2"
                            >
                                <option value="all" className="bg-[#121214]">All Status</option>
                                <option value="todo" className="bg-[#121214]">To Do</option>
                                <option value="in-progress" className="bg-[#121214]">In Progress</option>
                                <option value="done" className="bg-[#121214]">Done</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                            <Filter size={16} className="text-zinc-500" />
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer appearance-none pr-2"
                            >
                                <option value="all" className="bg-[#121214]">All Priority</option>
                                <option value="high" className="bg-[#121214]">High</option>
                                <option value="medium" className="bg-[#121214]">Medium</option>
                                <option value="low" className="bg-[#121214]">Low</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                        className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-violet-600/20 transition-all active:scale-95 flex items-center gap-3"
                    >
                        <Plus size={20} /> New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`group border rounded-[2.5rem] p-8 transition-all duration-300 ${task.status === 'done'
                                        ? 'bg-zinc-900/20 border-white/5 opacity-60'
                                        : 'bg-[#161618] border-white/5 hover:border-violet-500/30 shadow-lg hover:shadow-violet-600/5'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                                            task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                                        }`}>
                                        {task.status === 'done' ? 'Completed' : task.priority}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-2.5 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(task._id)} className="p-2.5 hover:bg-rose-500/10 rounded-xl text-zinc-500 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold mb-3 ${task.status === 'done' ? 'line-through text-zinc-600' : ''}`}>{task.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">{task.description}</p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2 text-zinc-600">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(task)}
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${task.status === 'done'
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                : 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700 hover:text-zinc-400'
                                            }`}
                                    >
                                        <CheckCircle2 size={22} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {tasks.length === 0 && !isRefreshing && (
                        <div className="lg:col-span-3 py-24 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-white/5 rounded-[3.5rem]">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <AlertCircle size={32} className="opacity-20" />
                            </div>
                            <p className="font-bold text-xl text-zinc-400">Your workspace is empty</p>
                            <p className="text-sm mt-1">Start by adding your first project milestone 🚀</p>
                        </div>
                    )}
                </div>

                {pages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 disabled:opacity-30 transition-all group"
                        >
                            <ChevronLeft size={20} className="text-zinc-500 group-hover:text-white" />
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: pages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-11 h-11 rounded-xl font-bold transition-all ${page === i + 1 ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page === pages}
                            onClick={() => setPage(p => Math.min(pages, p + 1))}
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 disabled:opacity-30 transition-all group"
                        >
                            <ChevronRight size={20} className="text-zinc-500 group-hover:text-white" />
                        </button>
                    </div>
                )}
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <TaskModal
                        isOpen={isModalOpen}
                        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                        onSubmit={handleCreateOrUpdate}
                        task={editingTask}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
