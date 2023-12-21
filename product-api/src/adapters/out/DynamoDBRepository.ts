// src/domain/adapters/out/DynamoDBRepository.ts

import { Product } from "../../domain/models/Product";
import { ProductRepository } from "./ProductRepository";

import * as AWSXRay from 'aws-xray-sdk-core';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = AWSXRay.captureAWSv3Client(new DynamoDBClient({}));
const documentClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME || "";

export class DynamoDBRepository extends ProductRepository {

  async create(product: Product): Promise<Product> {
    const params = {
      TableName: tableName,
      Item: product,
    };
    const response = await documentClient.send(new PutCommand(params));
    console.log('PutCommand response: ', response);
    return product;
  }

  async findById(id: string): Promise<Product | undefined> {
    const params = {
      TableName: tableName,
      Key: { id },
    };
    const response = await documentClient.send(new GetCommand(params));
    console.log('GetCommand response: ', response);
    return response.Item as Product || null;
  }

  async update(id: string, product: Product): Promise<Product | undefined> {
    const updateExpression = "set #product_name = :name";
    const ExpressionAttributeNames = {"#product_name": "name"};
    const expressionAttributeValues = { ":name": product.name };
    
    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    };
    const response = await documentClient.send(new UpdateCommand(params));
    console.log('UpdateCommand response: ', response);
    return {id, name: product.name}  as Product;
  }

  async delete(id: string): Promise<void> {
    const params = {
      TableName: tableName,
      Key: { id },
    };
    
    const response = await documentClient.send(new DeleteCommand(params));
    console.log('DeleteCommand response: ', response);
  }

  async findAll(): Promise<Product[] | undefined> {
    const params = {
      TableName: tableName,
    };
    const response = await documentClient.send(new ScanCommand(params));
    console.log('ScanCommand response: ', response);
    return response.Items ? response.Items as Product[] : undefined;
  }
}
