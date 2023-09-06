// src/domain/ports/out/Persistence.ts
import { Product } from "../../models/Product";

export interface FindProductByIdPort {
    findById(id: string): Promise<Product | undefined>;
}
  
export interface GetAllProductsPort {
    findAll(): Promise<Product[] | undefined>;
}

export interface CreateNewProductPort {
    create(product: Product): Promise<Product>;
}

export interface UpdateProductPort {
    update(id: string, product: Product): Promise<Product | undefined>;
}

export interface DeleteProductPort {
    delete(id: string): Promise<void>;
}
