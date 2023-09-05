// src/domain/adapters/in/handlers/productApiHandler.ts

import { CreateNewProductService } from '../../../domain/services/CreateNewProductService';
import { DeleteProductService } from '../../../domain/services/DeleteProductService';
import { FindProductByIdService } from '../../../domain/services/FindProductByIdService';
import { GetAllProductsService } from '../../../domain/services/GetAllProductsService';
import { UpdateProductService } from '../../../domain/services/UpdateProductService';
import { InMemoryProductRepository } from '../../out/InMemoryProductRepository';
import { productApiHandlerWrapper } from './productApiHandlerWrapper';

const repository = new InMemoryProductRepository();
const findProductByIdQuery = new FindProductByIdService(repository);
const getAllProductsQuery = new GetAllProductsService(repository);
const createNewProductUseCase = new CreateNewProductService(repository);
const updateProductUseCase = new UpdateProductService(repository);
const deleteProductUseCase = new DeleteProductService(repository);

export const productApiHandler = productApiHandlerWrapper(findProductByIdQuery, getAllProductsQuery, createNewProductUseCase, updateProductUseCase, deleteProductUseCase);
