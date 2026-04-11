import type { Order } from "../models/Order";


export const surchargeOrder = (order: Order, surcharge: number): Order => {

    return {
        ...order,
        descripcion: order.descripcion + `Recargo: ${surcharge}€\n`,
        getPrice: () => order.getPrice() + surcharge,
    };
};