import db from '@app/data/database/connect';
import { OrderDTO, OrderProduct, Product, QueryDTO } from '@app/data/models';
import { orderRepo } from '@app/data/repositories/order.repo';
import { orderProductRepo } from '@app/data/repositories/orderProduct.repo';
import { productRepo } from '@app/data/repositories/product.repo';
import { NotFoundError } from '@app/data/util';
import { Request } from 'express';
import { Transaction } from 'sequelize/types';

class OrderService {
  async createOrder(order: OrderDTO, req: Request) {
    order['organizationId'] = req['user']?.organizationId;
    let createdOrder;
    let volume: number;

    await db.sequelize.transaction(async (t) => {
      createdOrder = (await orderRepo.create(order, { ...t }))?.toJSON();

      for (const product of order.products) {
        const getProduct = (await productRepo.findById(product.productId, t))?.toJSON();

        if (!getProduct) {
          throw new NotFoundError(`product with ID: ${product.productId} is not found`);
        }

        await orderProductRepo.create(
          {
            orderId: createdOrder.id,
            // @ts-ignore
            productId: getProduct?.id,
            volume: product.volume,
            organizationId: order['organizationId'],
            // @ts-ignore
            pricePerUnit: getProduct?.pricePerUnit,
          },
          t,
        );

        // @ts-ignore
        if (getProduct?.volume >= product.volume) {
          // @ts-ignore
          volume = getProduct?.volume - product.volume;
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

    return createdOrder;
  }

  async getOrderById(id: string, t?: Transaction) {
    const order = await orderRepo.findById(id, {
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

  async getOrders(query: QueryDTO, req: Request, t?: Transaction) {
    return await orderRepo.all({
      where: { ...query, organizationId: req['user']?.organizationId },
      include: [
        {
          model: OrderProduct,
        },
        {
          model: Product,
          attributes: ['id', 'category', 'variety'],
          through: {
            attributes: [],
          },
        },
      ],
      transaction: t,
    });
  }

  async deleteOrder(id: string, req: Request) {
    await db.sequelize.transaction(async (t) => {
      await orderProductRepo.deleteRow({ orderId: id }, t);
      return await orderRepo.deleteRow({ id, organizationId: req['user']?.organizationId }, t);
    });

    return 1;
  }

  async updateOrder(id: string, order: OrderDTO) {
    let updatedOrder;
    let volume: number;
    await db.sequelize.transaction(async (t) => {
      const updateOrder = await orderRepo.upsert(
        id,
        {
          type: order.type,
        },
        t,
      );

      if (!updateOrder?.toJSON()) {
        throw new NotFoundError('Order not found');
      }

      for (const product of order.products) {
        await orderProductRepo.update(id, product, t);

        const prod = (await productRepo.findById(product.productId, t))?.toJSON();

        if (!prod) {
          throw new NotFoundError('Product not found');
        }
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

      updatedOrder = (await this.getOrderById(id, t))?.toJSON();
    });

    return updatedOrder;
  }
}

export const Orders = new OrderService();
