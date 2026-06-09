import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ContributionGraph } from '@/features/activities/components/contribution-graph';
import { useActivities } from '@/features/activities/hooks/use-activities';
import { Activity } from '@/features/activities/types/activity';
import { colors, layout } from '@/shared/theme/design';

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemAccent} />
      <View style={styles.itemText}>
        <Text style={styles.date}>{activity.date}</Text>
        <Text style={styles.category}>{activity.category}</Text>
      </View>
      <Text style={styles.minutes}>{activity.minutes}分</Text>
    </View>
  );
}

export default function GraphScreen() {
  const { activities, isLoading } = useActivities();
  const listHeader = (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>PROGRESS</Text>
        <Text style={styles.pageTitle}>Your rhythm</Text>
        <Text style={styles.subtitle}>毎日の積み重ねを振り返る</Text>
      </View>
      <ContributionGraph activities={activities} />
      <Text style={styles.title}>Activity history</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={[styles.container, activities.length === 0 && styles.emptyContainer]}
        data={activities}
        keyExtractor={(activity) => activity.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? '読み込み中...' : 'まだ活動履歴がありません'}
          </Text>
        }
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => <ActivityItem activity={item} />}
      />
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
    paddingBottom: 48,
    gap: 12,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  header: {
    marginBottom: 20,
    gap: 24,
  },
  eyebrow: {
    marginTop: 8,
    marginBottom: 6,
    color: colors.success,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 14,
  },
  item: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
  },
  itemAccent: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 0,
    width: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  itemText: {
    gap: 5,
  },
  date: {
    color: colors.textSubtle,
    fontSize: 13,
  },
  category: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  minutes: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
