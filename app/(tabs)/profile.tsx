import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { ActivityCategory } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const INTEREST_COLOR: Record<ActivityCategory, string> = {
  gaming:   colors.gaming,
  sports:   colors.sports,
  fitness:  colors.fitness,
  outdoors: colors.outdoors,
  social:   colors.social,
};

const INTEREST_LABEL: Record<ActivityCategory, string> = {
  gaming:   '🎮 Gaming',
  sports:   '⚽ Sports',
  fitness:  '🏋️ Fitness',
  outdoors: '🥾 Outdoors',
  social:   '🎲 Social',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  tint,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tint?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && styles.menuPressed]}
      accessibilityRole="button"
    >
      <View style={[styles.menuIcon, { backgroundColor: `${tint ?? colors.textMuted}18` }]}>
        <Ionicons name={icon} size={18} color={tint ?? colors.textSecondary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, logout, loading } = useAuth();
  const insets = useSafeAreaInsets();

  if (!user) return null;

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header bar ── */}
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Profile</Text>
        <Pressable style={styles.settingsBtn} accessibilityLabel="Settings">
          <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* ── Avatar + name card ── */}
      <View style={[styles.heroCard, shadows.card]}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.name)}</Text>
          </View>
          {/* Online indicator */}
          <View style={styles.onlineRing} />
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        {!!user.bio && <Text style={styles.bio}>{user.bio}</Text>}

        <Pressable style={styles.editBtn} accessibilityRole="button" onPress={() => router.push('/edit-profile')}>
          <Ionicons name="create-outline" size={15} color={colors.primary} />
          <Text style={styles.editBtnText}>Edit profile</Text>
        </Pressable>
      </View>

      {/* ── Stats ── */}
      <View style={[styles.statsCard, shadows.card]}>
        <Stat label="Activities" value="0" />
        <View style={styles.statDivider} />
        <Stat label="Connections" value="0" />
        <View style={styles.statDivider} />
        <Stat label="Reviews" value="0" />
      </View>

      {/* ── Interests ── */}
      {user.interests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Interests</Text>
          <View style={styles.interestRow}>
            {user.interests.map((cat) => (
              <View
                key={cat}
                style={[
                  styles.interestChip,
                  { backgroundColor: `${INTEREST_COLOR[cat]}20`, borderColor: `${INTEREST_COLOR[cat]}40` },
                ]}
              >
                <Text style={[styles.interestText, { color: INTEREST_COLOR[cat] }]}>
                  {INTEREST_LABEL[cat]}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Menu ── */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={[styles.menuCard, shadows.card]}>
          <MenuItem icon="options-outline"           label="Activity preferences" tint={colors.primary}  onPress={() => router.push('/preferences')} />
          <MenuItem icon="notifications-outline"    label="Notifications"         tint={colors.accent}   onPress={() => router.push('/notification-settings')} />
          <MenuItem icon="location-outline"         label="Location & radius"     tint={colors.outdoors} onPress={() => router.push('/location-settings')} />
          <MenuItem icon="shield-checkmark-outline" label="Privacy & safety"      tint={colors.success}  onPress={() => router.push('/privacy')} />
          <MenuItem icon="help-circle-outline"      label="Help & support"                               onPress={() => router.push('/help')} />
        </View>
      </View>

      {/* ── Danger zone ── */}
      <Button
        label="Log Out"
        variant="danger"
        onPress={logout}
        loading={loading}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  screenTitle: { ...typography.title, color: colors.text },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Hero card
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  avatarWrap: { position: 'relative', marginBottom: spacing.sm },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryGlow,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.heading, color: colors.primary },
  onlineRing: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2.5,
    borderColor: colors.surface,
  },
  name:  { ...typography.heading, color: colors.text },
  email: { ...typography.body, color: colors.textSecondary },
  bio:   { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: `${colors.primary}50`,
    backgroundColor: colors.primaryGlow,
  },
  editBtnText: { ...typography.captionSemi, color: colors.primary },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat:       { flex: 1, alignItems: 'center', gap: 2 },
  statValue:  { ...typography.heading, color: colors.text },
  statLabel:  { ...typography.caption, color: colors.textMuted },
  statDivider:{ width: 1, backgroundColor: colors.border, marginVertical: spacing.xs },

  // Interests
  section: { marginBottom: spacing.md },
  sectionLabel: {
    ...typography.captionSemi,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  interestChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  interestText: { ...typography.captionSemi },

  // Menu
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuPressed: { backgroundColor: colors.surfaceAlt },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { ...typography.body, color: colors.text, flex: 1 },

  logoutBtn: { marginTop: spacing.sm, marginBottom: spacing.md },
});
