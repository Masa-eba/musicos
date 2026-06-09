import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { getActivities } from '@/features/activities/services/activity-storage';
import { Activity } from '@/features/activities/types/activity';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);

    try {
      setActivities(await getActivities());
    } catch {
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return { activities, isLoading, reload };
}
