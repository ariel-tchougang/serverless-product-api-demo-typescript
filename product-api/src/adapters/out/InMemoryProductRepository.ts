// src/domain/adapters/out/InMemoryProductRepository.ts

import { Product } from "../../domain/models/Product";
import { ProductRepository } from "./ProductRepository";

export class InMemoryProductRepository extends ProductRepository {
    private readonly products: Product[] = [];
    
    findById(id: string): Product | undefined {
        return this.products.find(product => product.id === id);
    }
    
    findAll(): Product[] {
        return [...this.products];
    }

    create(product: Product): Product {
        this.products.push(product);
        return product;
    }

    update(id: string, product: Product): Product | undefined {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            return undefined;
        }
        this.products[index] = product;
        return product;
    }

    delete(id: string): void {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }
}
