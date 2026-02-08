// ============================================
// CÓDIGO CORREGIDO PARA NODO "Recomendar"
// Copia este código completo al nodo en n8n
// ============================================

const allItems = $input.all();

console.log('📊 Total items recibidos:', allItems.length);

// El Merge "combineByPosition" mezcla el estado (Input 1) con el primer producto (Input 2)
// Así que el item[0] tiene AMBOS: estado + primer producto
const primerItem = allItems[0];

if (!primerItem || !primerItem.json) {
    console.error('❌ No hay items');
    return {
        json: {
            success: false,
            mensaje: '❌ Error: No se pudo recuperar tu información. Por favor, intenta de nuevo.',
            estado: null,
            tipo_respuesta: 'error',
            producto: null
        }
    };
}

// Obtener el estado (puede estar en .estado o directamente en .json si el merge lo aplanó)
const estado = primerItem.json.estado || {
    session_id: primerItem.json.session_id,
    fase: primerItem.json.fase,
    uso: primerItem.json.uso,
    prioridad: primerItem.json.prioridad
};

console.log('🎯 Estado cargado:', JSON.stringify(estado));

// Validar campos del estado
if (!estado.uso || !estado.prioridad) {
    console.error('❌ Estado incompleto:', estado);
    return {
        json: {
            success: false,
            mensaje: '❌ Error: Información incompleta. Por favor, intenta de nuevo.',
            estado: null,
            tipo_respuesta: 'error',
            producto: null
        }
    };
}

// ============================================
// OBTENER PRODUCTOS
// El primer item tiene estado + primer producto mezclados
// Los demás items son productos puros
// ============================================
let productos = [];

// Verificar si el primer item también tiene datos de producto
if (primerItem.json.id && primerItem.json.marca && primerItem.json.modelo) {
    productos.push({ json: primerItem.json });
    console.log('✅ Primer producto encontrado en item 0:', primerItem.json.marca, primerItem.json.modelo);
}

// Agregar productos del resto de items
for (let i = 1; i < allItems.length; i++) {
    if (allItems[i].json && allItems[i].json.marca) {
        productos.push(allItems[i]);
    }
}

console.log('📦 Total productos:', productos.length);

const uso = estado.uso;
const prioridad = estado.prioridad;

console.log(`🔎 Filtrando por: uso=${uso}, prioridad=${prioridad}`);

// ============================================
// FUNCIÓN HELPER para comparar "sí" y "si"
// ============================================
function esSi(valor) {
    const v = String(valor || '').toLowerCase().trim();
    return v === 'si' || v === 'sí' || v === 'yes' || v === '1' || v === 'true';
}

// ============================================
// FILTRAR PRODUCTOS ACTIVOS CON STOCK
// ============================================
let filtrados = productos.filter(p => {
    const activo = esSi(p.json.activo);
    const stock = parseInt(p.json.stock) || 0;
    return activo && stock > 0;
});

console.log('📦 Productos activos con stock:', filtrados.length);

// ============================================
// FILTRAR POR USO
// ============================================
let filtradosPorUso = [];

if (uso === 'gaming') {
    filtradosPorUso = filtrados.filter(p => esSi(p.json.gaming));
} else if (uso === 'ingenieria') {
    filtradosPorUso = filtrados.filter(p => esSi(p.json.ingenieria));
} else if (uso === 'ambos') {
    filtradosPorUso = filtrados.filter(p => esSi(p.json.gaming) && esSi(p.json.ingenieria));
} else { // oficina
    filtradosPorUso = filtrados.filter(p => esSi(p.json.oficina));
}

console.log(`📦 Productos filtrados por uso (${uso}):`, filtradosPorUso.length);

// Si no hay productos para ese uso, usar TODOS los productos activos
// (es mejor mostrar algo que nada)
if (filtradosPorUso.length === 0) {
    console.warn('⚠️ No hay productos para ese uso, usando todos los activos');
    filtradosPorUso = filtrados;
}

// Si aún no hay productos, error
if (filtradosPorUso.length === 0) {
    return {
        json: {
            success: false,
            mensaje: 'Lo siento, no encontré una laptop perfecta para ti. 😔\n\n¿Quieres que te muestre todas las opciones disponibles?',
            estado: {
                session_id: estado.session_id,
                fase: 'completado',
                uso: uso,
                prioridad: prioridad
            },
            tipo_respuesta: 'error',
            producto: null
        }
    };
}

// ============================================
// ORDENAR SEGÚN PRIORIDAD
// ============================================
if (prioridad === 'potencia') {
    // Ordenar por precio descendente (más caro = más potente generalmente)
    filtradosPorUso.sort((a, b) => {
        const precioA = parseFloat(a.json.precio) || 0;
        const precioB = parseFloat(b.json.precio) || 0;
        return precioB - precioA;
    });
    console.log('⚡ Ordenado por potencia (precio descendente)');

} else if (prioridad === 'portabilidad') {
    // Ordenar por portabilidad (alta > media > baja) y luego por peso
    filtradosPorUso.sort((a, b) => {
        const portMap = { 'alta': 3, 'media': 2, 'baja': 1 };
        const portA = portMap[String(a.json.portabilidad || 'media').toLowerCase()] || 2;
        const portB = portMap[String(b.json.portabilidad || 'media').toLowerCase()] || 2;

        if (portB !== portA) return portB - portA;

        const pesoA = parseFloat(a.json.peso) || 999;
        const pesoB = parseFloat(b.json.peso) || 999;
        return pesoA - pesoB;
    });
    console.log('🪶 Ordenado por portabilidad y peso');

} else { // equilibrio
    // Balance: RAM + Precio moderado + Portabilidad
    filtradosPorUso.sort((a, b) => {
        const ramA = parseInt(a.json.ram) || 8;
        const ramB = parseInt(b.json.ram) || 8;

        const precioA = parseFloat(a.json.precio) || 0;
        const precioB = parseFloat(b.json.precio) || 0;

        const portMap = { 'alta': 3, 'media': 2, 'baja': 1 };
        const portA = portMap[String(a.json.portabilidad || 'media').toLowerCase()] || 2;
        const portB = portMap[String(b.json.portabilidad || 'media').toLowerCase()] || 2;

        const scoreA = (ramA / 32) * 0.4 + (portA / 3) * 0.3 + (1 - precioA / 2000) * 0.3;
        const scoreB = (ramB / 32) * 0.4 + (portB / 3) * 0.3 + (1 - precioB / 2000) * 0.3;

        return scoreB - scoreA;
    });
    console.log('⚖️ Ordenado por equilibrio');
}

// ============================================
// RETORNAR RECOMENDACIÓN
// ============================================
const rec = filtradosPorUso[0];
const p = rec.json;

console.log('✅ Producto seleccionado:', p.marca, p.modelo);

const mensajeBienvenida = {
    gaming: '🎮 ¡Perfecta para gaming!',
    ingenieria: '🔧 ¡Ideal para ingeniería y diseño!',
    oficina: '💼 ¡Perfecta para oficina!',
    ambos: '🎮🔧 ¡Lo mejor de ambos mundos!'
};

return {
    json: {
        success: true,
        mensaje: `${mensajeBienvenida[uso] || '✨ ¡Excelente opción!'}\n\n**${p.marca} ${p.modelo}**\n\nBasado en tus preferencias, esta es tu mejor opción.`,
        estado: {
            session_id: estado.session_id,
            fase: 'completado',
            uso: uso,
            prioridad: prioridad
        },
        tipo_respuesta: 'recomendacion',
        producto: {
            id: p.id,
            marca: p.marca,
            modelo: p.modelo,
            cpu: p.cpu,
            gpu: p.gpu,
            ram: `${p.ram}GB`,
            almacenamiento: p.almacenamiento,
            peso: `${p.peso}kg`,
            precio: `$${p.precio}`,
            imagen_url: p.imagen_url,
            link_compra: p.link_compra,
            puntos_clave: [
                `Procesador ${p.cpu}`,
                `GPU ${p.gpu}`,
                `${p.ram}GB RAM`,
                `Peso: ${p.peso}kg`
            ]
        }
    }
};
