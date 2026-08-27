import { usePhotos } from './hooks/usePhotos';
import PhotoCard from './components/PhotoCard';

function App() {
  const {
    photos,
    currentPage,
    totalPages,
    isLoading,
    handleNextPage,
    handlePrevPage
  } = usePhotos(1);

  return (
    <div className="min-h-screen p-8 text-gray-800 font-sans">

      {/* 1. Header Section */}
      <header className="mb-8 text-center bg-white py-12 shadow-sm rounded-2xl mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-3 tracking-tight">Awesome Photo Gallery</h1>
        <p className="text-lg text-gray-500 font-medium">Currently viewing Page {currentPage} out of {totalPages}</p>
      </header>

      {/* 2. Loading State vs Display Data */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-2xl font-bold animate-pulse text-indigo-400">Fetching masterpieces...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {photos && photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      {/* 3. Pagination Engine Controls */}
      <div className="flex justify-center items-center mt-12 space-x-6 pb-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || isLoading}
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${currentPage === 1 || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'
            }`}
        >
          Previous
        </button>

        <span className="font-extrabold text-xl text-gray-700 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
          {currentPage} <span className="text-gray-300 mx-2">|</span> {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || isLoading}
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${currentPage === totalPages || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'
            }`}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default App;