import React, { useContext } from 'react';
import { TodoContext } from '../context/Todocontext';
import { Search } from 'lucide-react';

export default function SearchAndFilter() {
    const { searchBox, setSearchBox, filter, setFilter } = useContext(TodoContext);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    return (
        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4 border-b">

            {/* Search Input */}
            <div className="relative border border-gray-300 rounded-md flex w-full">
                <Search className="absolute ml-2 mt-2 w-5 h-5 text-gray-400" />
                <input
                    className="w-full py-2 pl-9 pr-2 rounded-md bg-transparent outline-none text-black"
                    placeholder="Search..."
                    value={searchBox}
                    onChange={(e) => setSearchBox(e.target.value)}
                />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 p-1 bg-gray-200 rounded-lg">
                {['all', 'active', 'completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => handleFilterChange(f)}
                        className={`px-3 py-1 rounded-md capitalize font-medium ${filter === f ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>
    );
}