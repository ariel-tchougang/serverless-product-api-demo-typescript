// src/domain/ports/in/UpdateProductService.ts

import { UpdateProductPort } from "../../domain/ports/out/Persistence";
import { UpdateProductUseCase } from "../../domain/ports/in/UseCases";
import { ProductNotFoundException } from "../../domain/exceptions/ProductNotFoundException";
import { UpdateProductServiceException } from "../exceptions/ServiceExceptions";
import { Product } from "../models/Product";

export class UpdateProductService implements UpdateProductUseCase {
    constructor(private readonly updateProductPort: UpdateProductPort) {}
  
    execute(id: string, product: Product): void {

      let result;
      
      try {
        result = this.updateProductPort.update(id, product);
      } catch (error) {
        const e = error as Error;
        throw new UpdateProductServiceException(`${e.name}: ${e.message}`);
      }

      if (result === undefined) {
        throw new ProductNotFoundException("Product not found with given ID: " + id);
      }
    }
}
