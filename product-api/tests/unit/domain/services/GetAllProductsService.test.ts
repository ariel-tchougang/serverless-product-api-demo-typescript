// tests/unit/domain/services/GetAllProductsService.test.ts

import { AlwaysGetAllProductsPort, EmptyGetAllProductsPort, UndefinedGetAllProductsPort, ErrorOnGetAllProductsPort } from "../mocks/ports/out/GetAllProductsPort";
import { GetAllProductsService } from "../../../../src/domain/services/GetAllProductsService";
import { GetAllProductsServiceException } from "../../../../src/domain/exceptions/ServiceExceptions"

describe("GetAllProductsService", () => {
  const alwaysGetAllProductsPort = new AlwaysGetAllProductsPort();
  jest.spyOn(alwaysGetAllProductsPort, 'findAll');

  const emptyGetAllProductsPort = new EmptyGetAllProductsPort();
  jest.spyOn(emptyGetAllProductsPort, 'findAll');

  const undefinedGetAllProductsPort = new UndefinedGetAllProductsPort();
  jest.spyOn(undefinedGetAllProductsPort, 'findAll');

  const errorOnGetAllProductsPort = new ErrorOnGetAllProductsPort();
  jest.spyOn(errorOnGetAllProductsPort, 'findAll');

  const alwaysGetAllProductsService = new GetAllProductsService(alwaysGetAllProductsPort);
  const emptyGetAllProductsService = new GetAllProductsService(emptyGetAllProductsPort);
  const undefinedGetAllProductsService = new GetAllProductsService(undefinedGetAllProductsPort);
  const errorOnGetAllProductsService = new GetAllProductsService(errorOnGetAllProductsPort);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return product list", () => {
    const products = alwaysGetAllProductsService.execute();
    expect(products).toBeDefined();
    expect(products.length).toBe(1);      
    expect(alwaysGetAllProductsPort.findAll).toBeCalledTimes(1);
  });

  test("should return empty list when there are no products in the store", () => {
    const products = emptyGetAllProductsService.execute();
    expect(products).toBeDefined();
    expect(products.length).toBe(0); 
    expect(emptyGetAllProductsPort.findAll).toBeCalledTimes(1);
  });

  test("should return empty list when product list is set to 'undefined'", () => {
    const products = undefinedGetAllProductsService.execute();
    expect(products).toBeDefined();
    expect(products.length).toBe(0); 
    expect(undefinedGetAllProductsPort.findAll).toBeCalledTimes(1);
  });

  test("should throw GetAllProductsServiceException when findAll operation fails", () => {
    expect(() => {
      errorOnGetAllProductsService.execute();
    }).toThrow(GetAllProductsServiceException);    
    expect(errorOnGetAllProductsPort.findAll).toBeCalledTimes(1);
  });
});
