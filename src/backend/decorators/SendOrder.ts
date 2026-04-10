import type { Order } from "../models/Order";


export const sendOrder = (order: Order, extraCost: number): Order => {

    return {
        ...order,
        getPrice: () => order.getPrice() + extraCost,
    };
};