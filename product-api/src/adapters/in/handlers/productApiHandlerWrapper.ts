// src/domain/adapters/in/handlers/productApiHandlerWrapper.ts

import { APIGatewayProxyEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { Product } from '../../../domain/models/Product';
import { FindProductByIdQuery, GetAllProductsQuery } from '../../../domain/ports/in/Queries';
import { CreateNewProductUseCase, UpdateProductUseCase, DeleteProductUseCase } from '../../../domain/ports/in/UseCases';
import { ProductNotFoundException } from '../../../domain/exceptions/ProductNotFoundException';

export const productApiHandlerWrapper = (
  findProductByIdQuery: FindProductByIdQuery,
  getAllProductsQuery: GetAllProductsQuery,
  createNewProductUseCase: CreateNewProductUseCase,
  updateProductUseCase: UpdateProductUseCase,
  deleteProductUseCase: DeleteProductUseCase
) => {
  return async (event: APIGatewayProxyEvent, context: Context, callback: APIGatewayProxyCallback): Promise<void> => {
    const method = event.httpMethod.toUpperCase();
    const pathParameters = event.pathParameters;
    const body = event.body ? JSON.parse(event.body) : {};
    
    try {
        switch (method) {
          case 'GET':
            if (pathParameters && pathParameters.id) {
              callback(null, await handleFindProductById(findProductByIdQuery, pathParameters.id));
            } else {
              callback(null, await handleGetAllProducts(getAllProductsQuery));
            }
            break;
          case 'POST':
            callback(null, await handleCreateNewProduct(createNewProductUseCase, body));
            break;
          case 'PUT':
            if (pathParameters && pathParameters.id) {
              callback(null, await handleUpdateProduct(updateProductUseCase, pathParameters.id, body));
            } else {
              callback(null, handleBadRequestException('Bad request - missing product id'));
            }           
            break;
          case 'DELETE':
            if (pathParameters && pathParameters.id) {
              callback(null, await handleDeleteProduct(deleteProductUseCase, pathParameters.id));
            } else {                
              callback(null, handleBadRequestException('Bad request - missing product id'));
            }
            break;
          default:
            callback(null, {
              statusCode: 405,
              body: JSON.stringify({ message: 'Method not allowed' }),
            });
        }
      } catch (error) {
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      }
  };
};

const handleFindProductById = async (findProductByIdQuery: FindProductByIdQuery, id: string): Promise<any> => {
    try {
        const product = await findProductByIdQuery.execute(id);
        return {
            statusCode: 200,
            body: JSON.stringify(product)
        }
    } catch (error) {
        if (error instanceof ProductNotFoundException) {
            return handleProductNotFoundException(error);
        } else {
            const e = error as Error;
            return handleServiceExceptions(e);
        }
    }
}

const handleGetAllProducts = async (getAllProductsQuery: GetAllProductsQuery): Promise<any> => {
    try {
        const products = await getAllProductsQuery.execute();
        return {
            statusCode: 200,
            body: JSON.stringify(products)
        }
    } catch (error) {
        const e = error as Error;
        return handleServiceExceptions(e);
    }
}

const handleDeleteProduct = async (deleteProductUseCase: DeleteProductUseCase, id: string): Promise<any> => {
    try {
        await deleteProductUseCase.execute(id);
        return {
            statusCode: 200,
            body: JSON.stringify({})
        }
    } catch (error) {
        const e = error as Error;
        return handleServiceExceptions(e);
    }
}

const handleUpdateProduct = async (updateProductUseCase: UpdateProductUseCase, id: string, body: any): Promise<any> => {
    try {
        if (!body || !body.name) {
            return handleBadRequestException('Bad request - missing product name');
        }

        const product: Product = { id: '', name: body.name };
        await updateProductUseCase.execute(id, product);
        return {
            statusCode: 200,
            body: JSON.stringify({ id: id, name: body.name })
        }
    } catch (error) {
        if (error instanceof ProductNotFoundException) {
            return handleProductNotFoundException(error);
        } else {
            const e = error as Error;
            return handleServiceExceptions(e);
        }
    }
}

const handleCreateNewProduct = async (createNewProductUseCase: CreateNewProductUseCase, body: any): Promise<any> => {
    try {
        if (!body || !body.name) {
            return handleBadRequestException('Bad request - missing product name');
        }

        const product: Product = { id: '', name: body.name };
        const newProduct = await createNewProductUseCase.execute(product);
        return {
            statusCode: 201,
            body: JSON.stringify(newProduct)
        }
    } catch (error) {
        const e = error as Error;
        return handleServiceExceptions(e);
    }
}

const handleProductNotFoundException = (error: ProductNotFoundException): any => {
    return {
        statusCode: 404,
        body: JSON.stringify({ message: error.message })
    }
}

const handleServiceExceptions = (error: Error): any => {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message })
    }
}

const handleBadRequestException = (message: string): any => {
    return {
        statusCode: 400,
        body: JSON.stringify({ message: message })
    }
}

