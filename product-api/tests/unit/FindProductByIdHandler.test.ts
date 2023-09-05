// tests/unit/FindProductByIdHandler.test.ts

import { productApiHandlerWrapper } from '../../src/adapters/in/handlers/productApiHandlerWrapper';
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

import { AlwaysFindProductByIdPort, NeverFindProductByIdPort, ErrorOnFindProductByIdPort } from "./domain/mocks/ports/out/FindProductByIdPort";
import { FindProductByIdService } from "../../src/domain/services/FindProductByIdService";

import { findProductByIdEvent } from "./domain/mocks/ports/in/find-product-by-id-event";
import { Product } from "../../src/domain/models/Product";

describe("FindProductById through productApiHandler", () => {
  const alwaysFindProductByIdService = new FindProductByIdService(new AlwaysFindProductByIdPort());
  jest.spyOn(alwaysFindProductByIdService, 'execute');

  const neverFindProductByIdService = new FindProductByIdService(new NeverFindProductByIdPort());
  jest.spyOn(neverFindProductByIdService, 'execute');

  const errorOnFindProductByIdService = new FindProductByIdService(new ErrorOnFindProductByIdPort());
  jest.spyOn(errorOnFindProductByIdService, 'execute');

  const mockGetAllProductsQuery = {} as any;
  const mockCreateNewProductUseCase = {} as any;
  const mockUpdateProductUseCase = {} as any;
  const mockDeleteProductUseCase = {} as any;
  const mockContext: Context = {} as any;
  const mockCallback = jest.fn() as jest.MockedFunction<APIGatewayProxyCallback>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return product when product ID exists", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(findProductByIdEvent));
    let handler = productApiHandlerWrapper(alwaysFindProductByIdService, mockGetAllProductsQuery, 
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
      const product = JSON.parse(result.body) as Product;
      expect(product).toBeDefined();
      expect(product?.id).toBe("someId");  
    }
    
    expect(alwaysFindProductByIdService.execute).toBeCalledTimes(1);
  });

  test("should return statusCode 404 when product ID doesn't exist", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(findProductByIdEvent));
    let handler = productApiHandlerWrapper(neverFindProductByIdService, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(404);    
    expect(neverFindProductByIdService.execute).toBeCalledTimes(1);
  });

  test("should return statusCode 500 when findById operation fails", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(findProductByIdEvent));
    let handler = productApiHandlerWrapper(errorOnFindProductByIdService, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBeDefined();
    expect(result?.statusCode).toBe(500);    
    expect(errorOnFindProductByIdService.execute).toBeCalledTimes(1);
  });
});
