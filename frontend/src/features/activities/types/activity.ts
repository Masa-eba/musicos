export type ActivityCategory = 'Guitar' | 'Piano' | 'Vocal' | 'DTM' | 'Compose' | 'Live';

export interface Activity {
  id: string;
  date: string;
  category: ActivityCategory;
  minutes: number;
}

export const ACTIVITY_CATEGORIES: readonly ActivityCategory[] = [
  'Guitar',
  'Piano',
  'Vocal',
  'DTM',
  'Compose',
  'Live',
];
