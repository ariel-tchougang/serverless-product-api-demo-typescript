// tests/unit/domain/mocks/ports/out/FindProductByIdPort.ts

import { Product } from "../../../../../../src/domain/models/Product";
import { FindProductByIdPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysFindProductByIdPort implements FindProductByIdPort {
  findById(id: string): Product | undefined {
    return { id: "someId", name: "someName" };
  }
}

export class NeverFindProductByIdPort implements FindProductByIdPort {
  findById(id: string): Product | undefined {
    return undefined;
  }
}

export class ErrorOnFindProductByIdPort implements FindProductByIdPort {
  findById(id: string): Product | undefined {
    throw new Error("Unexpected error on calling findById");
  }
}
