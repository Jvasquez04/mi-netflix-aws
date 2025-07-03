import React from 'react';

function MovieModal({ movie, onClose }) {
    if (!movie) return null;
    const placeholder = 'https://via.placeholder.com/300x450?text=Sin+Imagen';
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
                <img src={movie.poster || placeholder} alt={movie.title || 'Sin título'} style={{ width: '220px', borderRadius: '8px', marginBottom: '16px', objectFit: 'cover', background: '#111' }} />
                <h2>{movie.title || 'Sin título'}</h2>
                <p><strong>Género:</strong> {movie.genre || 'No especificado'}</p>
                <p><strong>Año:</strong> {movie.year || 'No especificado'}</p>
                {movie.description && <p><strong>Descripción:</strong> {movie.description}</p>}
            </div>
        </div>
    );
}

export default MovieModal; 