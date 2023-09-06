// tests/unit/domain/mocks/ports/out/DeleteProductPort.ts

import { DeleteProductPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysOkDeleteProductPort implements DeleteProductPort {
    async delete(id: string): Promise<void> { 
      await new Promise(resolve => setTimeout(resolve, 100)); 
    }
}
  
export class ErrorOnDeleteProductPort implements DeleteProductPort {
  async delete(id: string): Promise<void> {
    return Promise.reject("Error on delete product");
  }
}
  
