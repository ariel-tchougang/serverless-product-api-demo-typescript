// tests/unit/domain/mocks/ports/out/CreateNewProductPort.ts

import { CreateNewProductPort } from "../../../../../../src/domain/ports/out/Persistence";
import { Product } from "../../../../../../src/domain/models/Product";

export class AlwaysCreateNewProductPort implements CreateNewProductPort {
    create(product: Product): Product { 
      return { id: "someId", name: product.name };
    }
}
  
export class ErrorOnCreateNewProductPort implements CreateNewProductPort {
  create(product: Product): Product {
    throw new Error("Unexpected error on create new product");
  }
}
  
