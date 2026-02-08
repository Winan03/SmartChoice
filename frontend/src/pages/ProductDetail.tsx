import { useEffect, useState } from 'react';
import { Cpu, MemoryStick, HardDrive, Weight, ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import type { Laptop } from '../types/laptop';
import Navbar from '../components/Navbar';

interface ProductDetailProps {
    productId: string;
    onBack: () => void;
}

export default function ProductDetail({ productId, onBack }: ProductDetailProps) {
    const { products, allProducts } = useProducts();
    const [product, setProduct] = useState<Laptop | null>(null);

    useEffect(() => {
        const allAvailable = allProducts.length > 0 ? allProducts : products;
        const found = allAvailable.find(p => p.id.toString() === productId);
        setProduct(found || null);
    }, [productId, products, allProducts]);

    if (!product) {
        return (
            <div className="product-detail-page">
                <Navbar />
                <div className="product-detail-container">
                    <button
                        onClick={onBack}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            marginBottom: '2rem',
                            fontSize: '1rem'
                        }}
                    >
                        <ArrowLeft style={{ width: '20px', height: '20px' }} />
                        Volver al catálogo
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Producto no encontrado
                    </p>
                </div>
            </div>
        );
    }

    const getCategoryBadge = () => {
        if (product.gaming && product.ingenieria) {
            return { text: 'PRO', className: 'badge-pro' };
        }
        if (product.gaming) {
            return { text: 'GAMING', className: 'badge-gaming' };
        }
        if (product.ingenieria) {
            return { text: 'PRO', className: 'badge-pro' };
        }
        return { text: 'OFFICE', className: 'badge-office' };
    };

    const badge = getCategoryBadge();

    return (
        <div className="product-detail-page">
            <Navbar />

            <div className="product-detail-container">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                        fontSize: '1rem',
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-cyan)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    <ArrowLeft style={{ width: '20px', height: '20px' }} />
                    Volver al catálogo
                </button>

                <div className="product-detail-grid">
                    {/* Image Section */}
                    <div className="product-detail-image">
                        <img
                            src={product.imagen_url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'}
                            alt={`${product.marca} ${product.modelo}`}
                        />
                    </div>

                    {/* Info Section */}
                    <div className="product-detail-info">
                        {/* Badge */}
                        <div className="product-detail-badge">
                            <span className={badge.className}>{badge.text}</span>
                        </div>

                        {/* Brand & Model */}
                        <div>
                            <p className="product-detail-brand">{product.marca}</p>
                            <h1 className="product-detail-title">{product.modelo}</h1>
                        </div>

                        {/* Price */}
                        <div className="product-detail-price">
                            ${product.precio.toLocaleString()}
                        </div>

                        {/* Specs Grid */}
                        <div className="product-detail-specs">
                            <div className="product-detail-spec">
                                <div className="product-detail-spec-icon">
                                    <Cpu />
                                </div>
                                <div className="product-detail-spec-text">
                                    <span className="product-detail-spec-label">Procesador</span>
                                    <span className="product-detail-spec-value">{product.cpu}</span>
                                </div>
                            </div>

                            <div className="product-detail-spec">
                                <div className="product-detail-spec-icon">
                                    <MemoryStick />
                                </div>
                                <div className="product-detail-spec-text">
                                    <span className="product-detail-spec-label">Memoria RAM</span>
                                    <span className="product-detail-spec-value">{product.ram} GB</span>
                                </div>
                            </div>

                            <div className="product-detail-spec">
                                <div className="product-detail-spec-icon">
                                    <HardDrive />
                                </div>
                                <div className="product-detail-spec-text">
                                    <span className="product-detail-spec-label">Gráficos</span>
                                    <span className="product-detail-spec-value">{product.gpu}</span>
                                </div>
                            </div>

                            <div className="product-detail-spec">
                                <div className="product-detail-spec-icon">
                                    <Weight />
                                </div>
                                <div className="product-detail-spec-text">
                                    <span className="product-detail-spec-label">Peso</span>
                                    <span className="product-detail-spec-value">{product.peso} kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Stock Info */}
                        {product.stock > 0 && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: 'var(--success)',
                                fontSize: '0.875rem',
                                fontWeight: 500
                            }}>
                                <Star style={{ width: '16px', height: '16px' }} />
                                {product.stock} unidades disponibles
                            </div>
                        )}

                        {/* CTA Button */}
                        <a
                            href={product.link_compra || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="product-detail-cta"
                        >
                            <ExternalLink style={{ width: '20px', height: '20px' }} />
                            Comprar en Amazon
                        </a>

                        {/* Note */}
                        <p className="product-detail-note">
                            Serás redirigido a Amazon para completar tu compra de forma segura.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
