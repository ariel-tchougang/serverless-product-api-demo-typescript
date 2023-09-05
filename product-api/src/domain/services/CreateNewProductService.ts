// src/domain/ports/in/CreateNewProductService.ts

import { CreateNewProductPort } from "../../domain/ports/out/Persistence";
import { CreateNewProductUseCase } from "../../domain/ports/in/UseCases";
import { CreateNewProductServiceException } from "../exceptions/ServiceExceptions";
import { v4 as uuidv4 } from 'uuid';
import { Product } from "../models/Product";

export class CreateNewProductService implements CreateNewProductUseCase {
  constructor(private readonly createNewProductPort: CreateNewProductPort) {}
  
  execute(product: Product): Product {

    try {
      return this.createNewProductPort.create({id: uuidv4(), "name": product.name});
    } catch (error) {
      const e = error as Error;
      throw new CreateNewProductServiceException(`${e.name}: ${e.message}`);
    }
  }
}
