import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Server is running'));

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listen for 'chat message' event from client

    socket.on('sendMessage', async (message) => {
        try {
            console.log("User said:", message);
            // 1. Emit the user's message back to them (so they know it was received/processed)
            // OR simpler: The frontend can add the user's message to UI immediately.
            // Let's stick to: Frontend adds User msg, Backend sends Bot msg.
            // 2. Call Gemini API
            const result = await model.generateContent(message);
            const response = await result.response;
            const text = response.text();
            // 3. Emit the Bot's response
            socket.emit('message', { text: text, sender: 'bot' });
        } catch (error) {
            console.error("Gemini Error:", error.message, error);
            socket.emit('message', { text: `Error: ${error.message || "Something went wrong"}`, sender: 'bot' });
        }
    })
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Note: Changed model to 'gemini-1.5-flash' as '2.5' might not be available/valid yet.
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.io Server running on port ${PORT}`);
});
