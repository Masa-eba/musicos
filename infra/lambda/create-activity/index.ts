import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

const tableName = process.env.TABLE_NAME;
const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const activityCategories = new Set(['Guitar', 'Piano', 'Vocal', 'DTM', 'Compose', 'Live']);
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

interface CreateActivityRequest {
  userId: string;
  activityId: string;
  date: string;
  category: string;
  minutes: number;
}

function isCreateActivityRequest(value: unknown): value is CreateActivityRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.userId === 'string' &&
    candidate.userId.length > 0 &&
    typeof candidate.activityId === 'string' &&
    candidate.activityId.length > 0 &&
    typeof candidate.date === 'string' &&
    datePattern.test(candidate.date) &&
    typeof candidate.category === 'string' &&
    activityCategories.has(candidate.category) &&
    typeof candidate.minutes === 'number' &&
    Number.isInteger(candidate.minutes) &&
    candidate.minutes > 0
  );
}

function response(statusCode: number, body: object) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (tableName === undefined) {
    console.error('TABLE_NAME environment variable is not configured');
    return response(500, { message: 'Server configuration error' });
  }

  if (event.body === undefined) {
    return response(400, { message: 'Request body is required' });
  }

  let request: unknown;

  try {
    request = JSON.parse(event.body);
  } catch {
    return response(400, { message: 'Request body must be valid JSON' });
  }

  if (!isCreateActivityRequest(request)) {
    return response(400, { message: 'Activity data is invalid' });
  }

  await documentClient.send(
    new PutCommand({
      TableName: tableName,
      Item: request,
    }),
  );

  return response(201, request);
};
