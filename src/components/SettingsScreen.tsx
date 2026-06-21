/**
 * Reusable chrome for every settings screen:
 * a dark safe-area container with a consistent back-button header.
 */
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '@/theme';

interface Props {
  title: string;
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
}

export function SettingsScreen({ title, children, scroll = true, contentStyle }: Props) {
  const insets = useSafeAreaInsets();

  const body = (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      {scroll ? (
        <ScrollView
          contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </View>
  );
}

// ─── Shared row components ────────────────────────────────────────────────────

export function SettingsSection({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.wrap}>
      {label && <Text style={sectionStyles.label}>{label}</Text>}
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

export function SettingsRow({
  icon,
  iconColor,
  label,
  value,
  onPress,
  last = false,
  destructive = false,
  rightElement,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  last?: boolean;
  destructive?: boolean;
  rightElement?: React.ReactNode;
}) {
  const color = destructive ? colors.danger : (iconColor ?? colors.primary);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !rightElement}
      style={({ pressed }) => [
        rowStyles.row,
        !last && rowStyles.border,
        pressed && onPress && rowStyles.pressed,
      ]}
      accessibilityRole={onPress ? 'button' : 'none'}
    >
      <View style={[rowStyles.icon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[rowStyles.label, destructive && rowStyles.destructiveLabel]}>
        {label}
      </Text>
      {value && <Text style={rowStyles.value}>{value}</Text>}
      {rightElement}
      {onPress && !rightElement && (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: { width: 38 },
  content: { paddingHorizontal: spacing.lg },
});

const sectionStyles = StyleSheet.create({
  wrap: { marginTop: spacing.lg },
  label: {
    ...typography.captionSemi,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: { backgroundColor: colors.surfaceAlt },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { ...typography.body, color: colors.text, flex: 1 },
  destructiveLabel: { color: colors.danger },
  value: { ...typography.body, color: colors.textMuted },
});
