import Papa from 'papaparse';

// ⚠️ IMPORTANTE: Todas las credenciales deben estar en el archivo .env
// No hardcodear valores sensibles aquí - este archivo se sube a GitHub
export const CONFIG = {
    // Webhook de N8N
    N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || '',

    // Contraseña del Admin (solo para desarrollo, en producción usar .env)
    ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || '',

    // Google Sheets
    GOOGLE_SHEET_CSV_URL: import.meta.env.VITE_GOOGLE_SHEET_CSV_URL || '',
    GOOGLE_SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || ''
};

export const fetchProductsFromSheet = async () => {
    try {
        console.log('📥 Fetching CSV from:', CONFIG.GOOGLE_SHEET_CSV_URL);

        const timestamp = new Date().getTime();
        const response = await fetch(`${CONFIG.GOOGLE_SHEET_CSV_URL}&t=${timestamp}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const csvText = await response.text();
        console.log('📄 CSV Preview (primeros 300 caracteres):', csvText.substring(0, 300));

        // Verificar que no sea HTML
        if (csvText.trim().toLowerCase().startsWith('<!doctype') ||
            csvText.includes('<html') ||
            csvText.includes('<body')) {
            throw new Error('🔒 Error: Recibimos HTML en lugar de CSV. Verifica que la hoja esté publicada correctamente.');
        }

        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    console.log(`✅ Total filas parseadas: ${results.data.length}`);

                    if (results.data.length > 0) {
                        console.log('📦 Primera fila (ejemplo):', results.data[0]);
                    }

                    // Devolver todos los datos crudos para que el contexto los procese
                    const allRows = results.data;

                    console.log(`✅ Total filas obtenidas: ${allRows.length}`);

                    if (allRows.length > 0) {
                        console.log('📦 Primera fila (ejemplo):', allRows[0]);
                    }

                    resolve(allRows);
                },
                error: (error: Error) => {
                    console.error('❌ Papa Parse Error:', error);
                    reject(new Error(`Error al parsear CSV: ${error.message}`));
                }
            });
        });
    } catch (error) {
        console.error('💥 Error en fetchProductsFromSheet:', error);
        throw error;
    }
};