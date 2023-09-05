// tests/unit/domain/mocks/ports/out/UpdateProductPort.ts

import { Product } from "../../../../../../src/domain/models/Product";
import { UpdateProductPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysUpdateProductPort implements UpdateProductPort {
  update(id: string, product: Product): Product | undefined {
    return { id: id, name: product.name };
  }
}

export class UndefinedUpdateProductPort implements UpdateProductPort {
  update(id: string, product: Product): Product | undefined {
    return undefined;
  }
}

export class ErrorOnUpdateProductPort implements UpdateProductPort {
  update(id: string, product: Product): Product | undefined {
    throw new Error("Unexpected error on calling update");
  }
}
