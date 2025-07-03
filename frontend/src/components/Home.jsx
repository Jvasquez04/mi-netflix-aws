// src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { signOut, getCurrentUser } from 'aws-amplify/auth'; // Importaciones de v6
import { useNavigate } from 'react-router-dom'; // Para la redirección

function Home({ user: propUser }) { // Recibimos user como prop, o lo obtenemos si no viene
    const [userEmail, setUserEmail] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // URL de la API de películas
    const MOVIES_API_URL = "https://rtd9w9d717.execute-api.us-east-1.amazonaws.com/$default/movies";

    useEffect(() => {
        async function fetchUserEmail() {
            if (propUser) {
                setUserEmail(propUser.signInDetails?.loginId || propUser.username || 'Usuario');
            } else {
                try {
                    const currentUser = await getCurrentUser();
                    setUserEmail(currentUser.signInDetails?.loginId || currentUser.username || 'Usuario');
                } catch (error) {
                    console.error('Error al obtener el usuario en Home:', error);
                    setUserEmail('Desconocido');
                    navigate('/login');
                }
            }
        }
        fetchUserEmail();
    }, [propUser, navigate]);

    // Cargar películas automáticamente al montar el componente
    useEffect(() => {
        fetchMovies();
        // eslint-disable-next-line
    }, []);

    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(MOVIES_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            console.error('Error al obtener películas:', error);
            setError('Error al cargar las películas');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(); // Función de signOut de v6
            navigate('/login'); // Redirige a la página de login después de cerrar sesión
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Extraer solo el nombre del usuario para mostrar en la cabecera
    const getDisplayName = (emailOrUser) => {
        if (!emailOrUser) return '';
        if (emailOrUser.includes('@')) {
            return emailOrUser.split('@')[0];
        }
        return emailOrUser;
    };

    return (
        <div className="main-content">
            {/* Cabecera moderna */}
            <header className="header-netflix">
                {/* Logo tipo Netflix */}
                <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '2rem', color: '#e50914', letterSpacing: '2px' }}>N</span>
                    Mi Netflix Básico
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Avatar genérico */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#e50914',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        marginRight: '8px',
                    }}>
                        {getDisplayName(userEmail).charAt(0).toUpperCase()}
                    </div>
                    <span className="header-user">
                        {getDisplayName(userEmail)}
                    </span>
                    <button className="btn-logout" onClick={handleSignOut}>
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Contenido principal */}
            <div>
                {/* Sección de Películas */}
                <div className="movies-section">
                    <div className="movies-header">
                        <h2>Películas Disponibles</h2>
                    </div>
                    {movies.length > 0 ? (
                        <div className="movies-grid">
                            {movies.map((movie, index) => (
                                <div key={movie.id || index} className="movie-card">
                                    <h3>{movie.title || 'Sin título'}</h3>
                                    <p><strong>Género:</strong> {movie.genre || 'No especificado'}</p>
                                    <p><strong>Año:</strong> {movie.year || 'No especificado'}</p>
                                    {movie.description && (
                                        <p><strong>Descripción:</strong> {movie.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : loading ? (
                        <div className="empty-message">Cargando películas...</div>
                    ) : (
                        <div className="empty-message">
                            No hay películas disponibles.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;