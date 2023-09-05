// tests/unit/GetAllProductsHandler.test.ts

import { productApiHandlerWrapper } from '../../src/adapters/in/handlers/productApiHandlerWrapper';
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

import { GetAllProductsService } from "../../src/domain/services/GetAllProductsService";

import { getAllProductsEvent } from "./domain/mocks/ports/in/get-all-products-event";
import { Product } from "../../src/domain/models/Product";
import { AlwaysGetAllProductsPort, EmptyGetAllProductsPort, UndefinedGetAllProductsPort, ErrorOnGetAllProductsPort } from './domain/mocks/ports/out/GetAllProductsPort';

describe("GetAllProducts through productApiHandler", () => {

  const alwaysGetAllProductsService = new GetAllProductsService(new AlwaysGetAllProductsPort());
  jest.spyOn(alwaysGetAllProductsService, 'execute');

  const emptyGetAllProductsService = new GetAllProductsService(new EmptyGetAllProductsPort());
  jest.spyOn(emptyGetAllProductsService, 'execute');

  const undefinedGetAllProductsService = new GetAllProductsService(new UndefinedGetAllProductsPort());
  jest.spyOn(undefinedGetAllProductsService, 'execute');

  const errorOnGetAllProductsService = new GetAllProductsService(new ErrorOnGetAllProductsPort());
  jest.spyOn(errorOnGetAllProductsService, 'execute');

  const mockFindProductByIdQuery = {} as any;
  const mockCreateNewProductUseCase = {} as any;
  const mockUpdateProductUseCase = {} as any;
  const mockDeleteProductUseCase = {} as any;
  const mockContext: Context = {} as any;
  const mockCallback = jest.fn() as jest.MockedFunction<APIGatewayProxyCallback>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return product list", async () => {    
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getAllProductsEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, alwaysGetAllProductsService, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(200);
    expect(result?.body).toBeDefined();

    if (result?.body) {
      const products = JSON.parse(result.body) as Product[];
      expect(products).toBeDefined();
      expect(products.length).toBe(1);
    }
    
    expect(alwaysGetAllProductsService.execute).toBeCalledTimes(1);
  });

  test("should return empty list when there are no products in the store", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getAllProductsEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, emptyGetAllProductsService, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(200);
    expect(result?.body).toBeDefined();

    if (result?.body) {
      const products = JSON.parse(result.body) as Product[];
      expect(products).toBeDefined();
      expect(products.length).toBe(0);
    }
    
    expect(emptyGetAllProductsService.execute).toBeCalledTimes(1);
  });

  test("should return empty list when product list is set to 'undefined'", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getAllProductsEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, undefinedGetAllProductsService, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(200);
    expect(result?.body).toBeDefined();

    if (result?.body) {
      const products = JSON.parse(result.body) as Product[];
      expect(products).toBeDefined();
      expect(products.length).toBe(0);
    }
    
    expect(undefinedGetAllProductsService.execute).toBeCalledTimes(1);
  });

  test("should return statusCode 500 when findAll operation fails", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(getAllProductsEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, errorOnGetAllProductsService, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(500);
    expect(result?.body).toBeDefined();    
    expect(errorOnGetAllProductsService.execute).toBeCalledTimes(1);
  });
});
