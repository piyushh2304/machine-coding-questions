import mongoose from 'mongoose'

export const TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Todo = mongoose.model('Todo', TodoSchema);
export default Todo;