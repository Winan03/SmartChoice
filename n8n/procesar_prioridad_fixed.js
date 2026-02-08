// ============================================
// CÓDIGO CORREGIDO PARA NODO "Procesar Prioridad"
// Copia este código al nodo "Procesar Prioridad" en n8n
// ============================================
// FIX: Normaliza tildes para detectar correctamente opciones
// ============================================

const body = $input.first().json.body;
const mensaje = (body.mensaje || '').toLowerCase();
const estadoActual = body.estado || {};

// Función para normalizar texto (quitar tildes)
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '');
}

const mensajeNormalizado = normalizar(mensaje);
console.log('📝 Mensaje original:', mensaje);
console.log('📝 Mensaje normalizado:', mensajeNormalizado);

let prioridad = 'equilibrio'; // default

if (
    mensajeNormalizado.includes('potencia') ||
    mensajeNormalizado.includes('maxim') ||
    mensajeNormalizado.includes('rendimiento') ||
    mensajeNormalizado.includes('poder')
) {
    prioridad = 'potencia';
    console.log('✅ Detectado: potencia');
} else if (
    mensajeNormalizado.includes('portab') ||
    mensajeNormalizado.includes('liviana') ||
    mensajeNormalizado.includes('ligera') ||
    mensajeNormalizado.includes('portatil')
) {
    prioridad = 'portabilidad';
    console.log('✅ Detectado: portabilidad');
} else if (
    mensajeNormalizado.includes('equili') ||
    mensajeNormalizado.includes('balance')
) {
    prioridad = 'equilibrio';
    console.log('✅ Detectado: equilibrio');
}

console.log('🎯 Prioridad final:', prioridad);
console.log('🎯 Uso guardado:', estadoActual.uso);

// Crear el estado completo
const estadoCompleto = {
    session_id: estadoActual.session_id,
    fase: "recomendar",
    uso: estadoActual.uso,
    prioridad: prioridad
};

// Retornar el estado para que fluya a través de los nodos
return {
    json: {
        estado: estadoCompleto
    }
};
