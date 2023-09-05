// src/domain/adapters/out/ProductRepository.ts

import { Product } from "../../domain/models/Product";
import { FindProductByIdPort, GetAllProductsPort, CreateNewProductPort, UpdateProductPort, DeleteProductPort } from "../../domain/ports/out/Persistence";

export abstract class ProductRepository implements GetAllProductsPort, FindProductByIdPort, CreateNewProductPort, UpdateProductPort, DeleteProductPort {
  abstract findAll(): Product[];
  abstract findById(id: string): Product | undefined;
  abstract create(product: Product): Product;
  abstract update(id: string, product: Product): Product | undefined;
  abstract delete(id: string): void;
}
