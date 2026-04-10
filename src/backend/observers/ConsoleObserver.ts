import type { Order } from "../models/Order";
import type { Observer } from "./Observer";

export const consoleObserver: Observer = {
  update: (order: Order) => {
    console.log(`Pedido confirmado: ${order.getPrice()}€`);
  }
};
