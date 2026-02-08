// ==========================================
// SmartChoice - Main Application Logic
// ==========================================

class SmartChoiceApp {
    constructor() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatOptions = document.getElementById('chatOptions');
        this.chatInput = document.getElementById('chatInput');
        this.chatSend = document.getElementById('chatSend');
        this.chatToggle = document.getElementById('chatToggle');
        this.productsGrid = document.getElementById('productsGrid');

        // Chat state (stateless - sent to n8n each time)
        this.chatState = {
            session_id: this.generateSessionId(),
            fase: '',
            uso: null,
            prioridad: null
        };

        // Sample products for demo (these would come from Google Sheets in production)
        this.products = [];

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    bindEvents() {
        // Open chat buttons
        const openChatBtns = [
            document.getElementById('openChatBtn'),
            document.getElementById('heroOpenChat'),
            document.getElementById('catalogOpenChat'),
            document.getElementById('catalogCta'),
            document.getElementById('chatToggle')
        ];

        openChatBtns.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.openChat());
            }
        });

        // Close chat
        const closeChatBtn = document.getElementById('closeChatBtn');
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => this.closeChat());
        }

        // Send message
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterProducts(e.target.dataset.filter, e.target));
        });
    }

    // ==========================================
    // Chat Functions
    // ==========================================

    openChat() {
        this.chatWidget.classList.add('open');
        this.chatToggle.classList.add('hidden');

        // If no messages, start conversation
        if (this.chatMessages.children.length === 0) {
            this.startConversation();
        }
    }

    closeChat() {
        this.chatWidget.classList.remove('open');
        this.chatToggle.classList.remove('hidden');
    }

    async startConversation() {
        // Reset state
        this.chatState = {
            session_id: this.generateSessionId(),
            fase: '',
            uso: null,
            prioridad: null
        };

        // Send initial request to n8n
        await this.sendToN8N('');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Clear options
        this.chatOptions.innerHTML = '';

        // Send to n8n
        await this.sendToN8N(message);
    }

    async selectOption(optionId, optionText) {
        // Add user selection to chat
        this.addMessage(optionText, 'user');

        // Clear options
        this.chatOptions.innerHTML = '';

        // Send to n8n
        await this.sendToN8N(optionId);
    }

    async sendToN8N(mensaje) {
        // Show typing indicator
        this.showTyping();

        try {
            const payload = {
                session_id: this.chatState.session_id,
                mensaje: mensaje,
                estado: this.chatState
            };

            console.log('Sending to n8n:', payload);

            const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response from n8n:', data);

            // Hide typing
            this.hideTyping();

            // Update state
            if (data.estado) {
                this.chatState = { ...this.chatState, ...data.estado };
            }

            // Add bot message
            if (data.mensaje) {
                this.addMessage(data.mensaje, 'bot', data.producto);
            }

            // Show options if available
            if (data.opciones && data.opciones.length > 0) {
                this.showOptions(data.opciones);
            }

        } catch (error) {
            console.error('Error communicating with n8n:', error);
            this.hideTyping();

            // Fallback: simulate response for demo
            this.handleFallback(mensaje);
        }
    }

    handleFallback(mensaje) {
        // Fallback logic when n8n is not available (for demo purposes)
        const fase = this.chatState.fase;

        if (!fase || fase === '') {
            // Initial message
            this.addMessage(
                '¡Hola! 👋 Soy tu asistente de SmartChoice.\n\nTe ayudaré a encontrar la laptop perfecta en solo 2 preguntas.\n\n**¿Para qué la usarás principalmente?**',
                'bot'
            );
            this.showOptions([
                { id: 'gaming', texto: '🎮 Gaming' },
                { id: 'ingenieria', texto: '🔧 Ingeniería / Diseño' },
                { id: 'oficina', texto: '💼 Oficina / Estudio' },
                { id: 'ambos', texto: '🎮🔧 Gaming + Ingeniería' }
            ]);
            this.chatState.fase = 'uso';

        } else if (fase === 'uso') {
            // Process use answer
            this.chatState.uso = mensaje.toLowerCase().includes('gaming') ? 'gaming' :
                mensaje.toLowerCase().includes('ingenieria') ? 'ingenieria' :
                    mensaje.toLowerCase().includes('ambos') ? 'ambos' : 'oficina';

            this.addMessage(
                '¡Excelente elección! 🎯\n\n**¿Qué es más importante para ti?**',
                'bot'
            );
            this.showOptions([
                { id: 'potencia', texto: '⚡ Potencia máxima' },
                { id: 'portabilidad', texto: '🪶 Portabilidad' },
                { id: 'equilibrio', texto: '⚖️ Equilibrio' }
            ]);
            this.chatState.fase = 'prioridad';

        } else if (fase === 'prioridad') {
            // Process priority and give recommendation
            this.chatState.prioridad = mensaje;
            this.chatState.fase = 'completado';

            const recommendation = this.getLocalRecommendation();

            this.addMessage(
                `🎯 **Tu laptop perfecta: ${recommendation.marca} ${recommendation.modelo}**\n\nIdeal para ${this.chatState.uso} con ${this.chatState.prioridad}.\n\n📊 **Especificaciones:**\n• Procesador: ${recommendation.cpu}\n• Gráfica: ${recommendation.gpu}\n• RAM: ${recommendation.ram}GB\n\n💰 **Precio: $${recommendation.precio}**`,
                'bot',
                recommendation
            );
        }
    }

    getLocalRecommendation() {
        // Filter products based on state
        let filtered = this.products.filter(p => p.activo !== 'no' && p.stock > 0);

        if (this.chatState.uso === 'gaming') {
            filtered = filtered.filter(p => p.gaming === 'sí');
        } else if (this.chatState.uso === 'ingenieria') {
            filtered = filtered.filter(p => p.ingenieria === 'sí');
        } else if (this.chatState.uso === 'ambos') {
            filtered = filtered.filter(p => p.gaming === 'sí' && p.ingenieria === 'sí');
        }

        if (this.chatState.prioridad === 'portabilidad') {
            filtered = filtered.filter(p => p.portabilidad === 'alta');
        } else if (this.chatState.prioridad === 'potencia') {
            filtered = filtered.filter(p => p.portabilidad !== 'alta');
        }

        // Return first match or default
        return filtered[0] || this.products[0] || {
            marca: 'Lenovo',
            modelo: 'Legion 5',
            cpu: 'Ryzen 7 5800H',
            gpu: 'RTX 3060',
            ram: 16,
            precio: 1200,
            imagen_url: '',
            link_compra: '#'
        };
    }

    addMessage(text, type, product = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;

        // Parse markdown-style bold
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        messageDiv.innerHTML = formattedText.replace(/\n/g, '<br>');

        // Add product card if recommendation
        if (product && type === 'bot') {
            const productCard = document.createElement('div');
            productCard.className = 'product-recommendation';
            productCard.innerHTML = `
                ${product.imagen_url ? `<img src="${product.imagen_url}" alt="${product.modelo}">` : ''}
                <h4>${product.marca} ${product.modelo}</h4>
                <p class="price">$${product.precio}</p>
                <a href="${product.link_compra || '#'}" class="btn-buy" target="_blank">Ver producto 👉</a>
            `;
            messageDiv.appendChild(productCard);
        }

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    showOptions(options) {
        this.chatOptions.innerHTML = '';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option';
            btn.textContent = opt.texto;
            btn.addEventListener('click', () => this.selectOption(opt.id, opt.texto));
            this.chatOptions.appendChild(btn);
        });
    }

    // ==========================================
    // Product Catalog Functions
    // ==========================================

    async loadProducts() {
        // Try to load from n8n/Google Sheets
        try {
            // For demo, use sample data
            this.products = this.getSampleProducts();
            this.renderProducts(this.products);
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = this.getSampleProducts();
            this.renderProducts(this.products);
        }
    }

    getSampleProducts() {
        return [
            {
                id: 1,
                marca: 'Lenovo',
                modelo: 'Legion 5 Pro',
                uso_principal: 'Gamer',
                gpu: 'RTX 4060',
                cpu: 'Ryzen 7 7745HX',
                ram: 16,
                almacenamiento: '512GB SSD',
                peso: 2.5,
                portabilidad: 'baja',
                gaming: 'sí',
                ingenieria: 'sí',
                oficina: 'sí',
                precio: 1299,
                imagen_url: '',
                link_compra: '#',
                stock: 5,
                activo: 'sí'
            },
            {
                id: 2,
                marca: 'ASUS',
                modelo: 'ROG Strix G16',
                uso_principal: 'Gamer',
                gpu: 'RTX 4070',
                cpu: 'Intel i9-13980HX',
                ram: 32,
                almacenamiento: '1TB SSD',
                peso: 2.7,
                portabilidad: 'baja',
                gaming: 'sí',
                ingenieria: 'sí',
                oficina: 'no',
                precio: 1899,
                imagen_url: '',
                link_compra: '#',
                stock: 3,
                activo: 'sí'
            },
            {
                id: 3,
                marca: 'Dell',
                modelo: 'XPS 15',
                uso_principal: 'Trabajo',
                gpu: 'RTX 4050',
                cpu: 'Intel i7-13700H',
                ram: 16,
                almacenamiento: '512GB SSD',
                peso: 1.8,
                portabilidad: 'alta',
                gaming: 'no',
                ingenieria: 'sí',
                oficina: 'sí',
                precio: 1499,
                imagen_url: '',
                link_compra: '#',
                stock: 8,
                activo: 'sí'
            },
            {
                id: 4,
                marca: 'HP',
                modelo: 'Pavilion 15',
                uso_principal: 'Oficina',
                gpu: 'Intel Iris Xe',
                cpu: 'Intel i5-1335U',
                ram: 8,
                almacenamiento: '256GB SSD',
                peso: 1.7,
                portabilidad: 'alta',
                gaming: 'no',
                ingenieria: 'no',
                oficina: 'sí',
                precio: 599,
                imagen_url: '',
                link_compra: '#',
                stock: 15,
                activo: 'sí'
            },
            {
                id: 5,
                marca: 'MSI',
                modelo: 'Raider GE78',
                uso_principal: 'Gamer',
                gpu: 'RTX 4080',
                cpu: 'Intel i9-13950HX',
                ram: 32,
                almacenamiento: '2TB SSD',
                peso: 3.1,
                portabilidad: 'baja',
                gaming: 'sí',
                ingenieria: 'sí',
                oficina: 'sí',
                precio: 2799,
                imagen_url: '',
                link_compra: '#',
                stock: 2,
                activo: 'sí'
            },
            {
                id: 6,
                marca: 'Apple',
                modelo: 'MacBook Pro 14"',
                uso_principal: 'Trabajo',
                gpu: 'Apple M3 Pro',
                cpu: 'Apple M3 Pro',
                ram: 18,
                almacenamiento: '512GB SSD',
                peso: 1.6,
                portabilidad: 'alta',
                gaming: 'no',
                ingenieria: 'sí',
                oficina: 'sí',
                precio: 1999,
                imagen_url: '',
                link_compra: '#',
                stock: 10,
                activo: 'sí'
            }
        ];
    }

    renderProducts(products) {
        this.productsGrid.innerHTML = '';

        products.forEach(product => {
            const card = this.createProductCard(product);
            this.productsGrid.appendChild(card);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.gaming = product.gaming;
        card.dataset.ingenieria = product.ingenieria;
        card.dataset.oficina = product.oficina;

        const tags = [];
        if (product.gaming === 'sí') tags.push('🎮');
        if (product.ingenieria === 'sí') tags.push('🔧');
        if (product.oficina === 'sí') tags.push('💼');

        card.innerHTML = `
            <div class="product-image">
                ${product.imagen_url ?
                `<img src="${product.imagen_url}" alt="${product.modelo}">` :
                '💻'}
                <div class="product-tags">
                    ${tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="product-info">
                <span class="product-brand">${product.marca}</span>
                <h3 class="product-name">${product.modelo}</h3>
                <div class="product-specs">
                    <span class="spec-badge">${product.cpu}</span>
                    <span class="spec-badge">${product.gpu}</span>
                    <span class="spec-badge">${product.ram}GB RAM</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.precio}</span>
                    <a href="${product.link_compra || '#'}" class="product-btn">Ver más</a>
                </div>
            </div>
        `;

        return card;
    }

    filterProducts(filter, btn) {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter products
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const matches = card.dataset[filter] === 'sí';
                card.style.display = matches ? 'block' : 'none';
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.smartChoice = new SmartChoiceApp();
});
