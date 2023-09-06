// tests/unit/domain/services/CreateNewProductService.test.ts

import { jest, test, expect, describe, beforeEach, } from "@jest/globals";
import { AlwaysCreateNewProductPort, ErrorOnCreateNewProductPort } from "../mocks/ports/out/CreateNewProductPort";
import { CreateNewProductService } from "../../../../src/domain/services/CreateNewProductService";
import { CreateNewProductServiceException } from "../../../../src/domain/exceptions/ServiceExceptions"

describe("CreateNewProductService", () => {
  const alwaysCreateNewProductPort = new AlwaysCreateNewProductPort();
  jest.spyOn(alwaysCreateNewProductPort, 'create');

  const errorOnCreateNewProductPort = new ErrorOnCreateNewProductPort();
  jest.spyOn(errorOnCreateNewProductPort, 'create');

  const alwaysCreateNewProductService = new CreateNewProductService(alwaysCreateNewProductPort);
  const errorOnCreateNewProductService = new CreateNewProductService(errorOnCreateNewProductPort);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new product when create operation succeeds", async () => {
    const product = await alwaysCreateNewProductService.execute({ id: "", name: "someName",});
    expect(product).toBeDefined();
    expect(product?.id).toBe("someId"); 
    expect(product?.name).toBe("someName"); 
    expect(alwaysCreateNewProductPort.create).toBeCalledTimes(1);
  });

  test("should throw CreateNewProductServiceException when create operation fails", async () => {
    await expect(async () => {
      await errorOnCreateNewProductService.execute({ id: "", name: "someName",});
    }).rejects.toThrow(CreateNewProductServiceException);    
    expect(errorOnCreateNewProductPort.create).toBeCalledTimes(1);
  });
});
