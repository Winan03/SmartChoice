import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === CONFIG.ADMIN_PASSWORD) {
            onLogin();
        } else {
            setError('Contraseña incorrecta');
        }
    };

    return (
        <div className="login-page">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="login-card"
            >
                {/* Icon */}
                <div className="login-icon">
                    <Lock />
                </div>

                {/* Title */}
                <h2 className="login-title">
                    Acceso Administrativo
                </h2>
                <p className="login-subtitle">
                    Ingresa la contraseña para gestionar el catálogo
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="login-input"
                    />

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="login-error"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button type="submit" className="login-submit">
                        Ingresar
                        <ArrowRight style={{ width: '20px', height: '20px' }} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
