import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/theme';
import { validateEmail } from '@/utils/validation';

export default function LoginScreen() {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleLogin() {
    const emailError   = validateEmail(email);
    const passwordError = password ? null : 'Please enter your password.';

    if (emailError || passwordError) {
      setErrors({ email: emailError ?? undefined, password: passwordError ?? undefined });
      return;
    }

    setErrors({});
    setFormError(null);
    try {
      await login({ email, password });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  return (
    <ScreenContainer scroll>
      {/* ── Hero section ── */}
      <View style={styles.hero}>
        <Logo size={52} />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Log in to find people to play, train, and explore with.
        </Text>
      </View>

      {/* ── Form ── */}
      <View style={styles.form}>
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
          placeholder="Your password"
          secure
          autoCapitalize="none"
          textContentType="password"
        />

        <Pressable style={styles.forgotLink} accessibilityRole="link">
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        {!!formError && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}

        <Button label="Log In" onPress={handleLogin} loading={loading} />
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Link href="/(auth)/register" style={styles.footerLink}>
          Sign up
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: spacing.xl,
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

  forgotLink: { alignSelf: 'flex-end', marginTop: -spacing.xs, marginBottom: spacing.md },
  forgotText: { ...typography.captionSemi, color: colors.primary },

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

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  footerText: { ...typography.body, color: colors.textSecondary },
  footerLink: { ...typography.bodySemi, color: colors.primary },
});
