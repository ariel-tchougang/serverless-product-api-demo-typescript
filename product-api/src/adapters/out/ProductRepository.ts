// src/domain/adapters/out/ProductRepository.ts

import { Product } from "../../domain/models/Product";
import { FindProductByIdPort, GetAllProductsPort, CreateNewProductPort, UpdateProductPort, DeleteProductPort } from "../../domain/ports/out/Persistence";

export abstract class ProductRepository implements GetAllProductsPort, FindProductByIdPort, CreateNewProductPort, UpdateProductPort, DeleteProductPort {
  abstract findAll(): Promise<Product[] | undefined>;
  abstract findById(id: string): Promise<Product | undefined>;
  abstract create(product: Product): Promise<Product>;
  abstract update(id: string, product: Product): Promise<Product | undefined>;
  abstract delete(id: string): Promise<void>;
}
