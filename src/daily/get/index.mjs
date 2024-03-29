import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "quotesDB";

function generateDailyRandomNumber(quoteCount) {
  const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in the 'YYYY-MM-DD' format
  const secretKey = "lucasdanny"; // Replace with a secret key for added security
  const hash = crypto.createHmac("sha256", secretKey).update(currentDate).digest("hex");

  // Convert the hash to a number (you can adjust the range as needed)
  const randomNumber = parseInt(hash, 16) % quoteCount;

  return randomNumber;
}

export const handler = async (event, context) => {
  const dbRequest = {
    TableName: tableName,
  };
  const dbResponse = await dynamo.send(new ScanCommand(dbRequest));

  const quotes = dbResponse["Items"];
  const randomNumber = generateDailyRandomNumber(quotes.length);
  const randomQuote = quotes[randomNumber];

  const response = {
    statusCode: dbResponse["$metadata"]["httpStatusCode"],
    body: JSON.stringify(randomQuote),
  };

  return response;
};
