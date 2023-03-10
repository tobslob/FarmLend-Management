import db from "@app/data/database/connect";
import { OrderDTO, OrderProduct, QueryDTO } from "@app/data/models";
import { orderRepo } from "@app/data/repositories/order.repo";
import { orderProductRepo } from "@app/data/repositories/orderProduct.repo";
import { productRepo } from "@app/data/repositories/product.repo";
import { Request } from "express";

class OrderService {
  async createOrder(order: OrderDTO, req: Request) {
    order["organizationId"] = req["user"].organizationId;
    let createdOrder;
    let orderProduct: OrderProduct[] = [];

    await db.sequelize.transaction(async t => {
      createdOrder = (await orderRepo.create(order, { ...t })).toJSON();

      for (const product of order.products) {
        const getProduct = (await productRepo.findById(product.productId, t)).toJSON();

        const orderProd = await orderProductRepo.create(
          {
            orderId: createdOrder.id,
            // @ts-ignore
            productId: getProduct?.id,
            volume: product.volume,
            // @ts-ignore
            pricePerUnit: getProduct?.pricePerUnit
          },
          t
        );

        orderProduct.push(orderProd);

        // @ts-ignore
        const volume = getProduct?.volume - product.volume;

        await productRepo.updateRows(
          product.productId,
          {
            volume
          },
          { transaction: t }
        );
      }
    });

    return { ...createdOrder, orderProduct };
  }

  async getOrderById(id: string, t?: any) {
    const order =  await orderRepo.findById(id, t);
    return order
  }

  async getOrders(query: QueryDTO) {
    return await orderRepo.all(query);
  }

  async deleteOrder(id: string) {
    return await orderRepo.deleteRow(id);
  }

  async updateOrder(id: string, order: OrderDTO) {
    return await orderRepo.updateRows(id, order);
  }
}

export const Orders = new OrderService();
