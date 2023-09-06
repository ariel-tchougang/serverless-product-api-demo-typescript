// tests/unit/domain/mocks/ports/out/GetAllProductsPort.ts

import { Product } from "../../../../../../src/domain/models/Product";
import { GetAllProductsPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysGetAllProductsPort implements GetAllProductsPort {
  async findAll(): Promise<Product[] | undefined> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [{ id: "someId", name: "someName" }];
  }
}

export class EmptyGetAllProductsPort implements GetAllProductsPort {
  async findAll(): Promise<Product[] | undefined> {
    return [];
  }
}

export class UndefinedGetAllProductsPort implements GetAllProductsPort {
  async findAll(): Promise<Product[] | undefined> {
    return undefined;
  }
}

export class ErrorOnGetAllProductsPort implements GetAllProductsPort {
  async findAll(): Promise<Product[] | undefined> {
    return Promise.reject("Unexpected error on calling findAll");
  }
}
