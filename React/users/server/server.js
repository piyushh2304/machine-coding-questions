import express from "express";
import cors from "cors"
import { getUsers } from "./controller/userController.js";
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/api/users', getUsers);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

