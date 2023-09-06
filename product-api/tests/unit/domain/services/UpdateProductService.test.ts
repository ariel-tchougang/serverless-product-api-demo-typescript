// tests/unit/domain/services/UpdateProductService.test.ts

import { jest, test, expect, describe, beforeEach, } from "@jest/globals";
import { AlwaysUpdateProductPort,  UndefinedUpdateProductPort, ErrorOnUpdateProductPort } from "../mocks/ports/out/UpdateProductPort";
import { UpdateProductService } from "../../../../src/domain/services/UpdateProductService";
import { ProductNotFoundException } from "../../../../src/domain/exceptions/ProductNotFoundException";
import { UpdateProductServiceException } from "../../../../src/domain/exceptions/ServiceExceptions"

describe("UpdateProductService", () => {
  const alwaysUpdateProductPort = new AlwaysUpdateProductPort();
  jest.spyOn(alwaysUpdateProductPort, 'update');

  const undefinedUpdateProductPort = new UndefinedUpdateProductPort();
  jest.spyOn(undefinedUpdateProductPort, 'update');

  const errorOnUpdateProductPort = new ErrorOnUpdateProductPort();
  jest.spyOn(errorOnUpdateProductPort, 'update');

  const alwaysUpdateProductService = new UpdateProductService(alwaysUpdateProductPort);
  const undefinedUpdateProductService = new UpdateProductService(undefinedUpdateProductPort);
  const errorOnUpdateProductService = new UpdateProductService(errorOnUpdateProductPort);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return product list", async () => {
    await expect(async () => {
      await alwaysUpdateProductService.execute("someId", { id: "someId", name: "someName",});
    }).not.toThrow();      
    expect(alwaysUpdateProductPort.update).toBeCalledTimes(1);
  });

  test("should throw ProductNotFoundException when product ID doesn't exist", async () => {
    await expect(async () => {
      await undefinedUpdateProductService.execute("someId", { id: "someId", name: "someName",});
    }).rejects.toThrow(ProductNotFoundException);
    expect(undefinedUpdateProductPort.update).toBeCalledTimes(1);
  });

  test("should throw UpdateProductServiceException when update operation fails", async () => {
    await expect(async () => {
      await errorOnUpdateProductService.execute("someId", { id: "someId", name: "someName",});
    }).rejects.toThrow(UpdateProductServiceException);    
    expect(errorOnUpdateProductPort.update).toBeCalledTimes(1);
  });
});
