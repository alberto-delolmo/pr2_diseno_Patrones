import type { Observer } from "./observers/Observer";
import type { Order } from "./models/Order";

export const createOrderService = () => {
  const observers: Observer[] = [];

  return {
    addObserver: (observer: Observer) => {
      observers.push(observer);
    },


    confirmOrder: (order: Order) => {
      observers.forEach(o => o.update(order));
    }
  };
};