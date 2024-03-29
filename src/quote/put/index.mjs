import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "quotesDB";

async function isContainedInDatabase(quoteId) {
  const getDbRequest = {
    TableName: tableName,
    Key: {
      id: quoteId,
    },
  };
  const getDbResponse = await dynamo.send(new GetCommand(getDbRequest));

  return getDbResponse["Item"] != null;
}

export const handler = async (event, context) => {
  const requestBody = event["body-json"];
  const quoteId = event["params"]["querystring"]["id"];

  if (!(await isContainedInDatabase(quoteId))) {
    return {
      statusCode: 404,
      message: `Quote item with id ${quoteId} not found in database`,
    };
  }

  const updatedQuote = {
    id: quoteId,
    text: requestBody["text"],
    author: requestBody["author"],
    likeCount: requestBody["likeCount"],
  };

  const updateDbRequest = {
    TableName: tableName,
    Key: {
      id: updatedQuote["id"],
    },
    AttributeUpdates: {
      author: {
        Value: updatedQuote["author"],
      },
      text: {
        Value: updatedQuote["text"],
      },
      likeCount: {
        Value: updatedQuote["likeCount"],
      },
    },
  };

  const updateDbResponse = await dynamo.send(new UpdateCommand(updateDbRequest));
  const response = {
    statusCode: updateDbResponse["$metadata"]["httpStatusCode"],
    body: JSON.stringify(updatedQuote),
  };

  return response;
};
