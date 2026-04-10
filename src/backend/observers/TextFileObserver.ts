import type { Order } from "../models/Order";

export const textFileObserver = {
  update: async (order: Order) => {
    await fetch("http://localhost:3001/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: order.getPrice(),
        email: order.email || "",
      }),
    });
  },
};