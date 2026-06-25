import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { Activity } from '@/features/activities/types/activity';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { getActivities } from '@/shared/api/activities';

export function useActivities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    setIsLoading(true);

    try {
      setActivities(user === null ? [] : await getActivities(user.userId));
    } catch {
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  return { activities, isLoading, reload };
}
