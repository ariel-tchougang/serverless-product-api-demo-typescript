// tests/unit/domain/services/DeleteProductService.test.ts

import { jest, test, expect, describe, beforeEach, } from "@jest/globals";
import { AlwaysOkDeleteProductPort, ErrorOnDeleteProductPort } from "../mocks/ports/out/DeleteProductPort";
import { DeleteProductService } from "../../../../src/domain/services/DeleteProductService";
import { DeleteProductServiceException } from "../../../../src/domain/exceptions/ServiceExceptions";

describe("DeleteProductService", () => {
  const alwaysOkDeleteProductPort = new AlwaysOkDeleteProductPort();
  jest.spyOn(alwaysOkDeleteProductPort, 'delete');

  const errorOnDeleteProductPort = new ErrorOnDeleteProductPort();
  jest.spyOn(errorOnDeleteProductPort, 'delete');

  const alwaysOkDeleteProductService = new DeleteProductService(alwaysOkDeleteProductPort);
  const errorOnDeleteProductService = new DeleteProductService(errorOnDeleteProductPort);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should not throw an error when everything is ok", async () => {
    await expect(async () => {
      await alwaysOkDeleteProductService.execute("someId");
    }).not.toThrow();      
    expect(alwaysOkDeleteProductPort.delete).toBeCalledTimes(1);
  });

  test("should throw DeleteProductServiceException when the delete operation fails", async () => {
    await expect(async () => {
      await errorOnDeleteProductService.execute("someId");
    }).rejects.toThrow(DeleteProductServiceException);
    expect(errorOnDeleteProductPort.delete).toBeCalledTimes(1);
  });
});