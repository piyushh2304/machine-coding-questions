import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply requireAuth to ALL todo routes!
router.use(requireAuth);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;