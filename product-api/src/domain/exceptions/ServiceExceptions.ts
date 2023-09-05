// domain/exceptions/ServiceExceptions.ts

export class FindProductByIdServiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FindProductByIdServiceException";

        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, FindProductByIdServiceException);
        }          
    }
}

export class DeleteProductServiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DeleteProductServiceException";

        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, DeleteProductServiceException);
        }          
    }
}

export class GetAllProductsServiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GetAllProductsServiceException";

        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, GetAllProductsServiceException);
        }          
    }
}

export class UpdateProductServiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UpdateProductServiceException";

        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, UpdateProductServiceException);
        }          
    }
}

export class CreateNewProductServiceException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CreateNewProductServiceException";

        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, CreateNewProductServiceException);
        }          
    }
}