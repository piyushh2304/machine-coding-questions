import React, { useState, useEffect } from "react";

export default function DebouncedSearch() {
  const [query, setQuery] = useState("");       // stores what user types
  const [results, setResults] = useState([]);   // stores API response data
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {   // edge case: empty input
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      fakeAPI(query)
        .then(data => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 500); // debounce delay 500ms

    return () => clearTimeout(timer); // cleanup = cancel old timer
  }, [query]);

  return (
    <div>
      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {results.map((item, i) => (
        <p key={i}>{item}</p>
      ))}
    </div>
  );
}

// Fake API simulation
function fakeAPI(q) {
  return new Promise((resolve) => {
    setTimeout(() => resolve([`Result for ${q}`]), 500);
  });
}
