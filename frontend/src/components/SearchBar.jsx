import React, { useState } from 'react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');
    const handleChange = e => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar películas por nombre, género o año..."
                value={query}
                onChange={handleChange}
                className="search-input"
            />
        </div>
    );
}

export default SearchBar; 