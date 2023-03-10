import { OrderDTO, QueryDTO } from "@app/data/models";
import { OrderRepo } from "@app/data/repositories/order.repo";
import { Request } from "express";

class OrderService {
  async createOrder(order: OrderDTO, req: Request) {
    order["organizationId"] = req["user"].organizationId;

    return await OrderRepo.create(order);
  }

  async getOrderById(id: string) {
    return (await OrderRepo.findById(id))?.toJSON();
  }

  async getOrders(query: QueryDTO) {
    return await OrderRepo.all(query);
  }

  async deleteOrder(id: string) {
    return await OrderRepo.deleteRow(id);
  }

  async updateOrder(id: string, order: OrderDTO) {
    return await OrderRepo.updateRows(id, order);
  }
}

export const Orders = new OrderService();
