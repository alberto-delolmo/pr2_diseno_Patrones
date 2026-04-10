import type { Order } from "../models/Order";


export const discountOrder = (order: Order, discount: number): Order => {

    return {
        ...order,
        getPrice: () => order.getPrice() * (1 + discount / 100),
    };
};