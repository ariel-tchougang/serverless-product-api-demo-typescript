// tests/unit/domain/services/FindProductByIdService.test.ts

import { AlwaysFindProductByIdPort, NeverFindProductByIdPort, ErrorOnFindProductByIdPort } from "../mocks/ports/out/FindProductByIdPort";
import { FindProductByIdService } from "../../../../src/domain/services/FindProductByIdService";
import { ProductNotFoundException } from "../../../../src/domain/exceptions/ProductNotFoundException";
import { FindProductByIdServiceException } from "../../../../src/domain/exceptions/ServiceExceptions"

describe("FindProductByIdService", () => {
  const alwaysFindProductByIdPort = new AlwaysFindProductByIdPort();
  jest.spyOn(alwaysFindProductByIdPort, 'findById');

  const neverFindProductByIdPort = new NeverFindProductByIdPort();
  jest.spyOn(neverFindProductByIdPort, 'findById');

  const errorOnFindProductByIdPort = new ErrorOnFindProductByIdPort();
  jest.spyOn(errorOnFindProductByIdPort, 'findById');

  const alwaysFindProductByIdService = new FindProductByIdService(alwaysFindProductByIdPort);
  const neverFindProductByIdService = new FindProductByIdService(neverFindProductByIdPort);
  const errorOnFindProductByIdService = new FindProductByIdService(errorOnFindProductByIdPort);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return product when product ID exists", () => {
    const product = alwaysFindProductByIdService.execute("someId");
    expect(product).toBeDefined();
    expect(product?.id).toBe("someId");      
    expect(alwaysFindProductByIdPort.findById).toBeCalledTimes(1);
  });

  test("should throw ProductNotFoundException when product ID doesn't exist", () => {
    expect(() => {
      neverFindProductByIdService.execute("someId");
    }).toThrow(ProductNotFoundException);
    expect(neverFindProductByIdPort.findById).toBeCalledTimes(1);
  });

  test("should throw FindProductByIdServiceException when findById operation fails", () => {
    expect(() => {
      errorOnFindProductByIdService.execute("someId");
    }).toThrow(FindProductByIdServiceException);    
    expect(errorOnFindProductByIdPort.findById).toBeCalledTimes(1);
  });
});
