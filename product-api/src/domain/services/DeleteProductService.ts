// src/domain/ports/in/DeleteProductService.ts

import { DeleteProductPort } from "../../domain/ports/out/Persistence";
import { DeleteProductUseCase } from "../../domain/ports/in/UseCases";
import { DeleteProductServiceException } from "../exceptions/ServiceExceptions";

export class DeleteProductService implements DeleteProductUseCase {
    constructor(private readonly deleteProductPort: DeleteProductPort) {}
    
    async execute(id: string): Promise<void> {
      try {
        await this.deleteProductPort.delete(id);
      } catch (error) {
        const e = error as Error;
        throw new DeleteProductServiceException(`${e.name}: ${e.message}`);
      }
    }    
}
