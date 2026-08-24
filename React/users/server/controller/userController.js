import axios from "axios";


export const getUsers = async (req, res) => {
    try {
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/users"
        );

        res.json(response.data);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
}