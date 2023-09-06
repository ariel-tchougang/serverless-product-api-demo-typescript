// src/domain/ports/in/Queries.ts

import { Product } from "../../models/Product";

export interface FindProductByIdQuery {
    execute(id: string): Promise<Product>;
}

export interface GetAllProductsQuery {
    execute(): Promise<Product[]>;
}
