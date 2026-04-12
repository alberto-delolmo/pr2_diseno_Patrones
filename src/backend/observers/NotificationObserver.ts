// backend/observers/NotificationObserver.ts
import type { Order } from "../models/Order";
import type { Observer } from "./Observer";

export const notificationObserver =
  (email: string, showPopup: (message: string) => void): Observer => {
    return {
      update: (order: Order) => {
        showPopup(`Pedido enviado a ${email}\n\n ➜ ${order.getPrice().toFixed(2)}€`);
      }
    };
  };