import React from 'react';

function Loader() {
    return (
        <div className="movies-grid">
            {[...Array(6)].map((_, idx) => (
                <div key={idx} className="movie-card skeleton-loader">
                    <div className="skeleton-img" />
                    <div className="skeleton-line" style={{ width: '70%' }} />
                    <div className="skeleton-line" style={{ width: '50%' }} />
                    <div className="skeleton-line" style={{ width: '90%' }} />
                </div>
            ))}
        </div>
    );
}

export default Loader; 