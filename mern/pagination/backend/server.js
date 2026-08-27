const express = require('express')
const cors = require('cors')
const axios = require('axios')


const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/photos', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;

        if (page < 1 || page > 15) {
            return res.status(400).json({ error: "Page must be strictly between 1 and 15" });
        }

        const response = await axios.get('https://picsum.photos/v2/list', {
            params: {
                page: page,
                limit: 10
            }
        })
        const photos = response.data;

        res.json({
            page: page,
            photos: photos,
            totalPages: 15
        })
    } catch (error) {
        console.error("Error fetching photos:", error.message);
        res.status(500).json({ error: "Failed to fetch photos from Picsum API" });
    }
})




const PORT = 5000;
app.listen(PORT, () => {
    console.log(`app running on port ${PORT}`)
})