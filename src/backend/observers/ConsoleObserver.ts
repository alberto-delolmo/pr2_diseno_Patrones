import type { Order } from "../models/Order";
import type { Observer } from "./Observer";

export const consoleObserver: Observer = {
  update: (order: Order) => {
    console.log(`Pedido enviado a ${order.email} ➜ ${order.getPrice().toFixed(2)}€`)
  }
};
