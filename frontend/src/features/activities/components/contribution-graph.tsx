import { useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Activity } from '@/features/activities/types/activity';
import { colors, layout } from '@/shared/theme/design';
import { getLocalDateString } from '@/shared/utils/date';

const DAYS_TO_DISPLAY = 365;
const DAYS_PER_WEEK = 7;
const CELL_SIZE = 12;
const CELL_GAP = 4;

const levelColors = ['#202536', '#314d52', '#35766b', '#43a47e', '#5ee6a8'] as const;

interface ContributionDay {
  date: string;
  minutes: number;
}

type ContributionCell = ContributionDay | null;

interface ContributionGraphProps {
  activities: Activity[];
}

function getContributionLevel(minutes: number): number {
  if (minutes === 0) {
    return 0;
  }
  if (minutes <= 30) {
    return 1;
  }
  if (minutes <= 60) {
    return 2;
  }
  if (minutes <= 120) {
    return 3;
  }

  return 4;
}

function createContributionDays(activities: Activity[]): ContributionDay[] {
  const minutesByDate = new Map<string, number>();

  activities.forEach((activity) => {
    minutesByDate.set(activity.date, (minutesByDate.get(activity.date) ?? 0) + activity.minutes);
  });

  const today = new Date();

  return Array.from({ length: DAYS_TO_DISPLAY }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (DAYS_TO_DISPLAY - 1 - index));
    const dateString = getLocalDateString(date);

    return {
      date: dateString,
      minutes: minutesByDate.get(dateString) ?? 0,
    };
  });
}

function createWeeks(days: ContributionDay[]): ContributionCell[][] {
  const firstDay = new Date(`${days[0]?.date}T00:00:00`);
  const alignedDays: ContributionCell[] = [
    ...Array.from<null>({ length: firstDay.getDay() }).fill(null),
    ...days,
  ];
  const weeks: ContributionCell[][] = [];

  for (let index = 0; index < alignedDays.length; index += DAYS_PER_WEEK) {
    weeks.push(alignedDays.slice(index, index + DAYS_PER_WEEK));
  }

  return weeks;
}

export function ContributionGraph({ activities }: ContributionGraphProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const weeks = useMemo(() => createWeeks(createContributionDays(activities)), [activities]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Contribution Graph</Text>
      <Text style={styles.subtitle}>直近365日の活動</Text>

      <ScrollView
        horizontal
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.weeks}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <View key={`empty-${dayIndex}`} style={styles.emptyCell} />;
                }

                const level = getContributionLevel(day.minutes);

                return (
                  <View
                    accessibilityLabel={`${day.date} ${day.minutes}分`}
                    key={day.date}
                    style={[styles.cell, { backgroundColor: levelColors[level] }]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendText}>少ない</Text>
        {levelColors.map((color) => (
          <View key={color} style={[styles.cell, { backgroundColor: color }]} />
        ))}
        <Text style={styles.legendText}>多い</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    gap: 12,
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
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
  },
  weeks: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  week: {
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 2,
  },
  emptyCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: CELL_GAP,
  },
  legendText: {
    marginHorizontal: 3,
    color: colors.textSubtle,
    fontSize: 11,
  },
});
