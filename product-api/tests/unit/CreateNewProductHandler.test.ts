// tests/unit/CreateNewProductHandler.test.ts

import { jest, test, expect, describe, beforeEach, } from "@jest/globals";
import { productApiHandlerWrapper } from '../../src/adapters/in/handlers/productApiHandlerWrapper';
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

import { createNewProductEvent } from './domain/mocks/ports/in/create-new-product-event';
import { CreateNewProductService } from '../../src/domain/services/CreateNewProductService';
import { AlwaysCreateNewProductPort, ErrorOnCreateNewProductPort } from './domain/mocks/ports/out/CreateNewProductPort';
import { Product } from '../../src/domain/models/Product';

describe("CreateNewProduct through productApiHandler", () => {

  const alwaysCreateNewProductService = new CreateNewProductService(new AlwaysCreateNewProductPort());
  jest.spyOn(alwaysCreateNewProductService, 'execute');

  const errorOnCreateNewProductService = new CreateNewProductService(new ErrorOnCreateNewProductPort());
  jest.spyOn(errorOnCreateNewProductService, 'execute');

  const mockFindProductByIdQuery = {} as any;
  const mockGetAllProductsQuery = {} as any;
  const mockCreateNewProductUseCase = {} as any;
  const mockDeleteProductUseCase = {} as any;
  const mockUpdateProductUseCase = {} as any;
  const mockContext: Context = {} as any;
  const mockCallback = jest.fn() as jest.MockedFunction<APIGatewayProxyCallback>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return statusCode 400 if event body is missing", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(createNewProductEvent));
    event.body = null;
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockUpdateProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(400);
  });

  test("should create a new product and return statusCode 201", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(createNewProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
        alwaysCreateNewProductService, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(alwaysCreateNewProductService.execute).toBeCalledTimes(1);

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(201);
    expect(result?.body).toBeDefined();

    if (result?.body) {
      const product = JSON.parse(result.body) as Product;
      const payload = JSON.parse(event.body as string);
      expect(product).toBeDefined();
      expect(product?.id).toBe('someId');
      expect(product?.name).toBe(payload?.name);
    }
  });

  test("should return statusCode 500 when delete operation fails", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(createNewProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      errorOnCreateNewProductService, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(errorOnCreateNewProductService.execute).toBeCalledTimes(1);

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(500);
  });
});

