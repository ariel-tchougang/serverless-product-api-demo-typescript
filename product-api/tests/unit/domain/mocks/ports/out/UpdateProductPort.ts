// tests/unit/domain/mocks/ports/out/UpdateProductPort.ts

import { Product } from "../../../../../../src/domain/models/Product";
import { UpdateProductPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysUpdateProductPort implements UpdateProductPort {
  async update(id: string, product: Product): Promise<Product | undefined> {
    return { id: id, name: product.name };
  }
}

export class UndefinedUpdateProductPort implements UpdateProductPort {
  async update(id: string, product: Product): Promise<Product | undefined> {
    return undefined;
  }
}

export class ErrorOnUpdateProductPort implements UpdateProductPort {
  async update(id: string, product: Product): Promise<Product | undefined> {
    return Promise.reject("Unexpected error on calling update");
  }
}
