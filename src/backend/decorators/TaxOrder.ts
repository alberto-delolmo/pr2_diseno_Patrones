import type { Order } from "../models/Order";


export const taxOrder = (order: Order, tax: number): Order => {

    return {
        ...order,
        getPrice: () => order.getPrice() * (1 + tax/100),
    };
};