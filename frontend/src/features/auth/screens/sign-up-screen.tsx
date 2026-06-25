import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/features/auth/providers/auth-provider';
import { colors, layout, shadow } from '@/shared/theme/design';

interface SignUpScreenProps {
  onShowSignIn: () => void;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'サインアップに失敗しました';
}

export function SignUpScreen({ onShowSignIn }: SignUpScreenProps) {
  const { confirmSignUp, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const isComplete = await signUp(email.trim(), password);
      setNeedsConfirmation(!isComplete);

      if (isComplete) {
        onShowSignIn();
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await confirmSignUp(email.trim(), confirmationCode.trim());
      onShowSignIn();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{needsConfirmation ? 'Confirm email' : 'Sign up'}</Text>
      <Text style={styles.subtitle}>
        {needsConfirmation
          ? 'メールに届いた確認コードを入力してください。'
          : 'MusicOSアカウントを作成します。'}
      </Text>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        editable={!needsConfirmation}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.textSubtle}
        style={styles.input}
        value={email}
      />

      {needsConfirmation ? (
        <TextInput
          inputMode="numeric"
          onChangeText={setConfirmationCode}
          placeholder="Confirmation code"
          placeholderTextColor={colors.textSubtle}
          style={styles.input}
          value={confirmationCode}
        />
      ) : (
        <TextInput
          autoCapitalize="none"
          autoComplete="new-password"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor={colors.textSubtle}
          secureTextEntry
          style={styles.input}
          value={password}
        />
      )}

      {errorMessage.length > 0 && <Text style={styles.error}>{errorMessage}</Text>}

      <Pressable
        disabled={isSubmitting}
        onPress={() => void (needsConfirmation ? handleConfirm() : handleSignUp())}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>
          {isSubmitting ? 'Please wait...' : needsConfirmation ? 'Confirm email' : 'Sign up'}
        </Text>
      </Pressable>

      <Pressable onPress={onShowSignIn} style={({ pressed }) => pressed && styles.pressed}>
        <Text style={styles.link}>Sign inへ戻る</Text>
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
