import React from 'react';

function MovieCard({ movie, onClick }) {
    const placeholder = 'https://via.placeholder.com/300x450?text=Sin+Imagen';
    return (
        <div className="movie-card" tabIndex={0} role="button" aria-label={`Ver detalles de ${movie.title || 'película'}`} onClick={onClick} onKeyPress={e => { if (e.key === 'Enter') onClick(); }}>
            <img src={movie.poster || placeholder} alt={movie.title || 'Sin título'} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px', objectFit: 'cover', height: '320px', background: '#111' }} />
            <h3>{movie.title || 'Sin título'}</h3>
            <p><strong>Género:</strong> {movie.genre || 'No especificado'}</p>
            <p><strong>Año:</strong> {movie.year || 'No especificado'}</p>
            {movie.description && <p><strong>Descripción:</strong> {movie.description}</p>}
        </div>
    );
}

export default MovieCard; 