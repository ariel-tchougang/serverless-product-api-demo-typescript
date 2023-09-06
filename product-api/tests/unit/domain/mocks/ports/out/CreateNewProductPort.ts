// tests/unit/domain/mocks/ports/out/CreateNewProductPort.ts

import { CreateNewProductPort } from "../../../../../../src/domain/ports/out/Persistence";
import { Product } from "../../../../../../src/domain/models/Product";

export class AlwaysCreateNewProductPort implements CreateNewProductPort {
    async create(product: Product): Promise<Product> {
      return { id: "someId", name: product.name };
    }
}
  
export class ErrorOnCreateNewProductPort implements CreateNewProductPort {
  async create(product: Product): Promise<Product> {
    return Promise.reject("Error on create new product");
  }
}
  
