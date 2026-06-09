import { StyleSheet, Text, View } from 'react-native';

import { MonthlyStat } from '@/features/dashboard/services/activity-stats';
import { colors, layout } from '@/shared/theme/design';

interface MonthlyChartProps {
  stats: MonthlyStat[];
}

function formatHours(minutes: number): string {
  return `${(minutes / 60).toFixed(1)}h`;
}

export function MonthlyChart({ stats }: MonthlyChartProps) {
  const maxMinutes = Math.max(...stats.map((stat) => stat.minutes), 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>月別活動時間</Text>

      <View style={styles.chart}>
        {stats.map((stat) => {
          const heightPercentage = stat.minutes === 0 ? 0 : Math.max((stat.minutes / maxMinutes) * 100, 3);

          return (
            <View key={stat.key} style={styles.column}>
              <Text style={styles.value}>{formatHours(stat.minutes)}</Text>
              <View style={styles.track}>
                <View style={[styles.bar, { height: `${heightPercentage}%` }]} />
              </View>
              <Text style={styles.label}>{stat.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 24,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.cardRadius,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  chart: {
    height: 220,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  column: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  value: {
    color: colors.textSubtle,
    fontSize: 10,
  },
  track: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
  },
  bar: {
    width: '100%',
    backgroundColor: colors.accent,
    borderRadius: 6,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
