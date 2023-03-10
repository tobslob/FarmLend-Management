import { OrderProduct } from "../models/orderProduct.model";
import { BaseRepository } from "./base.repo";

class OrderRepository extends BaseRepository<OrderProduct> {}

export const OrderRepo = new OrderRepository(OrderProduct);
