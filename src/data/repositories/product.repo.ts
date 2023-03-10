import { Product } from "@app/data/models";
import { BaseRepository } from "./base.repo";

class ProductRepo extends BaseRepository<Product> {}

export const productRepo = new ProductRepo(Product);
