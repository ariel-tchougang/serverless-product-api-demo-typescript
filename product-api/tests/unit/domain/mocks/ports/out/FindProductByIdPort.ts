// tests/unit/domain/mocks/ports/out/FindProductByIdPort.ts

import { Product } from "../../../../../../src/domain/models/Product";
import { FindProductByIdPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysFindProductByIdPort implements FindProductByIdPort {
  async findById(id: string): Promise<Product | undefined> {
    return { id: "someId", name: "someName" };
  }
}

export class NeverFindProductByIdPort implements FindProductByIdPort {
  async findById(id: string): Promise<Product | undefined> {
   return undefined;
  }
}

export class ErrorOnFindProductByIdPort implements FindProductByIdPort {
  async findById(id: string): Promise<Product | undefined> {
    return Promise.reject("Unexpected error on calling findById");
  }
}
