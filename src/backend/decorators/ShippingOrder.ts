import type { Order } from "../models/Order";


export const shippingOrder = (order: Order, extraCost: number): Order => {

    return {
        ...order,
        descripcion: order.descripcion + `Envío: ${extraCost}€\n`,
        getPrice: () => order.getPrice() + extraCost,
    };
};