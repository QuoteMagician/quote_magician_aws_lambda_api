import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "quotesDB";

export const handler = async (event, context) => {
  const requestBody = event["body-json"];
  const newQuote = {
    id: uuidv4(),
    text: requestBody["text"],
    author: requestBody["author"],
    likeCount: requestBody["likeCount"],
  };

  const dbRequest = {
    TableName: tableName,
    Item: newQuote,
  };

  const dbResponse = await dynamo.send(new PutCommand(dbRequest));
  const response = {
    statusCode: dbResponse["$metadata"]["httpStatusCode"],
    body: {
      id: JSON.stringify(newQuote["id"]),
    },
  };

  return response;
};
