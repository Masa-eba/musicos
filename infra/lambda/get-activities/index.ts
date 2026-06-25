import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

const tableName = process.env.TABLE_NAME;
const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

interface ActivityResponse {
  activityId: string;
  date: string;
  category: string;
  minutes: number;
}

function response(statusCode: number, body: object | ActivityResponse[]) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function toActivityResponse(item: Record<string, unknown>): ActivityResponse | null {
  if (
    typeof item.activityId !== 'string' ||
    typeof item.date !== 'string' ||
    typeof item.category !== 'string' ||
    typeof item.minutes !== 'number'
  ) {
    return null;
  }

  return {
    activityId: item.activityId,
    date: item.date,
    category: item.category,
    minutes: item.minutes,
  };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (tableName === undefined) {
    console.error('TABLE_NAME environment variable is not configured');
    return response(500, { message: 'Server configuration error' });
  }

  const userId = event.queryStringParameters?.userId;

  if (userId === undefined || userId.length === 0) {
    return response(400, { message: 'userId query parameter is required' });
  }

  const result = await documentClient.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ProjectionExpression: 'activityId, #date, category, minutes',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
    }),
  );
  const activities = (result.Items ?? [])
    .map(toActivityResponse)
    .filter((activity): activity is ActivityResponse => activity !== null)
    .sort((a, b) => b.date.localeCompare(a.date));

  return response(200, activities);
};
