import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/providers/auth-provider';
import { SignInScreen } from '@/features/auth/screens/sign-in-screen';
import { SignUpScreen } from '@/features/auth/screens/sign-up-screen';
import { colors, layout } from '@/shared/theme/design';

export function AuthScreen() {
  const { isLoading } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>YOUR MUSIC PRACTICE</Text>
        <Text style={styles.brand}>MusicOS</Text>
        <Text style={styles.tagline}>積み重ねた時間を、次の音へ。</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.accent} size="large" />
        ) : mode === 'signIn' ? (
          <SignInScreen onShowSignUp={() => setMode('signUp')} />
        ) : (
          <SignUpScreen onShowSignIn={() => setMode('signIn')} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
    gap: 18,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.2,
  },
  brand: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  tagline: {
    marginBottom: 16,
    color: colors.textMuted,
    fontSize: 14,
  },
});
