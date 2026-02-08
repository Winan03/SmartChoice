import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, LogOut, CheckCircle, AlertCircle, Moon, Sun, ArrowLeft, Laptop as LaptopIcon } from 'lucide-react';
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import { CONFIG } from '../config';

interface AdminProps {
    onLogout: () => void;
}

const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`${className} bg-gray-100 dark:bg-gray-700 flex items-center justify-center`}>
                <LaptopIcon className="w-5 h-5 text-gray-400" />
            </div>
        );
    }

    return (
        <img
            className={className}
            src={src}
            alt={alt}
            onError={() => setError(true)}
        />
    );
};

export default function Admin({ onLogout }: AdminProps) {
    const { products, allProducts, loading, error, refreshProducts } = useProducts();
    const { isDark, toggleTheme } = useTheme();

    // Usar allProducts para el admin, o products si allProducts está vacío (fallback)
    const displayProducts = allProducts.length > 0 ? allProducts : products;

    return (
        <div className="admin-page">
            {/* Navbar */}
            <nav className="admin-navbar">
                <div className="admin-navbar-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <a href="/" style={{ padding: '0.5rem', borderRadius: '0.5rem' }} title="Volver al inicio">
                            <ArrowLeft style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
                        </a>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            background: 'linear-gradient(to right, #2563eb, #06b6d4)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            SmartChoice Admin
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={toggleTheme}
                            style={{
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            {isDark ? <Sun style={{ width: '20px', height: '20px' }} /> : <Moon style={{ width: '20px', height: '20px' }} />}
                        </button>
                        <button
                            onClick={onLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.375rem 0.75rem',
                                borderRadius: '0.5rem',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}
                        >
                            <LogOut style={{ width: '16px', height: '16px' }} />
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="admin-main">
                <div className="admin-container">
                    {/* Header */}
                    <div className="admin-header">
                        <div>
                            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>Panel de Control</h1>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
                                Gestiona el inventario sincronizado con Google Sheets.
                            </p>
                        </div>

                        <button
                            onClick={() => refreshProducts()}
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                            disabled={loading}
                        >
                            <RefreshCw style={{ width: '20px', height: '20px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                            {loading ? 'Sincronizando...' : 'Sincronizar Datos'}
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="admin-stats-grid">
                        <div className="admin-stat-card">
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Total Productos</div>
                            <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>{displayProducts.length}</div>
                        </div>
                        <div className="admin-stat-card">
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Estado de Conexión</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, color: displayProducts.length > 0 ? '#22c55e' : '#eab308' }}>
                                <CheckCircle style={{ width: '20px', height: '20px' }} />
                                {displayProducts.length > 0 ? 'Conectado a Sheets' : 'Esperando datos...'}
                            </div>
                        </div>

                        <a href={`https://docs.google.com/spreadsheets/d/${CONFIG.GOOGLE_SHEET_ID}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-stat-card"
                            style={{ background: '#eef2ff', borderColor: '#c7d2fe', textDecoration: 'none' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: '#312e81', fontWeight: 500 }}>Editar en Google Sheets</span>
                                <ExternalLink style={{ width: '20px', height: '20px', color: '#6366f1' }} />
                            </div>
                            <p style={{ color: '#4338ca', fontSize: '0.875rem', marginBottom: 0 }}>
                                Haz clic para abrir la hoja de cálculo y modificar el inventario.
                            </p>
                        </a>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl mb-8 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 whitespace-pre-wrap text-sm">{error}</div>
                        </div>
                    )}

                    <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--bg-secondary)]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Producto</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Specs</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Categoría</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {loading && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                Cargando datos...
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && displayProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                                No se encontraron productos activos.
                                            </td>
                                        </tr>
                                    )}
                                    {!loading && displayProducts.length > 0 && (
                                        displayProducts.map((product) => (
                                            <motion.tr
                                                key={product.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="hover:bg-[var(--bg-secondary)] transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                                    #{product.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 flex-shrink-0">
                                                            <ImageWithFallback
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                                src={product.imagen_url}
                                                                alt={product.modelo}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-[var(--text-primary)]">{product.modelo}</div>
                                                            <div className="text-sm text-[var(--text-secondary)]">{product.marca}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--text-primary)]">{product.cpu}</div>
                                                    <div className="text-xs text-[var(--text-secondary)]">{product.ram}GB RAM | {product.gpu}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {product.gaming && (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Gaming
                                                            </span>
                                                        )}
                                                        {product.ingenieria && (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                Ingeniería
                                                            </span>
                                                        )}
                                                        {product.oficina && (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300">
                                                                Oficina
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--text-primary)]">
                                                    ${product.precio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                                                    {product.stock} un.
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.activo
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {product.activo ? 'Activo' : 'Inactivo'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}