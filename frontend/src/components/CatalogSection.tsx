import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Gamepad2, Wrench, Briefcase, Sparkles, RefreshCw } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../context/ProductContext';

// Filter types and constants
type FilterType = 'all' | 'gaming' | 'ingenieria' | 'oficina';

const filters: { id: FilterType; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
    { id: 'ingenieria', label: 'Ingeniería', icon: Wrench },
    { id: 'oficina', label: 'Oficina', icon: Briefcase },
];

interface CatalogSectionProps {
    onViewProduct?: (productId: number) => void;
}

export default function CatalogSection({ onViewProduct }: CatalogSectionProps) {
    const { products, loading, error, refreshProducts } = useProducts();
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLaptops = useMemo(() => {
        let result = products;

        // Filter by category
        if (activeFilter !== 'all') {
            result = result.filter((laptop) => laptop[activeFilter]);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (laptop) =>
                    laptop.marca.toLowerCase().includes(query) ||
                    laptop.modelo.toLowerCase().includes(query) ||
                    laptop.cpu.toLowerCase().includes(query) ||
                    laptop.gpu.toLowerCase().includes(query)
            );
        }

        return result;
    }, [products, activeFilter, searchQuery]);

    const getCategoryCount = (category: FilterType) => {
        if (category === 'all') return products.length;
        return products.filter((l) => l[category]).length;
    };

    if (loading) {
        return (
            <section id="catalogo" className="catalog-section">
                <div className="section-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
                    <RefreshCw style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite', color: 'var(--neon-cyan)' }} />
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Cargando catálogo...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="catalogo" className="catalog-section">
                <div className="section-container" style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--error)' }}>{error}</p>
                    <button onClick={() => refreshProducts()} className="btn-neon" style={{ marginTop: '1rem' }}>
                        Reintentar
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section id="catalogo" className="catalog-section">
            <div className="section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="catalog-header"
                >
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            background: 'rgba(6, 182, 212, 0.1)',
                            marginBottom: '1rem'
                        }}
                    >
                        <Sparkles style={{ width: '16px', height: '16px', color: 'var(--neon-cyan)' }} />
                        <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>Catálogo Premium</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>
                        Descubre Nuestras <span className="neon-text">Mejores Laptops</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Tecnología de última generación para gaming, ingeniería y oficina.
                        Encuentra el equipo perfecto para ti.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="catalog-search"
                >
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por modelo, marca o características..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="catalog-filters"
                >
                    {filters.map((filter) => (
                        <motion.button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '9999px',
                                fontWeight: activeFilter === filter.id ? 700 : 500,
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: activeFilter === filter.id ? 'var(--neon-cyan)' : 'var(--bg-card)',
                                color: activeFilter === filter.id ? '#0f172a' : 'var(--text-secondary)',
                                border: activeFilter === filter.id ? 'none' : '1px solid var(--border)',
                                boxShadow: activeFilter === filter.id
                                    ? '0 0 10px #00e5ff, 0 0 20px rgba(0, 229, 255, 0.4), 0 0 30px rgba(0, 229, 255, 0.2)'
                                    : 'none'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <filter.icon style={{ width: '16px', height: '16px' }} />
                            <span>{filter.label}</span>
                            <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                                {getCategoryCount(filter.id)}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Results Count */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="catalog-results"
                >
                    Mostrando <span style={{ fontWeight: 700, color: 'var(--neon-cyan)' }}>{filteredLaptops.length}</span> de{' '}
                    <span style={{ fontWeight: 700 }}>{products.length}</span> productos
                </motion.p>

                {/* Products Grid */}
                <div className="catalog-grid">
                    {filteredLaptops.map((laptop, index) => (
                        <ProductCard
                            key={laptop.id}
                            laptop={laptop}
                            index={index}
                            isTopIA={index === 0 && activeFilter === 'all'}
                            onViewDetails={onViewProduct}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredLaptops.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '4rem 0' }}
                    >
                        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No se encontraron resultados</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Intenta con otros términos de búsqueda o cambia el filtro.
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
