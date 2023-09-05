// src/domain/ports/out/Persistence.ts
import { Product } from "../../models/Product";

export interface FindProductByIdPort {
    findById(id: string): Product | undefined;
}
  
export interface GetAllProductsPort {
    findAll(): Product[] | undefined;
}

export interface CreateNewProductPort {
    create(product: Product): Product;
}

export interface UpdateProductPort {
    update(id: string, product: Product): Product | undefined;
}

export interface DeleteProductPort {
    delete(id: string): void;
}
