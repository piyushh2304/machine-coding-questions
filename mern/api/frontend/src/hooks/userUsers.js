/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from 'axios';


export function useUsers(initialPage = 1, searchQuery = '') {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);

    useEffect(() => {
        fetchUsers(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchUsers = async (page, search) => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/users', {
                params: { page, search }
            });
            setUsers(response.data.users);
        } catch (error) {
            console.log("failed to fetch users");
        } finally {
            setLoading(false);
        }
    }
    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => prev - 1);

    return {
        users,
        currentPage,
        loading,
        handleNextPage,
        handlePrevPage
    };
}