import { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ACTIVITY_CATEGORIES,
  Activity,
  ActivityCategory,
} from '@/features/activities/types/activity';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { createActivity } from '@/shared/api/activities';
import { colors, layout, shadow } from '@/shared/theme/design';
import { getLocalDateString } from '@/shared/utils/date';
import { createId } from '@/shared/utils/id';

export default function ActivityScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('Guitar');
  const [minutes, setMinutes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const parsedMinutes = Number(minutes);

    if (!Number.isInteger(parsedMinutes) || parsedMinutes <= 0) {
      Alert.alert('入力内容を確認してください', '活動時間を1分以上の整数で入力してください。');
      return;
    }

    const activity: Activity = {
      id: createId(),
      date: getLocalDateString(new Date()),
      category: selectedCategory,
      minutes: parsedMinutes,
    };

    setIsSaving(true);

    try {
      if (user === null) {
        throw new Error('Sign in is required');
      }

      await createActivity(activity, user.userId);
      setMinutes('');
      Alert.alert('保存しました', `${selectedCategory} ${parsedMinutes}分`);
    } catch {
      Alert.alert('保存できませんでした', '時間をおいてもう一度お試しください。');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>NEW SESSION</Text>
        <Text style={styles.title}>活動を記録</Text>
        <Text style={styles.subtitle}>今日取り組んだ音楽活動を残しましょう。</Text>

        <View style={styles.formCard}>
          <View style={styles.section}>
            <Text style={styles.sectionNumber}>01</Text>
            <Text style={styles.label}>カテゴリを選択</Text>
            <View style={styles.categories}>
              {ACTIVITY_CATEGORIES.map((category) => {
                const isSelected = category === selectedCategory;

                return (
                  <Pressable
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    style={[styles.categoryButton, isSelected && styles.selectedCategoryButton]}>
                    <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionNumber}>02</Text>
            <Text style={styles.label}>活動時間</Text>
            <View style={styles.inputRow}>
              <TextInput
                inputMode="numeric"
                onChangeText={setMinutes}
                placeholder="60"
                placeholderTextColor={colors.textSubtle}
                style={styles.input}
                value={minutes}
              />
              <Text style={styles.inputUnit}>分</Text>
            </View>
          </View>
        </View>

        <Pressable
          disabled={isSaving}
          onPress={() => void handleSave()}
          style={({ pressed }) => [
            styles.saveButton,
            (pressed || isSaving) && styles.pressed,
          ]}>
          <Text style={styles.saveButtonText}>{isSaving ? '保存中...' : '活動を保存'}</Text>
        </Pressable>
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
  subtitle: {
    marginTop: -10,
    marginBottom: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
  formCard: {
    padding: 20,
    gap: 24,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.cardRadius,
  },
  section: {
    gap: 12,
  },
  sectionNumber: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  label: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
  },
  selectedCategoryButton: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  categoryText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  selectedCategoryText: {
    color: colors.text,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  inputUnit: {
    paddingRight: 16,
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    alignItems: 'center',
    paddingVertical: 17,
    backgroundColor: colors.accentStrong,
    borderRadius: 14,
    ...shadow,
  },
  pressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
