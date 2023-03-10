import { OrderProduct } from "../models/orderProduct.model";
import { BaseRepository } from "./base.repo";

class OrderProductRepository extends BaseRepository<OrderProduct> {}

export const orderProductRepo = new OrderProductRepository(OrderProduct);
