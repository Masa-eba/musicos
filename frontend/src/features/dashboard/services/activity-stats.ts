import {
  ACTIVITY_CATEGORIES,
  Activity,
  ActivityCategory,
} from '@/features/activities/types/activity';

export interface CategoryStat {
  category: ActivityCategory;
  minutes: number;
  percentage: number;
}

export interface MonthlyStat {
  key: string;
  label: string;
  minutes: number;
}

export function getTotalMinutes(activities: Activity[]): number {
  return activities.reduce((total, activity) => total + activity.minutes, 0);
}

export function getTotalDays(activities: Activity[]): number {
  return new Set(activities.map((activity) => activity.date)).size;
}

export function getTotalActivities(activities: Activity[]): number {
  return activities.length;
}

export function getCategoryStats(activities: Activity[]): CategoryStat[] {
  const totalMinutes = getTotalMinutes(activities);
  const minutesByCategory = new Map<ActivityCategory, number>();

  activities.forEach((activity) => {
    const currentMinutes = minutesByCategory.get(activity.category) ?? 0;
    minutesByCategory.set(activity.category, currentMinutes + activity.minutes);
  });

  return ACTIVITY_CATEGORIES.map((category) => {
    const minutes = minutesByCategory.get(category) ?? 0;

    return {
      category,
      minutes,
      percentage: totalMinutes === 0 ? 0 : (minutes / totalMinutes) * 100,
    };
  });
}

export function getMonthlyStats(activities: Activity[], today = new Date()): MonthlyStat[] {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return {
      key: `${date.getFullYear()}-${month}`,
      label: `${date.getMonth() + 1}月`,
      minutes: 0,
    };
  });
  const monthByKey = new Map(months.map((month) => [month.key, month]));

  activities.forEach((activity) => {
    const month = monthByKey.get(activity.date.slice(0, 7));

    if (month !== undefined) {
      month.minutes += activity.minutes;
    }
  });

  return months;
}
