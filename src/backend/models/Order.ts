export interface Order {
    id: number;
    basePrice: number;
    email?: string;
    descripcion: string;
    getPrice: () => number;
}

export const createOrder = (basePrice: number): Order => {
    return {
        id: Math.floor(Math.random() * 1000),
        basePrice,
        descripcion: `Precio base: ${basePrice}€\n`,
        getPrice: () => basePrice
    };
}