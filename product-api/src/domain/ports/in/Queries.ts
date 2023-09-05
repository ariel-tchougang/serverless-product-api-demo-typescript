// src/domain/ports/in/Queries.ts

import { Product } from "../../models/Product";

export interface FindProductByIdQuery {
    execute(id: string): Product | undefined;
}

export interface GetAllProductsQuery {
    execute(): Product[] ;
}
