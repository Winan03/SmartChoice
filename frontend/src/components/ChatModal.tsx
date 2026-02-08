import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Bot, ShoppingCart, Cpu, Monitor, MemoryStick, Weight, RefreshCw, Sun, Moon, Gamepad2, Wrench, Briefcase, Zap, Feather, Scale } from 'lucide-react';
import type { ChatMessage, ChatState } from '../types/laptop';
import { sendMessageToN8N } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Icon mapping for options
const iconMap: Record<string, React.ReactNode> = {
    'gaming': <Gamepad2 className="w-5 h-5" />,
    'ingenieria': <Wrench className="w-5 h-5" />,
    'oficina': <Briefcase className="w-5 h-5" />,
    'ambos': <><Gamepad2 className="w-4 h-4" /><Wrench className="w-4 h-4" /></>,
    'potencia': <Zap className="w-5 h-5" />,
    'portabilidad': <Feather className="w-5 h-5" />,
    'equilibrio': <Scale className="w-5 h-5" />,
};

// Parse markdown-like text (convert **text** to bold)
function parseMarkdown(text: string): React.ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

// Clean value - remove duplicate units
function cleanValue(value: string | number, unit: string): string {
    const strValue = String(value);
    // Remove existing unit if present
    const cleanedValue = strValue.replace(new RegExp(`${unit}$`, 'gi'), '').replace(/^\$/, '');
    return `${cleanedValue}${unit}`;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatState, setChatState] = useState<ChatState>({
        session_id: '',
        fase: '',
        uso: null,
        prioridad: null
    });

    const { isDark, toggleTheme } = useTheme();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            setChatState(prev => ({ ...prev, session_id: sessionId }));
            startConversation(sessionId);
        }
    }, [isOpen]);

    const startConversation = async (sessionId: string) => {
        setIsLoading(true);
        try {
            const data = await sendMessageToN8N({
                session_id: sessionId,
                mensaje: '',
                estado: { fase: '', uso: null, prioridad: null }
            });
            handleBotResponse(data);
        } catch (error) {
            console.error('Error:', error);
            addFallbackMessage();
        } finally {
            setIsLoading(false);
        }
    };

    const addFallbackMessage = () => {
        const fallbackMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Lo siento, estoy teniendo problemas para conectar con el servidor. Por favor intenta más tarde.',
            options: []
        };
        setMessages([fallbackMessage]);
    };

    const handleBotResponse = (data: any) => {
        const botMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'bot',
            content: data.mensaje,
            options: data.opciones,
            producto: data.producto
        };
        setMessages(prev => [...prev, botMessage]);

        if (data.estado) {
            setChatState(prev => ({
                ...prev,
                ...data.estado
            }));
        }
    };

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: messageText
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const data = await sendMessageToN8N({
                session_id: chatState.session_id,
                mensaje: messageText,
                estado: chatState
            });
            handleBotResponse(data);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: ChatMessage = {
                id: Date.now().toString(),
                type: 'bot',
                content: 'Hubo un error al procesar tu mensaje. Por favor intenta de nuevo.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (_optionId: string, optionText: string) => {
        sendMessage(optionText);
    };

    const resetChat = () => {
        setMessages([]);
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        setChatState({
            session_id: sessionId,
            fase: '',
            uso: null,
            prioridad: null
        });
        startConversation(sessionId);
    };

    // Get icon for option
    const getOptionIcon = (optionId: string) => {
        return iconMap[optionId] || null;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="chat-modal fixed bottom-4 right-4 md:bottom-8 md:right-8 w-[calc(100%-2rem)] md:w-[420px] h-[650px] max-h-[calc(100vh-4rem)] z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="chat-header flex items-center gap-3">
                            <div className="chat-avatar">
                                <Bot />
                            </div>
                            <div className="flex-1">
                                <h3 className="chat-title">Asistente SmartChoice</h3>
                                <div className="chat-status">
                                    <span className="chat-status-dot" />
                                    En línea
                                </div>
                            </div>

                            {/* Theme Toggle */}
                            <motion.button
                                onClick={toggleTheme}
                                className="chat-theme-toggle"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isDark ? <Sun /> : <Moon />}
                            </motion.button>

                            {/* Close Button */}
                            <motion.button
                                onClick={onClose}
                                className="chat-close-btn"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X />
                            </motion.button>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages flex-1 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`chat-bubble ${message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                                        <p className="chat-message-text">
                                            {parseMarkdown(message.content)}
                                        </p>

                                        {/* Options */}
                                        {message.options && message.options.length > 0 && (
                                            <div className="chat-options">
                                                {message.options.map((option) => (
                                                    <motion.button
                                                        key={option.id}
                                                        onClick={() => handleOptionClick(option.id, option.texto)}
                                                        className="chat-option-btn"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <span className="chat-option-icon">
                                                            {getOptionIcon(option.id)}
                                                        </span>
                                                        <span>{option.texto.replace(/^[^\w\s]+\s*/, '')}</span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Product Card */}
                                        {message.producto && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="chat-product-card"
                                            >
                                                <img
                                                    src={message.producto.imagen_url}
                                                    alt={`${message.producto.marca} ${message.producto.modelo}`}
                                                    className="chat-product-image"
                                                />
                                                <div className="chat-product-content">
                                                    <p className="chat-product-brand">
                                                        {message.producto.marca}
                                                    </p>
                                                    <p className="chat-product-model">
                                                        {message.producto.modelo}
                                                    </p>

                                                    {/* Specs Grid */}
                                                    <div className="chat-product-specs">
                                                        <div className="chat-product-spec">
                                                            <Cpu />
                                                            <span>{message.producto.cpu}</span>
                                                        </div>
                                                        <div className="chat-product-spec">
                                                            <Monitor />
                                                            <span>{message.producto.gpu}</span>
                                                        </div>
                                                        <div className="chat-product-spec">
                                                            <MemoryStick />
                                                            <span>{cleanValue(message.producto.ram, 'GB')} RAM</span>
                                                        </div>
                                                        <div className="chat-product-spec">
                                                            <Weight />
                                                            <span>{cleanValue(message.producto.peso, 'kg')}</span>
                                                        </div>
                                                    </div>

                                                    {/* Price and CTA */}
                                                    <div className="chat-product-footer">
                                                        <span className="chat-product-price">
                                                            ${String(message.producto.precio).replace(/^\$/, '')}
                                                        </span>
                                                        <motion.a
                                                            href={message.producto.link_compra}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="chat-buy-btn"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <ShoppingCart className="w-4 h-4" />
                                                            Comprar
                                                        </motion.a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="chat-typing">
                                        <span className="chat-typing-dot" />
                                        <span className="chat-typing-dot" />
                                        <span className="chat-typing-dot" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="chat-input-area">
                            {chatState.fase === 'completado' ? (
                                <motion.button
                                    onClick={resetChat}
                                    className="chat-reset-btn"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <RefreshCw className="w-5 h-5" />
                                    Empezar de Nuevo
                                </motion.button>
                            ) : (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        sendMessage(inputValue);
                                    }}
                                    className="flex gap-3"
                                >
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Escribe un mensaje..."
                                        className="chat-input"
                                        disabled={isLoading}
                                    />
                                    <motion.button
                                        type="submit"
                                        className="chat-send-btn"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={isLoading}
                                    >
                                        <Send />
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Floating Chat Button with Fluorescent Styling
export function ChatButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            className="chat-fab"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {/* Pulse Effect */}
            <span className="chat-fab-pulse" />

            {/* Badge */}
            <span className="chat-fab-badge">1</span>

            <MessageCircle />
        </motion.button>
    );
}
