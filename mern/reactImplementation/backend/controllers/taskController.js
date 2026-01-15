import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    const pagesize = Number(req.query.limit) || 5;
    const page = Number(req.query.page) || 1;
    const query = { user: req.user._id }

    //1- SEARCH LOGIC
    if (req.query.search) {
        query.title = {
            $regex: req.query.search,
            $options: 'i'
        }
    }
    //2- filter logic for status
    if (req.query.status && req.query.status !== 'all') {
        query.status = req.query.status
    }
    //3- filter logic for priority
    if (req.query.priority && req.query.priority !== 'all') {
        query.priority = req.query.priority
    }

    const count = await Task.countDocuments(query)
    const tasks = await Task.find(query).limit(pagesize).skip((page - 1) * pagesize).sort({ createdAt: -1 })

    res.json({ tasks, page, pages: Math.ceil(count / pagesize), total: count });
};

export const createTask = async (req, res) => {
    const { title, description, priority, dueDate } = req.body;
    const task = new Task({
        user: req.user._id,
        title,
        description,
        priority,
        dueDate
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
}
export const updateTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task && task.user.toString() === req.user._id.toString()) {
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

export const deleteTask = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task && task.user.toString() === req.user._id.toString()) {
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
};

