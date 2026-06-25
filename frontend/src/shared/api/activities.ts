import {
  ACTIVITY_CATEGORIES,
  Activity,
  ActivityCategory,
} from '@/features/activities/types/activity';

interface ActivityApiResponse {
  activityId: string;
  date: string;
  category: ActivityCategory;
  minutes: number;
}

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (apiBaseUrl === undefined || apiBaseUrl.length === 0) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured');
  }

  return apiBaseUrl.replace(/\/+$/, '');
}

function isActivityCategory(value: unknown): value is ActivityCategory {
  return ACTIVITY_CATEGORIES.some((category) => category === value);
}

function isActivityApiResponse(value: unknown): value is ActivityApiResponse {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.activityId === 'string' &&
    typeof candidate.date === 'string' &&
    isActivityCategory(candidate.category) &&
    typeof candidate.minutes === 'number' &&
    Number.isFinite(candidate.minutes)
  );
}

function toActivity(response: ActivityApiResponse): Activity {
  return {
    id: response.activityId,
    date: response.date,
    category: response.category,
    minutes: response.minutes,
  };
}

async function parseErrorResponse(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (typeof body === 'object' && body !== null) {
      const message = (body as Record<string, unknown>).message;

      if (typeof message === 'string') {
        return message;
      }
    }
  } catch {
    // The API may return an empty or non-JSON error response.
  }

  return `Request failed with status ${response.status}`;
}

export async function createActivity(activity: Activity, userId: string): Promise<Activity> {
  const response = await fetch(`${getApiBaseUrl()}/activities`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      activityId: activity.id,
      date: activity.date,
      category: activity.category,
      minutes: activity.minutes,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const body: unknown = await response.json();

  if (!isActivityApiResponse(body)) {
    throw new Error('Create activity response is invalid');
  }

  return toActivity(body);
}

export async function getActivities(userId: string): Promise<Activity[]> {
  const query = new URLSearchParams({ userId });
  const response = await fetch(`${getApiBaseUrl()}/activities?${query.toString()}`);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const body: unknown = await response.json();

  if (!Array.isArray(body) || !body.every(isActivityApiResponse)) {
    throw new Error('Activities response is invalid');
  }

  return body.map(toActivity).sort((a, b) => b.date.localeCompare(a.date));
}
