import { ProductDTO, QueryDTO } from "@app/data/models";
import { productRepo } from "@app/data/repositories/product.repo";
import { Request } from "express";

class ProductService {
  async createProduct(product: ProductDTO, req: Request) {
    product["organizationId"] = req["user"].organizationId;
    return await productRepo.create(product);
  }

  async getProductById(id: string, attributes?: any) {
    return (await productRepo.findById(id, attributes))?.toJSON();
  }

  async getProducts(query: QueryDTO) {
    return await productRepo.all({ where: { ...query } });
  }

  async deleteProduct(id: string) {
    return await productRepo.deleteRow(id);
  }

  async updateProduct(id: string, product: ProductDTO) {
    return await productRepo.updateRows(id, product);
  }
}

export const products = new ProductService();
