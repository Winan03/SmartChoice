// ============================================
// CÓDIGO CORREGIDO PARA NODO "Procesar Uso"
// Copia este código al nodo "Procesar Uso" en n8n
// ============================================
// FIX: Normaliza tildes para detectar correctamente "ingeniería" → "ingenieria"
// ============================================

const body = $input.first().json.body;
const mensaje = (body.mensaje || '').toLowerCase();
const estadoActual = body.estado || {};

// Función para normalizar texto (quitar tildes)
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')                     // Descompone caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '')      // Elimina los acentos
        .replace(/[^\w\s]/g, '');             // Elimina caracteres especiales
}

const mensajeNormalizado = normalizar(mensaje);
console.log('📝 Mensaje original:', mensaje);
console.log('📝 Mensaje normalizado:', mensajeNormalizado);

let uso = 'oficina'; // default

// Detectar "Gaming + Ingeniería" o "ambos"
if (
    (mensajeNormalizado.includes('gaming') && mensajeNormalizado.includes('ingenieria')) ||
    (mensajeNormalizado.includes('gaming') && mensajeNormalizado.includes('diseno')) ||
    mensajeNormalizado.includes('ambos')
) {
    uso = 'ambos';
    console.log('✅ Detectado: ambos (gaming + ingenieria)');
}
// Solo gaming
else if (
    mensajeNormalizado.includes('gaming') ||
    mensajeNormalizado.includes('juegos') ||
    mensajeNormalizado.includes('gamer')
) {
    uso = 'gaming';
    console.log('✅ Detectado: gaming');
}
// Solo ingeniería
else if (
    mensajeNormalizado.includes('ingenieria') ||
    mensajeNormalizado.includes('diseno') ||
    mensajeNormalizado.includes('arquitectura')
) {
    uso = 'ingenieria';
    console.log('✅ Detectado: ingenieria');
}
// Oficina
else if (
    mensajeNormalizado.includes('oficina') ||
    mensajeNormalizado.includes('estudio') ||
    mensajeNormalizado.includes('trabajo')
) {
    uso = 'oficina';
    console.log('✅ Detectado: oficina');
}

console.log('🎯 Uso final:', uso);

return {
    json: {
        success: true,
        mensaje: "¡Excelente elección! 🎯\n\n**¿Qué es más importante para ti?**",
        opciones: [
            { id: "potencia", texto: "⚡ Potencia máxima", descripcion: "El mejor rendimiento" },
            { id: "portabilidad", texto: "🪶 Portabilidad", descripcion: "Liviana y fácil de llevar" },
            { id: "equilibrio", texto: "⚖️ Equilibrio", descripcion: "Un balance entre ambos" }
        ],
        estado: {
            session_id: estadoActual.session_id || body.session_id,
            fase: "prioridad",
            uso: uso,
            prioridad: null
        },
        tipo_respuesta: "opciones"
    }
};
