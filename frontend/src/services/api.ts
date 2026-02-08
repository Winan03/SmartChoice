import { CONFIG } from '../config';

interface ChatPayload {
    session_id: string;
    mensaje: string;
    estado: {
        fase: string;
        uso: string | null;
        prioridad: string | null;
    };
}

interface ChatResponse {
    mensaje: string;
    opciones?: { id: string; texto: string }[];
    producto?: any;
    estado?: {
        fase: string;
        uso: string | null;
        prioridad: string | null;
    };
}

/**
 * Send message to n8n webhook with retry for cold start
 * Render free tier services sleep after 15min inactivity
 */
export const sendMessageToN8N = async (payload: ChatPayload, retries = 2): Promise<ChatResponse> => {
    const url = CONFIG.N8N_WEBHOOK_URL;

    console.log('🔗 N8N Request:', {
        url,
        payload: JSON.stringify(payload).substring(0, 200)
    });

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for cold start

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log('📡 N8N Response Status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ N8N Error Response:', errorText);
                throw new Error(`N8N Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ N8N Success:', JSON.stringify(data).substring(0, 200));
            return data;

        } catch (error: any) {
            const isTimeout = error.name === 'AbortError';
            const isNetworkError = error.message?.includes('fetch') || error.message?.includes('network');

            console.error(`❌ N8N Attempt ${attempt}/${retries + 1} failed:`, {
                error: error.message,
                isTimeout,
                isNetworkError
            });

            // Don't retry on final attempt
            if (attempt === retries + 1) {
                // Provide more helpful error messages
                if (isTimeout) {
                    throw new Error('El servidor n8n está iniciando. Por favor espera unos segundos y vuelve a intentar.');
                }
                if (isNetworkError) {
                    throw new Error('No se puede conectar con el servidor. Verifica tu conexión a internet.');
                }
                throw error;
            }

            // Wait before retry (exponential backoff)
            const waitTime = attempt * 2000;
            console.log(`⏳ Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    throw new Error('Error inesperado en la conexión con n8n');
};

/**
 * Test n8n connection - useful for debugging
 */
export const testN8NConnection = async (): Promise<{ success: boolean; message: string; url: string }> => {
    const url = CONFIG.N8N_WEBHOOK_URL;

    try {
        console.log('🧪 Testing N8N connection to:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: 'test_connection',
                mensaje: '',
                estado: { fase: '', uso: null, prioridad: null }
            })
        });

        if (response.ok) {
            return { success: true, message: 'Conexión exitosa', url };
        } else {
            return { success: false, message: `Error ${response.status}: ${response.statusText}`, url };
        }
    } catch (error: any) {
        return { success: false, message: error.message, url };
    }
};
