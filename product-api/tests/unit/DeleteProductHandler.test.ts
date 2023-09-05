// tests/unit/DeleteProductHandler.test.ts

import { productApiHandlerWrapper } from '../../src/adapters/in/handlers/productApiHandlerWrapper';
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

import { deleteProductEvent } from "./domain/mocks/ports/in/delete-product-event";
import { DeleteProductService } from '../../src/domain/services/DeleteProductService';
import { AlwaysOkDeleteProductPort, ErrorOnDeleteProductPort } from './domain/mocks/ports/out/DeleteProductPort';

describe("DeleteProduct through productApiHandler", () => {

  const alwaysOkDeleteProductService = new DeleteProductService(new AlwaysOkDeleteProductPort());
  jest.spyOn(alwaysOkDeleteProductService, 'execute');

  const errorOnDeleteProductService = new DeleteProductService(new ErrorOnDeleteProductPort());
  jest.spyOn(errorOnDeleteProductService, 'execute');

  const mockFindProductByIdQuery = {} as any;
  const mockGetAllProductsQuery = {} as any;
  const mockCreateNewProductUseCase = {} as any;
  const mockUpdateProductUseCase = {} as any;
  const mockDeleteProductUseCase = {} as any;
  const mockContext: Context = {} as any;
  const mockCallback = jest.fn() as jest.MockedFunction<APIGatewayProxyCallback>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return statusCode 400 if product id is missing", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(deleteProductEvent));
    event.pathParameters = null;
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(400);
  });

  test("should return product when product ID exists", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(deleteProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, alwaysOkDeleteProductService);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(200);    
    expect(alwaysOkDeleteProductService.execute).toBeCalledTimes(1);
  });

  test("should return statusCode 500 when delete operation fails", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(deleteProductEvent));
    let handler = productApiHandlerWrapper(mockFindProductByIdQuery, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, errorOnDeleteProductService);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(500);    
    expect(errorOnDeleteProductService.execute).toBeCalledTimes(1);
  });
});

