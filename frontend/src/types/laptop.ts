export interface Laptop {
    id: number;
    marca: string;
    modelo: string;
    cpu: string;
    gpu: string;
    ram: number;
    almacenamiento: string;
    peso: number;
    portabilidad: 'alta' | 'media' | 'baja';
    gaming: boolean;
    ingenieria: boolean;
    oficina: boolean;
    precio: number;
    imagen_url: string;
    link_compra: string;
    stock: number;
    activo: boolean;
}

export interface ChatMessage {
    id: string;
    type: 'bot' | 'user';
    content: string;
    options?: ChatOption[];
    producto?: Laptop;
}

export interface ChatOption {
    id: string;
    texto: string;
    emoji?: string;
}

export interface ChatState {
    session_id: string;
    fase: string;
    uso: string | null;
    prioridad: string | null;
}
