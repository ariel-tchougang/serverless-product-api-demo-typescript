// src/domain/ports/in/UseCases.ts

import { Product } from "../../models/Product";

export interface CreateNewProductUseCase {
    execute(product: Product): Promise<Product>;
}

export interface UpdateProductUseCase {  
    execute(id: string, product: Product): Promise<void>;
}

export interface DeleteProductUseCase {
    execute(id: string): Promise<void>;
}
