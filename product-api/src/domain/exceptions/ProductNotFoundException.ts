// domain/exceptions/ProductNotFoundException.ts

export class ProductNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProductNotFoundException";

        // Maintains proper stack trace for where our error was thrown (only available in V8)
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, ProductNotFoundException);
        }          
    }
}
