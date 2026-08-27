

import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express();
app.use(cors());


app.get('/api/users', async (req, res) => {
    try {
        const search = req.query.search || ' ';
        const page = parseInt(req.query.page) || 1;

        const limit = 12;
        const skipItems = (page - 1) * limit;

        const API_URL = search
            ? `https://dummyjson.com/users/search?q=${search}`
            : 'https://dummyjson.com/users';

        const response = await axios.get(API_URL, {
            params: {
                limit,
                skipItems
            }
        })
        const users = response.data.users;

        res.json({
            page: page,
            users: users,
        })
    } catch (error) {
        console.log("error fetching users", error);
        res.status(500).json({
            error: "failed to fetch users from api"
        });
    }
})
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});
