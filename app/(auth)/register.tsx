import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/theme';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '@/utils/validation';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function RegisterScreen() {
  const { register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleRegister() {
    const nextErrors: FieldErrors = {
      name:     validateName(name)                          ?? undefined,
      email:    validateEmail(email)                         ?? undefined,
      password: validatePassword(password)                   ?? undefined,
      confirm:  validatePasswordConfirm(password, confirm)   ?? undefined,
    };
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setFormError(null);
    try {
      await register({ name, email, password });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.hero}>
        <Logo size={52} />
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Join CollabMe and start matching with people near you.
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          placeholder="Your name"
          autoCapitalize="words"
          textContentType="name"
        />
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          placeholder="At least 8 characters"
          secure
          autoCapitalize="none"
          textContentType="newPassword"
        />
        <TextField
          label="Confirm password"
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          placeholder="Re-enter your password"
          secure
          autoCapitalize="none"
          textContentType="newPassword"
        />

        {!!formError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}

        <Button label="Create account" onPress={handleRegister} loading={loading} />

        {/* Terms note */}
        <Text style={styles.terms}>
          By signing up you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/(auth)/login" style={styles.footerLink}>
          Log in
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  form: { gap: spacing.xs },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(248,113,113,0.10)',
    borderWidth: 1,
    borderColor: `${colors.danger}40`,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: { ...typography.caption, color: colors.danger, flex: 1 },

  terms: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  termsLink: { color: colors.primary },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  footerLink: { ...typography.bodySemi, color: colors.primary },
});
