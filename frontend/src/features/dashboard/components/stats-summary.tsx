import { StyleSheet, Text, View } from 'react-native';

import { colors, layout, shadow } from '@/shared/theme/design';

interface StatsSummaryProps {
  todayMinutes: number;
  totalMinutes: number;
  totalDays: number;
  totalActivities: number;
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}分`;
  }
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }

  return `${hours}時間 ${remainingMinutes}分`;
}

export function StatsSummary({
  todayMinutes,
  totalMinutes,
  totalDays,
  totalActivities,
}: StatsSummaryProps) {
  const summaryItems = [
    { label: '総活動時間', value: formatMinutes(totalMinutes) },
    { label: '活動日数', value: `${totalDays}日` },
    { label: '活動回数', value: `${totalActivities}回` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.todayCard}>
        <View style={styles.glow} />
        <Text style={styles.todayLabel}>今日の活動</Text>
        <Text style={styles.todayValue}>{formatMinutes(todayMinutes)}</Text>
        <Text style={styles.todayHint}>今日も自分のペースで続けよう</Text>
      </View>

      <View style={styles.summaryGrid}>
        {summaryItems.map((item) => (
          <View key={item.label} style={styles.summaryCard}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.summaryValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  todayCard: {
    overflow: 'hidden',
    padding: 26,
    gap: 10,
    backgroundColor: colors.accentStrong,
    borderRadius: layout.cardRadius,
    ...shadow,
  },
  glow: {
    position: 'absolute',
    top: -55,
    right: -35,
    width: 160,
    height: 160,
    backgroundColor: '#a99eff',
    borderRadius: 80,
    opacity: 0.28,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  todayLabel: {
    color: '#e5e0ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  todayValue: {
    color: colors.white,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  todayHint: {
    color: '#d6d0ff',
    fontSize: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    minWidth: 140,
    flex: 1,
    padding: 18,
    gap: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
});
