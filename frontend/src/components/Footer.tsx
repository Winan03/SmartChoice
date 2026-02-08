import { motion } from 'framer-motion';
import { Monitor, Mail, Phone, Twitter, Facebook, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerLinks = {
        producto: [
            { name: 'Catálogo', href: '#catalogo' },
            { name: 'Asistente IA', href: '#' },
            { name: 'Comparador', href: '#' },
            { name: 'Ofertas', href: '#' }
        ],
        soporte: [
            { name: 'Centro de Ayuda', href: '#' },
            { name: 'Garantías', href: '#' },
            { name: 'Devoluciones', href: '#' },
            { name: 'Estado de Pedido', href: '#' }
        ],
        empresa: [
            { name: 'Sobre Nosotros', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Carreras', href: '#' },
            { name: 'Contacto', href: '#contacto' }
        ],
        legal: [
            { name: 'Privacidad', href: '#' },
            { name: 'Términos', href: '#' },
            { name: 'Cookies', href: '#' }
        ]
    };

    const socialLinks = [
        { icon: Twitter, href: '#' },
        { icon: Facebook, href: '#' },
        { icon: Instagram, href: '#' },
        { icon: Linkedin, href: '#' }
    ];

    const linkColumnStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    };

    const linkStyle: React.CSSProperties = {
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        transition: 'color 0.2s ease',
        cursor: 'pointer'
    };

    return (
        <>
            <footer
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderTop: '1px solid var(--border)',
                    padding: '4rem 0 2rem 0'
                }}
            >
                <div className="section-container">
                    {/* Main Footer Grid */}
                    <div className="footer-grid" style={{ marginBottom: '3rem' }}>
                        {/* Brand Column */}
                        <div>
                            <a href="#inicio" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', textDecoration: 'none' }}>
                                <div
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '0.75rem',
                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Monitor style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                    <span style={{ color: 'var(--text-primary)' }}>Smart</span>
                                    <span className="gradient-text">Choice</span>
                                </span>
                            </a>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '280px' }}>
                                Tu ayudante inteligente para encontrar la laptop perfecta en minutos.
                            </p>

                            {/* Social Links */}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        style={{
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '0.5rem',
                                            backgroundColor: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-secondary)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <social.icon style={{ width: '1rem', height: '1rem' }} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Producto</h4>
                            <ul style={linkColumnStyle}>
                                {footerLinks.producto.map((link) => (
                                    <li key={link.name} style={{ listStyle: 'none' }}>
                                        <a href={link.href} style={linkStyle}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Soporte</h4>
                            <ul style={linkColumnStyle}>
                                {footerLinks.soporte.map((link) => (
                                    <li key={link.name} style={{ listStyle: 'none' }}>
                                        <a href={link.href} style={linkStyle}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Empresa</h4>
                            <ul style={linkColumnStyle}>
                                {footerLinks.empresa.map((link) => (
                                    <li key={link.name} style={{ listStyle: 'none' }}>
                                        <a href={link.href} style={linkStyle}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Legal</h4>
                            <ul style={linkColumnStyle}>
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name} style={{ listStyle: 'none' }}>
                                        <a href={link.href} style={linkStyle}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div
                        style={{
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                            borderRadius: '1rem',
                            padding: '2rem',
                            marginBottom: '3rem',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.5rem',
                            textAlign: 'center'
                        }}
                    >
                        <div>
                            <h4 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                                Suscríbete a nuestro Newsletter
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                                Recibe ofertas exclusivas y noticias de nuevos productos.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '400px' }}>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.75rem',
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                            <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
                                Suscribirse
                            </button>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid var(--border)'
                        }}
                    >
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
                            © {new Date().getFullYear()} SmartChoice. Todos los derechos reservados.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <Mail style={{ width: '1rem', height: '1rem' }} />
                                soporte@smartchoice.com
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                <Phone style={{ width: '1rem', height: '1rem' }} />
                                +1 (555) 123-4567
                            </span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <motion.button
                onClick={scrollToTop}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0 }}
                style={{
                    position: 'fixed',
                    bottom: '6rem',
                    right: '1.5rem',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 30,
                    color: 'var(--text-primary)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowUp style={{ width: '1.25rem', height: '1.25rem' }} />
            </motion.button>
        </>
    );
}
