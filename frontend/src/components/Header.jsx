import React from 'react';

function Header({ userName, onSignOut }) {
    // Extraer inicial para el avatar
    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '';
    return (
        <header className="header-netflix">
            <div className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '2rem', color: '#e50914', letterSpacing: '2px' }}>N</span>
                Mi Netflix Básico
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: '#e50914',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    fontWeight: 'bold', fontSize: '1.2rem', marginRight: '8px',
                }}>{getInitial(userName)}</div>
                <span className="header-user">{userName}</span>
                <button className="btn-logout" onClick={onSignOut}>Cerrar Sesión</button>
            </div>
        </header>
    );
}

export default Header; 