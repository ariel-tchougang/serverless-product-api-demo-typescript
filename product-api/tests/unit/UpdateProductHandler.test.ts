// tests/unit/UpdateProductHandler.test.ts

import { productApiHandlerWrapper } from '../../src/adapters/in/handlers/productApiHandlerWrapper';
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

import { updateProductEvent } from "./domain/mocks/ports/in/update-product-event";
import { UpdateProductService } from '../../src/domain/services/UpdateProductService';
import { AlwaysUpdateProductPort, UndefinedUpdateProductPort, ErrorOnUpdateProductPort } from './domain/mocks/ports/out/UpdateProductPort';
import { Product } from '../../src/domain/models/Product';
import { findProductByIdEvent } from './domain/mocks/ports/in/find-product-by-id-event';

describe("UpdateProduct through productApiHandler", () => {

  const alwaysUpdateProductService = new UpdateProductService(new AlwaysUpdateProductPort());
  jest.spyOn(alwaysUpdateProductService, 'execute');

  const undefinedUpdateProductService = new UpdateProductService(new UndefinedUpdateProductPort());
  jest.spyOn(undefinedUpdateProductService, 'execute');

  const errorOnUpdateProductService = new UpdateProductService(new ErrorOnUpdateProductPort());
  jest.spyOn(errorOnUpdateProductService, 'execute');

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

  test("should return statusCode 400 if product id is missing", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateProductEvent));
    event.pathParameters = null;
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

  test("should return statusCode 400 if event body is missing", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateProductEvent));
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

  test("should update product name and return status 200", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, alwaysUpdateProductService, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(alwaysUpdateProductService.execute).toBeCalledTimes(1);

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(200);
    expect(result?.body).toBeDefined();

    if (result?.body) {
      const product = JSON.parse(result.body) as Product;
      const payload = JSON.parse(event.body as string);
      expect(product).toBeDefined();
      expect(product?.id).toBe(event.pathParameters?.id);
      expect(product?.name).toBe(payload?.name);
    }
  });

  test("should return statusCode 404 when product ID doesn't exist", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, undefinedUpdateProductService, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(undefinedUpdateProductService.execute).toBeCalledTimes(1);

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(404);    
  });

  test("should return statusCode 500 when delete operation fails", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(updateProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, errorOnUpdateProductService, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(errorOnUpdateProductService.execute).toBeCalledTimes(1);

    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(500);
  });
});

