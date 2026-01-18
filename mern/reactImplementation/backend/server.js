import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
dotenv.config();
import cors from 'cors'
import { connectDB } from './config/db.js'
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
const app = express()

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL || '*'
}));
connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => res.send('API is running...'));
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})