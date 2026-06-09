import { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';

import { useActivities } from '@/features/activities/hooks/use-activities';
import { CategoryChart } from '@/features/dashboard/components/category-chart';
import { MonthlyChart } from '@/features/dashboard/components/monthly-chart';
import { StatsSummary } from '@/features/dashboard/components/stats-summary';
import {
  getCategoryStats,
  getMonthlyStats,
  getTotalActivities,
  getTotalDays,
  getTotalMinutes,
} from '@/features/dashboard/services/activity-stats';
import { colors, layout } from '@/shared/theme/design';
import { getLocalDateString } from '@/shared/utils/date';

export default function HomeScreen() {
  const { activities } = useActivities();
  const stats = useMemo(() => {
    const today = getLocalDateString(new Date());

    return {
      todayMinutes: activities
        .filter((activity) => activity.date === today)
        .reduce((total, activity) => total + activity.minutes, 0),
      totalMinutes: getTotalMinutes(activities),
      totalDays: getTotalDays(activities),
      totalActivities: getTotalActivities(activities),
      categoryStats: getCategoryStats(activities),
      monthlyStats: getMonthlyStats(activities),
    };
  }, [activities]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>YOUR MUSIC PRACTICE</Text>
        <Text style={styles.title}>MusicOS</Text>
        <Text style={styles.subtitle}>積み重ねた時間を、次の音へ。</Text>
        <StatsSummary
          todayMinutes={stats.todayMinutes}
          totalActivities={stats.totalActivities}
          totalDays={stats.totalDays}
          totalMinutes={stats.totalMinutes}
        />
        <CategoryChart stats={stats.categoryStats} />
        <MonthlyChart stats={stats.monthlyStats} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    padding: layout.screenPadding,
    paddingBottom: 56,
    gap: layout.sectionGap,
  },
  eyebrow: {
    marginTop: 8,
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  title: {
    marginTop: -14,
    color: colors.text,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  subtitle: {
    marginTop: -16,
    color: colors.textMuted,
    fontSize: 14,
  },
});
