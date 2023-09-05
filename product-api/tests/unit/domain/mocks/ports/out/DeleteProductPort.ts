// tests/unit/domain/mocks/ports/out/DeleteProductPort.ts

import { DeleteProductPort } from "../../../../../../src/domain/ports/out/Persistence";

export class AlwaysOkDeleteProductPort implements DeleteProductPort {
    delete(id: string): void { }
}
  
export class ErrorOnDeleteProductPort implements DeleteProductPort {
  delete(id: string): void {
    throw new Error("Unexpected error on delete product");
  }
}
  
