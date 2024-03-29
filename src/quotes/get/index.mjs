import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "quotesDB";

export const handler = async (event, context) => {
  const dbRequest = {
    TableName: tableName,
  };

  const dbResponse = await dynamo.send(new ScanCommand(dbRequest));
  const response = {
    statusCode: dbResponse["$metadata"]["httpStatusCode"],
    body: JSON.stringify(dbResponse["Items"]),
  };

  return response;
};
