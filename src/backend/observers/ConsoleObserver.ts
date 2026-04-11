import type { Order } from "../models/Order";
import type { Observer } from "./Observer";

export const consoleObserver: Observer = {
  update: (order: Order) => {
    const emailText = order.email ? ` - Email: ${order.email}` : "Anónimo";
    const now = Date();
    console.log(`${now.toLocaleString()} - ${emailText}\n${order.descripcion}`);
  }
};
