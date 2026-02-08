// ==========================================
// SmartChoice - Admin Panel Logic
// ==========================================

class AdminPanel {
    constructor() {
        this.products = [];
        this.editingProductId = null;
        this.isAuthenticated = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.checkN8NStatus();
    }

    bindEvents() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());

        // CSV Upload
        document.getElementById('csvUpload')?.addEventListener('change', (e) => this.handleCSVUpload(e));

        // Google Sheets connection
        document.getElementById('connectSheets')?.addEventListener('click', () => this.toggleSheetsConnect());
        document.getElementById('loadSheet')?.addEventListener('click', () => this.loadFromSheets());

        // Sync button
        document.getElementById('syncBtn')?.addEventListener('click', () => this.syncToSheets());

        // Add product
        document.getElementById('addProductBtn')?.addEventListener('click', () => this.openAddModal());

        // Search
        document.getElementById('searchProducts')?.addEventListener('input', (e) => this.searchProducts(e.target.value));

        // Modal controls
        document.getElementById('closeModal')?.addEventListener('click', () => this.closeModal());
        document.getElementById('cancelEdit')?.addEventListener('click', () => this.closeModal());
        document.getElementById('productForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Close modal on background click
        document.getElementById('editModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'editModal') this.closeModal();
        });
    }

    // ==========================================
    // Authentication
    // ==========================================

    login() {
        const password = document.getElementById('passwordInput').value;
        const errorEl = document.getElementById('loginError');

        if (password === CONFIG.ADMIN_PASSWORD) {
            this.isAuthenticated = true;
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            this.loadSampleProducts();
            this.showToast('Bienvenido al panel de administración', 'success');
        } else {
            errorEl.textContent = 'Contraseña incorrecta';
            document.getElementById('passwordInput').value = '';
        }
    }

    logout() {
        this.isAuthenticated = false;
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('passwordInput').value = '';
    }

    // ==========================================
    // Product Management
    // ==========================================

    loadSampleProducts() {
        // Load sample data (in production, this would come from localStorage or API)
        this.products = [
            {
                id: 1,
                marca: 'Lenovo',
                modelo: 'Legion 5 Pro',
                cpu: 'Ryzen 7 7745HX',
                gpu: 'RTX 4060',
                ram: 16,
                almacenamiento: '512GB SSD',
                peso: 2.5,
                portabilidad: 'baja',
                gaming: 'sí',
                ingenieria: 'sí',
                oficina: 'sí',
                precio: 1299,
                imagen_url: '',
                link_compra: '',
                stock: 5,
                activo: 'sí'
            },
            {
                id: 2,
                marca: 'ASUS',
                modelo: 'ROG Strix G16',
                cpu: 'Intel i9-13980HX',
                gpu: 'RTX 4070',
                ram: 32,
                almacenamiento: '1TB SSD',
                peso: 2.7,
                portabilidad: 'baja',
                gaming: 'sí',
                ingenieria: 'sí',
                oficina: 'no',
                precio: 1899,
                imagen_url: '',
                link_compra: '',
                stock: 3,
                activo: 'sí'
            },
            {
                id: 3,
                marca: 'Dell',
                modelo: 'XPS 15',
                cpu: 'Intel i7-13700H',
                gpu: 'RTX 4050',
                ram: 16,
                almacenamiento: '512GB SSD',
                peso: 1.8,
                portabilidad: 'alta',
                gaming: 'no',
                ingenieria: 'sí',
                oficina: 'sí',
                precio: 1499,
                imagen_url: '',
                link_compra: '',
                stock: 8,
                activo: 'sí'
            }
        ];

        this.renderProducts();
    }

    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        const countEl = document.getElementById('productCount');

        if (!tbody) return;

        tbody.innerHTML = '';

        this.products.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.marca}</td>
                <td><strong>${p.modelo}</strong></td>
                <td>${p.cpu}</td>
                <td>${p.gpu}</td>
                <td>${p.ram}GB</td>
                <td>$${p.precio}</td>
                <td class="${p.gaming === 'sí' ? 'tag-yes' : 'tag-no'}">${p.gaming === 'sí' ? '✓' : '✗'}</td>
                <td class="${p.ingenieria === 'sí' ? 'tag-yes' : 'tag-no'}">${p.ingenieria === 'sí' ? '✓' : '✗'}</td>
                <td class="${p.oficina === 'sí' ? 'tag-yes' : 'tag-no'}">${p.oficina === 'sí' ? '✓' : '✗'}</td>
                <td>${p.portabilidad}</td>
                <td>${p.stock}</td>
                <td class="${p.activo === 'sí' ? 'tag-yes' : 'tag-no'}">${p.activo === 'sí' ? '✓' : '✗'}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn-icon" onclick="adminPanel.editProduct(${p.id})" title="Editar">✏️</button>
                        <button class="btn-icon delete" onclick="adminPanel.deleteProduct(${p.id})" title="Eliminar">🗑️</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });

        if (countEl) {
            countEl.textContent = `${this.products.length} productos cargados`;
        }
    }

    searchProducts(query) {
        const rows = document.querySelectorAll('#productsTableBody tr');
        const lowerQuery = query.toLowerCase();

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(lowerQuery) ? '' : 'none';
        });
    }

    // ==========================================
    // CRUD Operations
    // ==========================================

    openAddModal() {
        this.editingProductId = null;
        document.getElementById('modalTitle').textContent = 'Agregar Producto';

        // Reset form
        const form = document.getElementById('productForm');
        form.reset();

        // Set new ID
        const maxId = Math.max(...this.products.map(p => p.id), 0);
        document.getElementById('editId').value = maxId + 1;

        // Set defaults
        document.getElementById('editPortabilidad').value = 'media';
        document.getElementById('editGaming').value = 'no';
        document.getElementById('editIngenieria').value = 'no';
        document.getElementById('editOficina').value = 'sí';
        document.getElementById('editActivo').value = 'sí';

        document.getElementById('editModal').style.display = 'flex';
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;

        this.editingProductId = id;
        document.getElementById('modalTitle').textContent = 'Editar Producto';

        // Fill form
        document.getElementById('editId').value = product.id;
        document.getElementById('editMarca').value = product.marca;
        document.getElementById('editModelo').value = product.modelo;
        document.getElementById('editCpu').value = product.cpu;
        document.getElementById('editGpu').value = product.gpu;
        document.getElementById('editRam').value = product.ram;
        document.getElementById('editAlmacenamiento').value = product.almacenamiento || '';
        document.getElementById('editPeso').value = product.peso || '';
        document.getElementById('editPrecio').value = product.precio;
        document.getElementById('editStock').value = product.stock || 0;
        document.getElementById('editPortabilidad').value = product.portabilidad || 'media';
        document.getElementById('editGaming').value = product.gaming || 'no';
        document.getElementById('editIngenieria').value = product.ingenieria || 'no';
        document.getElementById('editOficina').value = product.oficina || 'no';
        document.getElementById('editActivo').value = product.activo || 'sí';
        document.getElementById('editImagenUrl').value = product.imagen_url || '';
        document.getElementById('editLinkCompra').value = product.link_compra || '';

        document.getElementById('editModal').style.display = 'flex';
    }

    saveProduct() {
        const productData = {
            id: parseInt(document.getElementById('editId').value),
            marca: document.getElementById('editMarca').value,
            modelo: document.getElementById('editModelo').value,
            cpu: document.getElementById('editCpu').value,
            gpu: document.getElementById('editGpu').value,
            ram: parseInt(document.getElementById('editRam').value) || 16,
            almacenamiento: document.getElementById('editAlmacenamiento').value || '512GB SSD',
            peso: parseFloat(document.getElementById('editPeso').value) || 2.0,
            precio: parseInt(document.getElementById('editPrecio').value),
            stock: parseInt(document.getElementById('editStock').value) || 0,
            portabilidad: document.getElementById('editPortabilidad').value,
            gaming: document.getElementById('editGaming').value,
            ingenieria: document.getElementById('editIngenieria').value,
            oficina: document.getElementById('editOficina').value,
            activo: document.getElementById('editActivo').value,
            imagen_url: document.getElementById('editImagenUrl').value,
            link_compra: document.getElementById('editLinkCompra').value
        };

        if (this.editingProductId) {
            // Update existing
            const index = this.products.findIndex(p => p.id === this.editingProductId);
            if (index !== -1) {
                this.products[index] = productData;
                this.showToast('Producto actualizado correctamente', 'success');
            }
        } else {
            // Add new
            this.products.push(productData);
            this.showToast('Producto agregado correctamente', 'success');
        }

        this.renderProducts();
        this.closeModal();
        this.saveToLocalStorage();
    }

    deleteProduct(id) {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        this.products = this.products.filter(p => p.id !== id);
        this.renderProducts();
        this.saveToLocalStorage();
        this.showToast('Producto eliminado', 'info');
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingProductId = null;
    }

    // ==========================================
    // CSV Handling
    // ==========================================

    handleCSVUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                this.parseCSV(csv);
                this.showToast(`CSV cargado: ${this.products.length} productos`, 'success');
            } catch (error) {
                console.error('Error parsing CSV:', error);
                this.showToast('Error al procesar el CSV', 'error');
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) return;

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        this.products = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            if (values.length !== headers.length) continue;

            const product = {};
            headers.forEach((header, index) => {
                let value = values[index]?.trim() || '';

                // Type conversion
                if (['id', 'ram', 'precio', 'stock'].includes(header)) {
                    value = parseInt(value) || 0;
                } else if (header === 'peso') {
                    value = parseFloat(value) || 0;
                }

                product[header] = value;
            });

            if (product.id && product.marca && product.modelo) {
                this.products.push(product);
            }
        }

        this.renderProducts();
        this.saveToLocalStorage();
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let char of line) {
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);

        return result;
    }

    // ==========================================
    // Google Sheets Integration
    // ==========================================

    toggleSheetsConnect() {
        const container = document.getElementById('sheetsConnect');
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    }

    async loadFromSheets() {
        const sheetUrl = document.getElementById('sheetUrl').value;
        const sheetName = document.getElementById('sheetTabName').value || 'SmartChoice_Productos';

        if (!sheetUrl) {
            this.showToast('Ingresa la URL del Google Sheet', 'error');
            return;
        }

        try {
            // Extract Sheet ID from URL
            const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
            if (!match) {
                this.showToast('URL de Google Sheets inválida', 'error');
                return;
            }

            const sheetId = match[1];

            // For demo, we'll simulate loading
            // In production, this would call a backend API or n8n workflow
            this.showToast('Conectando con Google Sheets...', 'info');

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update UI
            document.getElementById('sheetNameDisplay').textContent = `📊 ${sheetName}`;
            document.getElementById('sheetsStatus').textContent = 'Conectado';
            document.getElementById('sheetsStatus').className = 'status-connected';
            document.getElementById('lastSync').textContent = new Date().toLocaleString();

            // Save Sheet config
            localStorage.setItem('smartchoice_sheetId', sheetId);
            localStorage.setItem('smartchoice_sheetName', sheetName);

            this.showToast('Google Sheets conectado exitosamente', 'success');

            // In production, load actual data here

        } catch (error) {
            console.error('Error connecting to Sheets:', error);
            this.showToast('Error al conectar con Google Sheets', 'error');
        }
    }

    async syncToSheets() {
        const sheetId = localStorage.getItem('smartchoice_sheetId');

        if (!sheetId) {
            this.showToast('Primero conecta con Google Sheets', 'error');
            return;
        }

        try {
            this.showToast('Sincronizando con Google Sheets...', 'info');

            // In production, this would call n8n webhook to update the sheet
            // For now, simulate the sync
            await new Promise(resolve => setTimeout(resolve, 2000));

            document.getElementById('lastSync').textContent = new Date().toLocaleString();

            this.showToast('Sincronización completada', 'success');

        } catch (error) {
            console.error('Error syncing to Sheets:', error);
            this.showToast('Error al sincronizar', 'error');
        }
    }

    // ==========================================
    // n8n Status Check
    // ==========================================

    async checkN8NStatus() {
        const statusEl = document.getElementById('n8nStatus');
        if (!statusEl) return;

        try {
            // Try to ping the webhook
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(CONFIG.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ test: true }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                statusEl.textContent = 'Conectado';
                statusEl.className = 'status-connected';
            } else {
                statusEl.textContent = 'Error de respuesta';
                statusEl.className = 'status-error';
            }
        } catch (error) {
            statusEl.textContent = 'No disponible';
            statusEl.className = 'status-error';
        }
    }

    // ==========================================
    // Local Storage
    // ==========================================

    saveToLocalStorage() {
        localStorage.setItem('smartchoice_products', JSON.stringify(this.products));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('smartchoice_products');
        if (saved) {
            try {
                this.products = JSON.parse(saved);
                this.renderProducts();
            } catch (e) {
                console.error('Error loading from localStorage:', e);
            }
        }
    }

    // ==========================================
    // Toast Notifications
    // ==========================================

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});
