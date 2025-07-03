import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';
import AuthPage from './components/Auth';
import Home from './components/Home';
import NotFound from './components/NotFound';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Nueva función para forzar re-chequeo de usuario tras login
    const forceCheckUser = async () => {
        setLoading(true);
        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            navigate('/');
        } catch (error) {
            setUser(null);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        async function checkUser() {
            setLoading(true);
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                if (location.pathname === '/login') {
                    navigate('/');
                }
            } catch (error) {
                setUser(null);
                if (location.pathname !== '/login') {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        }

        checkUser();
    }, [location.pathname, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
                Cargando autenticación...
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Home user={user} /> : <AuthPage onSignIn={forceCheckUser} />} />
            <Route path="/" element={user ? <Home user={user} /> : <AuthPage onSignIn={forceCheckUser} />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;