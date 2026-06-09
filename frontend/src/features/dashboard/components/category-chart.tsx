import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { ActivityCategory } from '@/features/activities/types/activity';
import { CategoryStat } from '@/features/dashboard/services/activity-stats';
import { colors, layout } from '@/shared/theme/design';

const CHART_SIZE = 180;
const STROKE_WIDTH = 28;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const categoryColors: Record<ActivityCategory, string> = {
  Guitar: '#8b7cff',
  Piano: '#5ebcff',
  Vocal: '#ff78bd',
  DTM: '#ffc45e',
  Compose: '#5ee6a8',
  Live: '#ff7474',
};

interface CategoryChartProps {
  stats: CategoryStat[];
}

function formatHours(minutes: number): string {
  return `${(minutes / 60).toFixed(1)}h`;
}

export function CategoryChart({ stats }: CategoryChartProps) {
  const activeStats = stats.filter((stat) => stat.minutes > 0);
  const segments = activeStats.map((stat, index) => ({
    ...stat,
    dashOffset: -activeStats
      .slice(0, index)
      .reduce((total, previousStat) => total + (previousStat.percentage / 100) * CIRCUMFERENCE, 0),
    segmentLength: (stat.percentage / 100) * CIRCUMFERENCE,
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>カテゴリ別活動</Text>

      <View style={styles.content}>
        <View style={styles.chart}>
          <Svg height={CHART_SIZE} width={CHART_SIZE}>
            <Circle
              cx={CHART_SIZE / 2}
              cy={CHART_SIZE / 2}
              fill="none"
              r={RADIUS}
              stroke={colors.surfaceMuted}
              strokeWidth={STROKE_WIDTH}
            />
            {segments.map((segment) => (
              <Circle
                cx={CHART_SIZE / 2}
                cy={CHART_SIZE / 2}
                fill="none"
                key={segment.category}
                r={RADIUS}
                stroke={categoryColors[segment.category]}
                strokeDasharray={`${segment.segmentLength} ${CIRCUMFERENCE - segment.segmentLength}`}
                strokeDashoffset={segment.dashOffset}
                strokeWidth={STROKE_WIDTH}
                transform={`rotate(-90 ${CHART_SIZE / 2} ${CHART_SIZE / 2})`}
              />
            ))}
          </Svg>
          <View style={styles.chartCenter}>
            <Text style={styles.chartCenterValue}>{activeStats.length}</Text>
            <Text style={styles.chartCenterLabel}>categories</Text>
          </View>
        </View>

        <View style={styles.legend}>
          {stats.map((stat) => (
            <View key={stat.category} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: categoryColors[stat.category] }]} />
              <Text style={styles.legendCategory}>{stat.category}</Text>
              <Text style={styles.legendValue}>
                {formatHours(stat.minutes)} · {Math.round(stat.percentage)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 20,
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
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  chart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartCenterValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  chartCenterLabel: {
    color: colors.textSubtle,
    fontSize: 11,
  },
  legend: {
    minWidth: 210,
    flex: 1,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendCategory: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
  },
  legendValue: {
    color: colors.textSubtle,
    fontSize: 13,
  },
});
