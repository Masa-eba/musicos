import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  ACTIVITY_CATEGORIES,
  Activity,
  ActivityCategory,
} from '@/features/activities/types/activity';
import { getLocalDateString } from '@/shared/utils/date';

// Future Migration: Keep the local persistence implementation available for
// offline support and migration of existing AsyncStorage activities.
const ACTIVITIES_KEY = 'activities';

function isActivityCategory(value: unknown): value is ActivityCategory {
  return ACTIVITY_CATEGORIES.some((category) => category === value);
}

function isActivity(value: unknown): value is Activity {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.date === 'string' &&
    isActivityCategory(candidate.category) &&
    typeof candidate.minutes === 'number' &&
    Number.isFinite(candidate.minutes)
  );
}

export async function getActivities(): Promise<Activity[]> {
  const storedActivities = await AsyncStorage.getItem(ACTIVITIES_KEY);

  if (storedActivities === null) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedActivities);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isActivity).sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return [];
  }
}

export async function saveActivity(activity: Activity): Promise<void> {
  const activities = await getActivities();
  await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify([activity, ...activities]));
}

export async function deleteActivity(id: string): Promise<void> {
  const activities = await getActivities();
  const remainingActivities = activities.filter((activity) => activity.id !== id);
  await AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(remainingActivities));
}

export async function getTodayMinutes(): Promise<number> {
  const today = getLocalDateString(new Date());
  const activities = await getActivities();

  return activities
    .filter((activity) => activity.date === today)
    .reduce((total, activity) => total + activity.minutes, 0);
}
