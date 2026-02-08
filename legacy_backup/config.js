// SmartChoice Configuration
const CONFIG = {
    // URL del webhook de n8n (actualiza con tu URL de Render)
    N8N_WEBHOOK_URL: 'https://mi-n8n-ez7x.onrender.com/webhook/smartchoice',
    
    // ID del Google Sheet (para el panel admin)
    GOOGLE_SHEET_ID: 'TU_SHEET_ID_AQUI',
    
    // Nombre de la hoja de productos
    SHEET_NAME: 'SmartChoice_Productos',
    
    // Contraseña del panel admin (cambiar en producción)
    ADMIN_PASSWORD: 'smartchoice2026',
    
    // Configuración del chat
    CHAT: {
        TYPING_DELAY: 800, // ms para simular escritura
        MAX_HISTORY: 50    // máximo de mensajes en historial
    }
};

// Exportar para uso en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
