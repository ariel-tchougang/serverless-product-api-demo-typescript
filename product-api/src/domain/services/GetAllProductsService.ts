// src/domain/ports/in/GetAllProductsService.ts

import { GetAllProductsPort } from "../../domain/ports/out/Persistence";
import { GetAllProductsQuery } from "../../domain/ports/in/Queries";
import { GetAllProductsServiceException } from "../exceptions/ServiceExceptions";
import { Product } from "../models/Product";

export class GetAllProductsService implements GetAllProductsQuery {
    constructor(private readonly getAllProductsPort: GetAllProductsPort) {}
  
    async execute(): Promise<Product[]> {
        let products: Product[] | undefined = [];
      
        try {
            products = await this.getAllProductsPort.findAll();
        } catch (error) {
            const e = error as Error;
            throw new GetAllProductsServiceException(`${e.name}: ${e.message}`);
        }

        if (products === undefined) {
            products = [];
        }

        return products;
    }
}
