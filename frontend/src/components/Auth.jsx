// src/components/Auth.jsx
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'; // Importa los estilos de Amplify UI
import { useNavigate } from 'react-router-dom';

function AuthPage({ onSignIn }) {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <h2>Iniciar sesión / Registrarse</h2>
            <Authenticator
                loginMechanisms={["email"]}
                signUpAttributes={["email"]}
                socialProviders={[]}
                variation="default"
                hideSignUp={false}
                onStateChange={async (state) => {
                    if (state === 'signedin') {
                        const { getCurrentUser } = await import('aws-amplify/auth');
                        getCurrentUser().then(user => {
                            onSignIn(user);
                            navigate('/');
                        });
                    }
                }}
            />
        </div>
    );
}

export default AuthPage;