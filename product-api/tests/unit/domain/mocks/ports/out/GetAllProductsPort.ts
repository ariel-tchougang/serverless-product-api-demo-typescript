// tests/unit/domain/mocks/ports/out/GetAllProductsPort.ts

import { Product } from "../../../../../../src/domain/models/Product";
import { GetAllProductsPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysGetAllProductsPort implements GetAllProductsPort {
  findAll(): Product[] | undefined {
    return [{ id: "someId", name: "someName" }];
  }
}

export class EmptyGetAllProductsPort implements GetAllProductsPort {
  findAll(): Product[] | undefined {
    return [];
  }
}

export class UndefinedGetAllProductsPort implements GetAllProductsPort {
  findAll(): Product[] | undefined {
    return undefined;
  }
}

export class ErrorOnGetAllProductsPort implements GetAllProductsPort {
  findAll(): Product[] | undefined {
    throw new Error("Unexpected error on calling findAll");
  }
}
