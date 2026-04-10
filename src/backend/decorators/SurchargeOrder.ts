import type { Order } from "../models/Order";


export const surchargeOrder = (order: Order, surcharge: number): Order => {

    return {
        ...order,
        getPrice: () => order.getPrice() + surcharge,
    };
};