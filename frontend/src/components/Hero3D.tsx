import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Zap, Shield, Clock } from 'lucide-react';

interface Hero3DProps {
    onOpenChat: () => void;
}

export default function Hero3D({ onOpenChat }: Hero3DProps) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

    const stats = [
        { icon: Zap, value: '10K+', label: 'Recomendaciones', color: 'from-blue-500 to-cyan-500' },
        { icon: null, value: '500+', label: 'Laptops', color: 'from-green-500 to-emerald-500' },
        { icon: null, value: '4.9★', label: 'Rating', color: 'from-amber-500 to-orange-500' },
    ];

    const features = [
        { icon: Zap, text: 'Entrega Rápida' },
        { icon: Shield, text: 'Garantía 2 Años' },
        { icon: Clock, text: 'Soporte 24/7' },
    ];

    return (
        <section id="inicio" className="relative min-h-screen pt-24 overflow-hidden">
            {/* Background Orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <div className="section-container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ opacity, scale }}
                    >
                        {/* Badge - Verde IA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
                        >
                            <Sparkles className="w-4 h-4" style={{ color: '#10B981' }} />
                            <span style={{ color: '#10B981', fontWeight: 600 }}>IA Personalizada</span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                        >
                            Tu Laptop{' '}
                            <span className="gradient-text">Perfecta</span>
                            <br />
                            en 2 minutos
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg"
                        >
                            Nuestro asistente con inteligencia artificial analiza tus necesidades
                            y te recomienda la mejor opción en segundos.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-4 mb-10"
                        >
                            <motion.button
                                className="btn-primary text-lg px-8 py-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onOpenChat}
                            >
                                <Sparkles className="w-5 h-5" />
                                Comenzar Ahora →
                            </motion.button>
                            <motion.a
                                href="#catalogo"
                                className="btn-secondary text-lg px-8 py-4"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Ver Catálogo
                            </motion.a>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-6"
                        >
                            {features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <feature.icon className="w-4 h-4" style={{ color: '#0A66C2' }} />
                                    <span className="text-sm font-medium">{feature.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Content - 3D Laptop Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ y }}
                        className="relative hidden lg:block"
                    >
                        {/* Main Image Container */}
                        <motion.div
                            className="relative"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop"
                                    alt="Laptop"
                                    className="w-full h-auto"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-50" />
                            </div>

                            {/* Floating Stats Cards */}
                            <motion.div
                                className="absolute -bottom-12 -left-8 glass rounded-xl p-4 shadow-xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex items-center gap-4">
                                    {stats.map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                {stat.value}
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Rocket Icon - Azul */}
                            <motion.div
                                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ backgroundColor: '#0A66C2' }}
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <span className="text-2xl">🚀</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-[var(--text-secondary)] flex justify-center"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-3 rounded-full mt-2"
                            style={{ backgroundColor: '#0A66C2' }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
