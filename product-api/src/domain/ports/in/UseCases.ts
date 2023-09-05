// src/domain/ports/in/UseCases.ts

import { Product } from "../../models/Product";

export interface CreateNewProductUseCase {
    execute(product: Product): Product;
}

export interface UpdateProductUseCase {  
    execute(id: string, product: Product): void;
}

export interface DeleteProductUseCase {
    execute(id: string): void;
}
