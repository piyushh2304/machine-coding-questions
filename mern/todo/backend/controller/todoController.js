import Todo from '../models/Schema.js'


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
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
}

export const createTodo = async (req, res) => {
    try {
        const newTodo = new Todo({
            text: req.body.text
        })
        await newTodo.save();
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create' });
    }
}


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
export const deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete' });
    }
};