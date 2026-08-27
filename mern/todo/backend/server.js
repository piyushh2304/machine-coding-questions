import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Database Connected Successfully!'))
    .catch((err) => console.log('❌ Database Error:', err));

// 2. Register API Routes
app.use('/api/todos', todoRoutes);

// 3. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server listening at port ${PORT}`);
});