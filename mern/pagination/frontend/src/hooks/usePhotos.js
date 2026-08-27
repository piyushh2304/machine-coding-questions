import { useState, useEffect } from 'react';
import axios from 'axios';

export function usePhotos(initialPage = 1) {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = 15;

  useEffect(() => {
    fetchPhotos(currentPage);
  }, [currentPage]);

  const fetchPhotos = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/photos?page=${page}`);
      setPhotos(response.data.photos);
    } catch (error) {
      console.error("Oops! Failed to fetch photos", error);
      alert("Failed to connect to the backend. Is node server.js running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Return the data and functions so the UI can use them
  return {
    photos,
    currentPage,
    totalPages,
    isLoading,
    handleNextPage,
    handlePrevPage
  };
}