import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Twitter, Facebook, Instagram, Linkedin, Sparkles } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', message: '' });
        }, 3000);
    };

    const contactInfo = [
        { icon: Mail, label: 'Email', value: 'soporte@smartchoice.com' },
        { icon: Phone, label: 'Teléfono', value: '+1 (555) 123-4567' },
        { icon: MapPin, label: 'Dirección', value: 'Av. Tecnología 123, Silicon Valley, CA 94025' }
    ];

    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' }
    ];

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '1rem 1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
        fontSize: '1rem',
        fontFamily: 'inherit',
        transition: 'all 0.3s ease',
        outline: 'none'
    };

    return (
        <section
            id="contacto"
            style={{
                padding: '6rem 0',
                backgroundColor: 'var(--bg-primary)'
            }}
        >
            <div className="section-container">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <div className="badge" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
                        <Sparkles style={{ width: '1rem', height: '1rem' }} />
                        <span>Contacto</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                        ¿Tienes alguna <span className="gradient-text">pregunta?</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '42rem', margin: '0 auto', fontSize: '1.125rem' }}>
                        Nuestro equipo está listo para ayudarte. Envíanos un mensaje y te responderemos
                        en menos de 24 horas.
                    </p>
                </motion.div>

                <div className="contact-grid">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                            Información de Contacto
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.125rem' }}>
                            Estamos aquí para ayudarte a encontrar la laptop perfecta. No dudes en
                            contactarnos por cualquier medio.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                            {contactInfo.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        padding: '1.25rem',
                                        backgroundColor: 'var(--bg-card)',
                                        borderRadius: '0.75rem',
                                        border: '1px solid var(--border)'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '3rem',
                                            height: '3rem',
                                            borderRadius: '0.75rem',
                                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        <item.icon style={{ width: '1.25rem', height: '1.25rem', color: '#6366f1' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                            {item.label}
                                        </p>
                                        <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 0 }}>
                                            {item.value}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 500 }}>
                                Síguenos en Redes Sociales
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {socialLinks.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        style={{
                                            width: '2.75rem',
                                            height: '2.75rem',
                                            borderRadius: '0.75rem',
                                            backgroundColor: 'var(--bg-card)',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-secondary)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <social.icon style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: '1rem',
                            padding: '2.5rem',
                            border: '1px solid var(--border)'
                        }}
                    >
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Juan Pérez"
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="juan@ejemplo.com"
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Teléfono <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(Opcional)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 123-4567"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                    Mensaje
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Cuéntanos cómo podemos ayudarte..."
                                    rows={4}
                                    style={{ ...inputStyle, resize: 'none' }}
                                    required
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="btn-primary"
                                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitted}
                            >
                                {isSubmitted ? (
                                    <>
                                        <span style={{ fontSize: '1.25rem' }}>✓</span>
                                        ¡Mensaje Enviado!
                                    </>
                                ) : (
                                    <>
                                        Enviar Mensaje
                                        <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
