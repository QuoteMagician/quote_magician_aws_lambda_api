import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

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

  const dbResponse = await dynamo.send(new GetCommand(dbRequest));
  if (event["params"]["querystring"]["output"] === "html") {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Zitat des Tages</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }

                .quote-container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .quote-text {
                    font-size: 24px;
                    margin-bottom: 10px;
                }

                .author {
                    font-style: italic;
                    color: #888;
                    margin-bottom: 10px;
                }

                .likes {
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="quote-container">
                <div class="quote-text">${dbResponse["Item"]["text"]}</div>
                <div class="author">- ${dbResponse["Item"]["author"]}</div>
                <div class="likes">Likes: ${dbResponse["Item"]["likeCount"]}</div>
                <div class="id">ID: ${dbResponse["Item"]["id"]}</div>
            </div>
        </body>
        </html>
    `;

    return htmlContent.replace(/\n/g, "");
  } else {
    const response = {
      statusCode: dbResponse["$metadata"]["httpStatusCode"],
      body: JSON.stringify(dbResponse["Item"]),
    };
    return response;
  }
};
