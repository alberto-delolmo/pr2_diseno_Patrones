import type { Order } from "../models/Order";


export const taxOrder = (order: Order, tax: number): Order => {

    return {
        ...order,
        descripcion: order.descripcion + `Impuesto: ${tax}%\n`,
        getPrice: () => order.getPrice() * (1 + tax / 100),
    };
};