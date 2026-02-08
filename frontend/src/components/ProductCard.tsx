import { motion } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, Weight, Star } from 'lucide-react';
import type { Laptop } from '../types/laptop';

interface ProductCardProps {
    laptop: Laptop;
    index: number;
    isTopIA?: boolean;
    onViewDetails?: (id: number) => void;
}

export default function ProductCard({ laptop, index, isTopIA = false, onViewDetails }: ProductCardProps) {
    const getCategoryBadge = () => {
        if (laptop.gaming && laptop.ingenieria) {
            return { text: 'PRO', className: 'badge-pro' };
        }
        if (laptop.gaming) {
            return { text: 'GAMING', className: 'badge-gaming' };
        }
        if (laptop.ingenieria) {
            return { text: 'PRO', className: 'badge-pro' };
        }
        return { text: 'OFFICE', className: 'badge-office' };
    };

    const badge = getCategoryBadge();

    const handleClick = () => {
        if (onViewDetails) {
            onViewDetails(laptop.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <div className="product-card">
                {/* Image Container */}
                <div className="product-card-image">
                    <img
                        src={laptop.imagen_url || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'}
                        alt={`${laptop.marca} ${laptop.modelo}`}
                    />

                    {/* Badge */}
                    <div className="product-card-badge">
                        {isTopIA ? (
                            <div className="badge-top-ia">
                                <Star style={{ width: '14px', height: '14px' }} fill="white" />
                                Top IA
                            </div>
                        ) : (
                            <span className={badge.className}>{badge.text}</span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="product-card-content">
                    {/* Brand & Model */}
                    <p className="product-card-brand">{laptop.marca}</p>
                    <h3 className="product-card-title">{laptop.modelo}</h3>

                    {/* Specs Grid */}
                    <div className="product-card-specs">
                        <div className="product-card-spec">
                            <Cpu style={{ color: 'var(--neon-cyan)' }} />
                            <span>{laptop.cpu}</span>
                        </div>
                        <div className="product-card-spec">
                            <MemoryStick style={{ color: 'var(--neon-green)' }} />
                            <span>{laptop.ram}GB</span>
                        </div>
                        <div className="product-card-spec">
                            <HardDrive style={{ color: 'var(--neon-blue)' }} />
                            <span>{laptop.gpu}</span>
                        </div>
                        <div className="product-card-spec">
                            <Weight style={{ color: 'var(--warning)' }} />
                            <span>{laptop.peso}kg</span>
                        </div>
                    </div>

                    {/* Footer: Price & Button */}
                    <div className="product-card-footer">
                        <div className="product-card-price">
                            ${laptop.precio.toLocaleString()}
                        </div>
                        <button
                            className="product-card-btn"
                            onClick={handleClick}
                        >
                            Ver
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
