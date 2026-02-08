import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
    Cpu,
    Sparkles,
    Shield,
    Truck,
    Package,
    Headphones
} from 'lucide-react';

const features = [
    {
        icon: Sparkles,
        title: 'IA Personalizada',
        description: 'Asistente inteligente que encuentra tu laptop ideal',
        iconColor: '#10B981',
        bgColor: '#D1FAE5'
    },
    {
        icon: Cpu,
        title: 'Tecnología de Punta',
        description: 'Los últimos procesadores y componentes del mercado',
        iconColor: '#0A66C2',
        bgColor: '#DBEAFE'
    },
    {
        icon: Shield,
        title: 'Garantía Extendida',
        description: '2 años de garantía en todos nuestros productos',
        iconColor: '#F59E0B',
        bgColor: '#FEF3C7'
    },
    {
        icon: Truck,
        title: 'Envío Express',
        description: 'Recibe tu laptop en 24-48 horas',
        iconColor: '#EF4444',
        bgColor: '#FFE4E6'
    },
    {
        icon: Package,
        title: 'Stock Garantizado',
        description: 'Más de 500 modelos disponibles inmediatamente',
        iconColor: '#6366F1',
        bgColor: '#E0E7FF'
    },
    {
        icon: Headphones,
        title: 'Soporte 24/7',
        description: 'Asistencia técnica disponible siempre que la necesites',
        iconColor: '#EC4899',
        bgColor: '#FCE7F3'
    }
];

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section
            id="caracteristicas"
            style={{
                padding: '6rem 0',
                backgroundColor: 'var(--bg-secondary)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <div ref={ref} className="section-container" style={{ position: 'relative', zIndex: 10 }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                        style={{ backgroundColor: 'rgba(10, 102, 194, 0.1)', marginBottom: '1.5rem' }}
                    >
                        <Sparkles style={{ width: '1rem', height: '1rem', color: '#0A66C2' }} />
                        <span style={{ color: '#0A66C2', fontWeight: 600 }}>¿Por qué elegirnos?</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        Características que nos hacen <span className="gradient-text">únicos</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                        Combinamos tecnología de punta con un servicio excepcional para ofrecerte
                        la mejor experiencia
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div
                                style={{
                                    height: '100%',
                                    backgroundColor: 'var(--bg-card)',
                                    borderRadius: '1rem',
                                    padding: '2rem',
                                    border: '1px solid var(--border)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-8px)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                }}
                            >
                                {/* Icon */}
                                <div
                                    style={{
                                        width: '3.5rem',
                                        height: '3.5rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: feature.bgColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    <feature.icon style={{ width: '1.75rem', height: '1.75rem', color: feature.iconColor }} />
                                </div>

                                {/* Content */}
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 0 }}>
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    style={{ textAlign: 'center', marginTop: '4rem' }}
                >
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                        ¿Listo para encontrar tu laptop perfecta?
                    </p>
                    <motion.a
                        href="#catalogo"
                        className="btn-primary"
                        style={{ fontSize: '1rem', padding: '1rem 2rem' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explorar Catálogo
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
}
