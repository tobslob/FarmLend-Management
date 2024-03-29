import { ProductDTO, QueryDTO } from '@app/data/models';
import { orderProductRepo } from '@app/data/repositories/orderProduct.repo';
import { productRepo } from '@app/data/repositories/product.repo';
import { Request } from 'express';

class ProductService {
  async createProduct(product: ProductDTO, req: Request) {
    product['organizationId'] = req['user'].organizationId;
    return await productRepo.create(product);
  }

  async getProductById(id: string, attributes?: any) {
    return (await productRepo.findById(id, attributes))?.toJSON();
  }

  async getProducts(query: QueryDTO) {
    return await productRepo.all({ where: { ...query } });
  }

  async deleteProduct(id: string, req: Request) {
    const orders: any = await orderProductRepo.all({ where: { productId: id } });
    if (orders?.length != 0) {
      throw new Error("you can't delete a product with pending orders");
    }
    return await productRepo.deleteRow({ id, organizationId: req['user'].organizationId });
  }

  async updateProduct(id: string, product: ProductDTO) {
    return await productRepo.upsert(id, product);
  }
}

export const products = new ProductService();
