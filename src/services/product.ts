import { ProductDTO, QueryDTO } from "@app/data/models";
import { productRepo } from "@app/data/repositories/product.repo";
import { Request } from "express";

class ProductService {
  async createProduct(product: ProductDTO, req: Request) {
    product["organizationId"] = req["user"].organizationId
    return await productRepo.create({ ...product });
  }

  async getProductById(id: string) {
    return (await productRepo.findById(id))?.toJSON();
  }

  async getProducts(query: QueryDTO) {
    return await productRepo.all(query);
  }

  async deleteProduct(id: string) {
    return await productRepo.deleteRow(id);
  }

  async updateProduct(id: string, product: ProductDTO) {
    return await productRepo.updateRows(id, product);
  }
}

export const products = new ProductService();
