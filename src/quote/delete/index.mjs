import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "quotesDB";

export const handler = async (event, context) => {
  const quoteId = event["params"]["querystring"]["id"];
  const dbRequest = {
    TableName: tableName,
    Key: {
      id: quoteId,
    },
  };

  const dbResponse = await dynamo.send(new DeleteCommand(dbRequest));
  const response = {
    statusCode: dbResponse["$metadata"]["httpStatusCode"],
    body: {
      id: JSON.stringify(quoteId),
    },
  };

  return response;
};
