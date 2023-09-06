// src/domain/adapters/out/InMemoryProductRepository.ts

import { Product } from "../../domain/models/Product";
import { ProductRepository } from "./ProductRepository";

export class InMemoryProductRepository extends ProductRepository {
  private products: Product[];

  constructor() {
    super();
    this.products = [];
  }

  async findAll(): Promise<Product[]> {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.products];
  }

  async findById(id: string): Promise<Product | undefined> {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.find(product => product.id === id);
  }

  async create(product: Product): Promise<Product> {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    this.products.push(product);
    return product;
  }

  async update(id: string, updatedProduct: Product): Promise<Product | undefined> {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) {
      return undefined;
    }
    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    // Simulate a database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }
}
