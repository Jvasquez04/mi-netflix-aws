import React from 'react';
import MovieCard from './MovieCard';

function MoviesGrid({ movies, onMovieClick }) {
    return (
        <div className="movies-grid">
            {movies.map((movie, idx) => (
                <MovieCard key={movie.id || idx} movie={movie} onClick={() => onMovieClick(movie)} />
            ))}
        </div>
    );
}

export default MoviesGrid; 