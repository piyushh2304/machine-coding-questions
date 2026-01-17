import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import * as taskService from '../services/taskService';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../context/toast-context';
import {
    Plus, Search, Trash2, Edit2,
    LogOut, CheckCircle2, Clock, X,
    AlertCircle, Loader2, Filter,
    ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const performanceData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 3 },
    { name: 'Wed', tasks: 7 },
    { name: 'Thu', tasks: 5 },
    { name: 'Fri', tasks: 9 },
    { name: 'Sat', tasks: 6 },
    { name: 'Sun', tasks: 4 },
];

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
                className="bg-card border border-border w-full max-w-lg rounded-[2rem] p-8 shadow-2xl overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-50" />
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{task ? 'Edit Task' : 'New Task'}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </Button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
                        <Input
                            name="title"
                            defaultValue={task?.title || ''}
                            required
                            placeholder="e.g., Finalize project roadmap"
                            className="bg-muted/50 border-input/50 focus:bg-background transition-all h-12 text-base"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                        <textarea
                            name="description"
                            defaultValue={task?.description || ''}
                            placeholder="Add core details..."
                            rows="3"
                            className="flex min-h-[80px] w-full rounded-md border border-input/50 bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Priority</label>
                            <div className="relative">
                                <select
                                    name="priority"
                                    defaultValue={task?.priority || 'medium'}
                                    className="flex h-12 w-full items-center justify-between rounded-md border border-input/50 bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Status</label>
                            <div className="relative">
                                <select
                                    name="status"
                                    defaultValue={task?.status || 'todo'}
                                    className="flex h-12 w-full items-center justify-between rounded-md border border-input/50 bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-xl border-dashed"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20"
                        >
                            {task ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const { toast } = useToast();

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
            toast({
                title: "Error",
                description: "Failed to sync tasks. Please try again.",
                variant: "destructive"
            });
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
        toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
        });
        navigate('/login');
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const taskData = Object.fromEntries(formData);

        try {
            if (editingTask) {
                await taskService.updateTask(editingTask._id, taskData);
                toast({
                    title: "Task Updated",
                    description: "Your task has been updated successfully.",
                });
            } else {
                await taskService.createTask(taskData);
                toast({
                    title: "Task Created",
                    description: "Your new task has been added.",
                });
            }
            setIsModalOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            toast({
                title: "Error",
                description: "Operation failed! Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task forever?')) { // Could replace this with a custom dialog later
            try {
                await taskService.deleteTask(id);
                toast({
                    title: "Task Deleted",
                    description: "The task has been permanently removed.",
                    variant: "default"
                });
                fetchTasks();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Could not delete task.",
                    variant: "destructive"
                });
            }
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'done' ? 'todo' : 'done';
        try {
            await taskService.updateTask(task._id, { ...task, status: newStatus });
            const action = newStatus === 'done' ? 'completed' : 'reopened';
            toast({
                title: `Task ${action}`,
                description: `Marked "${task.title}" as ${newStatus === 'done' ? 'done' : 'to do'}.`,
            });
            fetchTasks();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update status.",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-background text-foreground font-geist selection:bg-violet-500/30">
            <nav className="border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-600/20">
                            <CheckCircle2 className="text-white" size={18} />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Nexus<span className="text-violet-500">Flow</span></span>
                    </div>

                    <div className="flex-1 max-w-md relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-violet-500" size={16} />
                        <Input
                            type="text"
                            placeholder="Search tasks..."
                            className="bg-muted/50 border-input/20 pl-10 pr-4 h-10 rounded-xl focus:bg-background transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon" onClick={() => { /* Toggle mobile search */ }}>
                                <Search size={20} />
                            </Button>
                        </div>
                        <Link to="/profile" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2 hover:text-violet-500 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <span className="hidden md:inline">{user.name?.split(' ')[0] || 'User'}</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl">
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                        <p className="text-muted-foreground text-sm">Manage your projects and deadlines efficiently.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filter Controls */}
                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-xl border border-border/50">
                            <Filter size={14} className="text-muted-foreground" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer appearance-none pr-4 text-foreground"
                            >
                                <option value="all" className="bg-popover text-popover-foreground">All Status</option>
                                <option value="todo" className="bg-popover text-popover-foreground">To Do</option>
                                <option value="in-progress" className="bg-popover text-popover-foreground">In Progress</option>
                                <option value="done" className="bg-popover text-popover-foreground">Done</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-xl border border-border/50">
                            <Filter size={14} className="text-muted-foreground" />
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer appearance-none pr-4 text-foreground"
                            >
                                <option value="all" className="bg-popover text-popover-foreground">All Priority</option>
                                <option value="high" className="bg-popover text-popover-foreground">High</option>
                                <option value="medium" className="bg-popover text-popover-foreground">Medium</option>
                                <option value="low" className="bg-popover text-popover-foreground">Low</option>
                            </select>
                        </div>


                        <Button
                            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                            className="rounded-xl px-5 h-10 bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-lg shadow-white/5"
                        >
                            <Plus size={18} className="mr-2" /> New Task
                        </Button>
                    </div>
                </div>

                {/* Performance Chart Section */}
                <div className="mb-10 bg-card border border-border/50 rounded-[2rem] p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 opacity-20" />
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Activity className="text-violet-500" size={18} />
                        Weekly Performance
                    </h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#71717a', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    hide={true}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                    }}
                                    itemStyle={{ color: '#e4e4e7' }}
                                    cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="tasks"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTasks)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group relative rounded-[1.5rem] p-6 transition-all duration-300 border ${task.status === 'done'
                                    ? 'bg-muted/10 border-border/40 opacity-75'
                                    : 'bg-card border-border/50 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                        task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        }`}>
                                        {task.status === 'done' ? 'Completed' : task.priority}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                                            <Edit2 size={14} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(task._id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className={`text-lg font-bold mb-2 ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 min-h-[3rem]">{task.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleStatus(task)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${task.status === 'done'
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-100'
                                            : 'bg-muted text-muted-foreground hover:bg-violet-600 hover:text-white scale-90 hover:scale-100'
                                            }`}
                                    >
                                        <CheckCircle2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {tasks.length === 0 && !isRefreshing && (
                        <div className="lg:col-span-3 py-24 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-[2rem] bg-muted/5">
                            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle size={24} className="opacity-50" />
                            </div>
                            <p className="font-semibold text-lg text-foreground">No tasks found</p>
                            <p className="text-sm">Create a new task to get started.</p>
                        </div>
                    )}
                </div>

                {pages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="rounded-xl"
                        >
                            <ChevronLeft size={16} />
                        </Button>

                        <div className="flex gap-2">
                            {Array.from({ length: pages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-foreground text-background' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === pages}
                            onClick={() => setPage(p => Math.min(pages, p + 1))}
                            className="rounded-xl"
                        >
                            <ChevronRight size={16} />
                        </Button>
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
