import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchProductsFromSheet } from '../config';
import type { Laptop } from '../types/laptop';

interface ProductContextType {
    products: Laptop[];
    allProducts: Laptop[];
    loading: boolean;
    error: string | null;
    refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Laptop[]>([]);
    const [allProducts, setAllProducts] = useState<Laptop[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchProductsFromSheet() as any[];
            console.log('🔄 ProductContext: Datos crudos recibidos:', data?.length, 'filas');
            if (data && data.length > 0) {
                console.log('🔄 ProductContext: Primera fila cruda:', JSON.stringify(data[0]));
            }

            const cleanBoolean = (val: any) => {
                const s = String(val || '').toLowerCase().trim();
                return s === 'si' || s === 'sí' || s === 'true' || s === 'yes' || s === '1';
            };

            // Transform CSV data to Laptop interface
            const transformedProducts: Laptop[] = data.map((item, index) => ({
                id: Number(item.id) || index + 1,
                marca: item.marca,
                modelo: item.modelo,
                cpu: item.cpu,
                gpu: item.gpu,
                ram: Number(item.ram),
                almacenamiento: item.almacenamiento,
                peso: Number(item.peso),
                portabilidad: item.portabilidad as 'alta' | 'media' | 'baja',
                gaming: cleanBoolean(item.gaming),
                ingenieria: cleanBoolean(item.ingenieria),
                oficina: cleanBoolean(item.oficina),
                precio: Number(item.precio),
                imagen_url: item.imagen_url,
                link_compra: item.link_compra,
                stock: Number(item.stock),
                activo: cleanBoolean(item.activo)
            }));

            console.log('🔄 ProductContext: Productos transformados:', transformedProducts.length);
            if (transformedProducts.length > 0) {
                console.log('🔄 ProductContext: Primer producto transformado:', JSON.stringify(transformedProducts[0]));
            }

            setAllProducts(transformedProducts);
            const activeProducts = transformedProducts.filter(p => p.activo && p.stock > 0);
            console.log('🔄 ProductContext: Productos activos con stock:', activeProducts.length);
            setProducts(activeProducts);
        } catch (err) {
            setError('Error al cargar productos. Por favor intente más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <ProductContext.Provider value={{ products, allProducts, loading, error, refreshProducts: loadProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
