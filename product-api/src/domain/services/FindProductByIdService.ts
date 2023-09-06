// src/domain/ports/in/FindProductByIdService.ts

import { FindProductByIdPort } from "../../domain/ports/out/Persistence";
import { FindProductByIdQuery } from "../../domain/ports/in/Queries";
import { ProductNotFoundException } from "../../domain/exceptions/ProductNotFoundException";
import { FindProductByIdServiceException } from "../exceptions/ServiceExceptions";
import { Product } from "../models/Product";

export class FindProductByIdService implements FindProductByIdQuery {
    constructor(private readonly findProductByIdPort: FindProductByIdPort) {}
  
    async execute(id: string): Promise<Product> {

      let product;
      
      try {
        product = await this.findProductByIdPort.findById(id);
      } catch (error) {
        const e = error as Error;
        throw new FindProductByIdServiceException(`${e.name}: ${e.message}`);
      }

      if (product === undefined) {
        throw new ProductNotFoundException("Product not found with given ID: " + id);
      }

      return product;
    }
}
