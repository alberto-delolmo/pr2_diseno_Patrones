import type { Order } from "../models/Order";


export const discountOrder = (order: Order, discount: number): Order => {

    return {
        ...order,
        descripcion: order.descripcion + `Descuento: ${discount}%\n`,
        getPrice: () => order.getPrice() * (1 - discount / 100),
    };
};