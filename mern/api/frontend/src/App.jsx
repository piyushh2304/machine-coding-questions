import React, { useState, useEffect } from 'react';
import { useUsers } from './hooks/useUsers';
import UserCard from './components/userCard';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer)
  }, [searchInput])

  const {
    users,
    currentPage,
    loading,
    handleNextPage,
    handlePrevPage
  } = useUsers(1, debouncedSearch);

  const totalPages = 10;
  return (
    <div className="min-h-screen p-8 text-slate-800 font-sans bg-slate-50">

      {/* 1. Header Hero Display */}
      <header className="mb-8 text-center bg-white py-12 px-4 shadow-sm rounded-2xl mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4 tracking-tight">Active Users Directory</h1>

        {/* Beautiful Search Input */}
        <div className="max-w-md mx-auto relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            type="search"
            placeholder="Search directory..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-full focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-700"
          />
        </div>

      </header>

      {/* 2. Content Grid Map */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-2xl font-bold animate-pulse text-blue-400">Fetching team members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto place-items-center">
          {users && users.length > 0 ? (
            users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <div className="col-span-full h-64 flex flex-col justify-center items-center">
              <span className="text-xl text-slate-400 font-semibold mb-2">No users found matching "{debouncedSearch}"</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Global Pagination Controls */}
      <div className="flex justify-center items-center mt-12 space-x-6 pb-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading}
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${currentPage === 1 || loading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
            }`}
        >
          Previous
        </button>

        <span className="font-extrabold text-xl text-slate-700 bg-white px-6 py-2 rounded-full shadow-sm border border-slate-100">
          Page {currentPage}
        </span>

        <button
          onClick={handleNextPage}
          disabled={users && users.length < 12 || loading}
          className={`px-8 py-3 rounded-full font-bold shadow-md transition-all ${(users && users.length < 12) || loading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
            }`}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default App;