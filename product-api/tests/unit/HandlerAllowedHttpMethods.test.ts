// tests/unit/HandlerAllowedHttpMethods.test.ts

import { productApiHandlerWrapper } from '../../src/adapters/in/handlers/productApiHandlerWrapper';
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

import { findProductByIdEvent } from "./domain/mocks/ports/in/find-product-by-id-event";

describe("Allowed http methods through productApiHandler", () => {

  const mockFindProductById = {} as any;
  const mockGetAllProductsQuery = {} as any;
  const mockCreateNewProductUseCase = {} as any;
  const mockUpdateProductUseCase = {} as any;
  const mockDeleteProductUseCase = {} as any;
  const mockContext: Context = {} as any;
  const mockCallback = jest.fn() as jest.MockedFunction<APIGatewayProxyCallback>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return statusCode 405 when http method is not in (GET, PUT, POST, DELETE)", async () => {
    let event: APIGatewayProxyEvent = JSON.parse(JSON.stringify(findProductByIdEvent));
    event.httpMethod = 'someMethod';
    let handler = productApiHandlerWrapper(mockFindProductById, mockGetAllProductsQuery, 
      mockCreateNewProductUseCase, mockUpdateProductUseCase, mockDeleteProductUseCase);
    await handler(event, mockContext, mockCallback);
    expect(mockCallback).toBeCalled();
    expect(mockCallback).toHaveBeenCalled();
    const result = mockCallback.mock.calls[0][1];
    expect(result).toBeDefined();
    expect(result?.statusCode).toBe(405);
    expect(result?.body).toBeDefined();
  });
});