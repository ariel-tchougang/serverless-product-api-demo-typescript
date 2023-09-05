// tests/unit/domain/services/CreateNewProductService.test.ts

import { AlwaysCreateNewProductPort, ErrorOnCreateNewProductPort } from "../mocks/ports/out/CreateNewProductPort";
import { CreateNewProductService } from "../../../../src/domain/services/CreateNewProductService";
import { CreateNewProductServiceException } from "../../../../src/domain/exceptions/ServiceExceptions"

describe("CreateNewProductService", () => {
  const alwaysCreateNewProductPort = new AlwaysCreateNewProductPort();
  jest.spyOn(alwaysCreateNewProductPort, 'create');

  const errorOnCreateNewProductPort = new ErrorOnCreateNewProductPort();
  jest.spyOn(errorOnCreateNewProductPort, 'create');

  const alwaysCreateNewProductService = new CreateNewProductService(alwaysCreateNewProductPort);
  const errorOnCreateNewProductService = new CreateNewProductService(errorOnCreateNewProductPort);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new product when create operation succeeds", () => {
    const product = alwaysCreateNewProductService.execute({ id: "", name: "someName",});
    expect(product).toBeDefined();
    expect(product?.id).toBe("someId"); 
    expect(product?.name).toBe("someName"); 
    expect(alwaysCreateNewProductPort.create).toBeCalledTimes(1);
  });

  test("should throw CreateNewProductServiceException when create operation fails", () => {
    expect(() => {
      errorOnCreateNewProductService.execute({ id: "", name: "someName",});
    }).toThrow(CreateNewProductServiceException);    
    expect(errorOnCreateNewProductPort.create).toBeCalledTimes(1);
  });
});
