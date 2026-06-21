import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { ActivityCategory } from '@/types';

const CATEGORY_OPTIONS: {
  key: ActivityCategory;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}[] = [
  { key: 'gaming',   label: 'Gaming',   icon: 'game-controller',  color: colors.gaming,   description: 'Find teammates for online or local play' },
  { key: 'sports',   label: 'Sports',   icon: 'football',          color: colors.sports,   description: 'Organise matches, pickup games & training' },
  { key: 'fitness',  label: 'Fitness',  icon: 'barbell',           color: colors.fitness,  description: 'Gym sessions, classes & workout buddies' },
  { key: 'outdoors', label: 'Outdoors', icon: 'trail-sign',        color: colors.outdoors, description: 'Hikes, trail runs & cycling routes' },
  { key: 'social',   label: 'Social',   icon: 'people',            color: colors.social,   description: 'Meetups, board games & networking' },
];

export default function CreateScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Activity</Text>
        <Text style={styles.subtitle}>Choose a category to get started</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORY_OPTIONS.map((cat) => (
          <Pressable
            key={cat.key}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed,
              shadows.card,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Create ${cat.label} activity`}
          >
            <View style={[styles.iconWrap, { backgroundColor: `${cat.color}20` }]}>
              <Ionicons name={cat.icon} size={28} color={cat.color} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardLabel}>{cat.label}</Text>
              <Text style={styles.cardDesc}>{cat.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        ))}

        {/* Quick tips */}
        <View style={styles.tip}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.tipText}>
            Activities are visible to people near your location. You can set a radius and invite friends too.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title:    { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },

  content: { paddingHorizontal: spacing.lg, gap: spacing.sm },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardLabel: { ...typography.subheading, color: colors.text },
  cardDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },

  tip: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.primaryGlow,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  tipText: { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },
});
