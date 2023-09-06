// src/domain/adapters/out/DynamoDBRepository.ts

import { DynamoDB } from "aws-sdk";
import { Product } from "../../domain/models/Product";

const documentClient = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME || "";

export class DynamoDBRepository {

  async create(product: Product): Promise<Product> {
    const params = {
      TableName: tableName,
      Item: product,
    };
    await documentClient.put(params).promise();
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const params = {
      TableName: tableName,
      Key: { id },
    };
    const result = await documentClient.get(params).promise();
    return result.Item as Product || null;
  }

  async update(id: string, product: Product): Promise<Product | null> {
    const updateExpression = "set #name = :name";
    const expressionAttributeNames = { "#name": "name" };
    const expressionAttributeValues = { ":name": product.name };
    
    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "UPDATED_NEW",
    };
    await documentClient.update(params).promise();
    return {id, name: product.name}  as Product;
  }

  async delete(id: string): Promise<string> {
    const params = {
      TableName: tableName,
      Key: { id },
    };
    await documentClient.delete(params).promise();
    return id;
  }

  async findAll(): Promise<Product[] | undefined> {
    const params = {
      TableName: tableName,
    };
    const result = await documentClient.scan(params).promise();
    return result.Items ? result.Items as Product[] : undefined;
  }
}
