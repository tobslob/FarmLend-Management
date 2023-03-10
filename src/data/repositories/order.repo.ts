import { Order } from "@app/data/models";
import { BaseRepository } from "./base.repo";

class OrderRepository extends BaseRepository<Order> {}

export const OrderRepo = new OrderRepository(Order);
