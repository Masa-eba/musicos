import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/features/auth/providers/auth-provider';
import { colors, layout, shadow } from '@/shared/theme/design';

interface SignInScreenProps {
  onShowSignUp: () => void;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'サインインに失敗しました';
}

export function SignInScreen({ onShowSignUp }: SignInScreenProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>音楽活動の続きを始めましょう。</Text>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.textSubtle}
        style={styles.input}
        value={email}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="password"
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.textSubtle}
        secureTextEntry
        style={styles.input}
        value={password}
      />

      {errorMessage.length > 0 && <Text style={styles.error}>{errorMessage}</Text>}

      <Pressable
        disabled={isSubmitting}
        onPress={() => void handleSignIn()}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>{isSubmitting ? 'Signing in...' : 'Sign in'}</Text>
      </Pressable>

      <Pressable onPress={onShowSignUp} style={({ pressed }) => pressed && styles.pressed}>
        <Text style={styles.link}>アカウントを作成</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 440,
    padding: 24,
    gap: 16,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: layout.cardRadius,
    ...shadow,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginBottom: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    fontSize: 16,
  },
  error: {
    color: '#ff7474',
    fontSize: 13,
  },
  primaryButton: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: colors.accentStrong,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
