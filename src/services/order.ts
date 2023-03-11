import db from '@app/data/database/connect';
import { OrderDTO, OrderProduct, QueryDTO } from '@app/data/models';
import { orderRepo } from '@app/data/repositories/order.repo';
import { orderProductRepo } from '@app/data/repositories/orderProduct.repo';
import { productRepo } from '@app/data/repositories/product.repo';
import { Request } from 'express';
import { Transaction } from 'sequelize/types';

class OrderService {
  async createOrder(order: OrderDTO, req: Request) {
    order['organizationId'] = req['user'].organizationId;
    let createdOrder;
    let volume: number;
    const orderProduct: OrderProduct[] = [];

    await db.sequelize.transaction(async (t) => {
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
            pricePerUnit: getProduct?.pricePerUnit,
          },
          t,
        );

        orderProduct.push(orderProd);

        // @ts-ignore
        if (prod?.volume >= product.volume) {
          // @ts-ignore
          volume = prod?.volume - product.volume;
        } else {
          throw new Error(`product with ID: ${product.productId} is sold out`);
        }

        await productRepo.upsert(
          product.productId,
          {
            volume,
          },
          { transaction: t },
        );
      }
    });

    return { ...createdOrder, orderProduct };
  }

  async getOrderById(id: string, t?: Transaction) {
    const order = await orderRepo.findById(id, {
      // attributes: ["id", "type", "organizationId"],
      where: {
        orderId: id,
      },
      include: {
        model: OrderProduct,
      },
      transaction: t,
    });
    return order;
  }

  async getOrders(query: QueryDTO, t?: Transaction) {
    return await orderRepo.all({
      where: { ...query },
      include: {
        model: OrderProduct,
      },
      transaction: t,
    });
  }

  async deleteOrder(id: string) {
    return await orderRepo.deleteRow(id);
  }

  async updateOrder(id: string, order: OrderDTO) {
    let updatedOrder;
    let volume: number;
    await db.sequelize.transaction(async (t) => {
      console.log(
        'ONE',
        await orderRepo.upsert(
          id,
          {
            type: order.type,
          },
          t,
        ),
      );

      for (const product of order.products) {
        await orderProductRepo.upsert(id, product, t);

        const prod = (await productRepo.findById(product.productId, t)).toJSON();
        // @ts-ignore
        if (prod?.volume >= product.volume) {
          // @ts-ignore
          volume = prod?.volume - product.volume;
        } else {
          throw new Error(`product with ID: ${product.productId} is sold out`);
        }
        await productRepo.upsert(
          product.productId,
          {
            volume,
          },
          t,
        );
      }

      updatedOrder = (await this.getOrderById(id, t)).toJSON();
    });

    return updatedOrder;
  }
}

export const Orders = new OrderService();
