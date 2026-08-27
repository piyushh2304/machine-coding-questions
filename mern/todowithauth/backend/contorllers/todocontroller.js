import Todo from '../models/Todo.js';

export const getTodo = async (req, res) => {
    try {
        const search = req.query.search || '';
        const query = { user: req.user.id };
        if (search) query.text = { $regex: search, $options: 'i' };
        const todos = await Todo.find(query).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
}
export const createTodo = async (req, res) => {
    try {
        const newTodo = new Todo({
            text: req.body.text,
            user: req.user.id
        })
        await newTodo.save();
        res.json(newTodo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create' });
    }
};

export const updatetodo = async (req, res) => {
    try {
        const updated = await todo.findByIdAndUpdate({
            _id: req.params.id,
            user: req.user.id

        }, {
            completed: req.body.completed
        }, { new: true })
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update' });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        // Make sure they can only delete THEIR OWN todo
        await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({ message: 'Deleted!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete' });
    }
};