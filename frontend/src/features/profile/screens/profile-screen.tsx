import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, layout, shadow } from '@/shared/theme/design';

const profileItems = [
  { label: 'ユーザー名', value: 'Masatoshi' },
  { label: '使用楽器', value: 'Guitar' },
  { label: '自己紹介', value: 'MusicOS Developer' },
] as const;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>PROFILE</Text>
        <Text style={styles.title}>Your sound</Text>

        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>M</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.name}>Masatoshi</Text>
            <Text style={styles.role}>MusicOS Developer</Text>
          </View>
          <View style={styles.instrumentBadge}>
            <Text style={styles.instrumentBadgeText}>Guitar</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          {profileItems.map((item) => (
            <View key={item.label} style={styles.item}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
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
    maxWidth: 680,
    alignSelf: 'center',
    padding: layout.screenPadding,
    paddingBottom: 48,
    gap: 20,
  },
  eyebrow: {
    marginTop: 8,
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    marginTop: -10,
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 22,
    gap: 16,
    backgroundColor: colors.accentStrong,
    borderRadius: layout.cardRadius,
    ...shadow,
  },
  avatar: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a99eff',
    borderColor: '#c6bfff',
    borderWidth: 1,
    borderRadius: 32,
  },
  avatarText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  heroText: {
    minWidth: 150,
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '800',
  },
  role: {
    color: '#d6d0ff',
    fontSize: 13,
  },
  instrumentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#ffffff20',
    borderColor: '#ffffff35',
    borderWidth: 1,
    borderRadius: 999,
  },
  instrumentBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 8,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  card: {
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.cardRadius,
  },
  item: {
    paddingVertical: 20,
    gap: 6,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    color: colors.textSubtle,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
