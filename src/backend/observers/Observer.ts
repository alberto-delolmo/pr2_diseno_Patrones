import type { Order } from "../models/Order";


export interface Observer {
  update(order: Order): void;
}