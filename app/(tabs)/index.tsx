import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { ACTIVITIES, CATEGORY_COLOR, Activity } from '@/data/activities';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { ActivityCategory } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_FILTER: { key: ActivityCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'gaming', label: '🎮 Gaming' },
  { key: 'sports', label: '⚽ Sports' },
  { key: 'fitness', label: '🏋️ Fitness' },
  { key: 'outdoors', label: '🥾 Outdoors' },
  { key: 'social', label: '🎲 Social' },
];

const CATEGORY_ICON: Record<ActivityCategory, keyof typeof Ionicons.glyphMap> = {
  gaming:   'game-controller',
  sports:   'football',
  fitness:  'barbell',
  outdoors: 'trail-sign',
  social:   'people',
};

// ─── Components ───────────────────────────────────────────────────────────────

function ActivityCard({ item }: { item: Activity }) {
  const catColor = CATEGORY_COLOR[item.category];
  const host = item.members.find((m) => m.role === 'host');
  const fillRatio = (item.totalSpots - item.spotsLeft) / item.totalSpots;
  const isAlmostFull = item.spotsLeft <= 2;

  return (
    <Pressable
      onPress={() => router.push(`/activity/${item.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed, shadows.card]}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, hosted by ${host?.name ?? ''}`}
    >
      {/* Category accent strip */}
      <View style={[styles.cardAccent, { backgroundColor: catColor }]} />

      <View style={styles.cardInner}>
        {/* Header row */}
        <View style={styles.cardHeader}>
          <View style={[styles.catChip, { backgroundColor: `${catColor}22` }]}>
            <Ionicons name={CATEGORY_ICON[item.category]} size={13} color={catColor} />
            <Text style={[styles.catChipText, { color: catColor }]}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
          {isAlmostFull && (
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyText}>🔥 {item.spotsLeft} left</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={13} color={colors.textMuted} />
          <Text style={styles.metaText}>{item.when}</Text>
          <View style={styles.dot} />
          <Ionicons
            name={item.isOnline ? 'globe-outline' : 'location-outline'}
            size={13}
            color={colors.textMuted}
          />
          <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          {/* Host */}
          <View style={styles.hostRow}>
            <View style={[styles.hostAvatar, { backgroundColor: `${catColor}33` }]}>
              <Text style={[styles.hostInitials, { color: catColor }]}>
                {host?.initials ?? '?'}
              </Text>
            </View>
            <Text style={styles.hostName}>{host?.name ?? ''}</Text>
          </View>

          {/* Spots progress */}
          <View style={styles.spotsGroup}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${fillRatio * 100}%` as `${number}%`,
                    backgroundColor: catColor,
                  },
                ]}
              />
            </View>
            {!isAlmostFull && (
              <Text style={styles.spotsText}>{item.spotsLeft} spots</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function CategoryPill({
  item,
  active,
  onPress,
}: {
  item: typeof CATEGORY_FILTER[0];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function FeedScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const firstName = user?.name.split(' ')[0] ?? 'there';
  const [activeFilter, setActiveFilter] = useState<ActivityCategory | 'all'>('all');

  const filtered = activeFilter === 'all'
    ? ACTIVITIES
    : ACTIVITIES.filter((a) => a.category === activeFilter);

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {firstName} 👋</Text>
          <Text style={styles.subtitle}>Find your next activity</Text>
        </View>
        <Pressable style={styles.notifBtn} accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      {/* ── Category filter pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
        style={styles.pillsScroll}
      >
        {CATEGORY_FILTER.map((item) => (
          <CategoryPill
            key={item.key}
            item={item}
            active={activeFilter === item.key}
            onPress={() => setActiveFilter(item.key)}
          />
        ))}
      </ScrollView>

      {/* ── Feed ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ActivityCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 100 },
        ]}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  greeting: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Pills
  pillsScroll: { flexGrow: 0, marginBottom: spacing.md },
  pillsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  pillText: { ...typography.captionSemi, color: colors.textSecondary },
  pillTextActive: { color: colors.primary },

  // List
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
  },
  cardPressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  cardAccent: {
    width: 4,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
  },
  cardInner: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  catChipText: { ...typography.micro, fontWeight: '600' },
  urgencyBadge: {
    backgroundColor: 'rgba(251,146,60,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  urgencyText: { ...typography.micro, color: colors.fitness, fontWeight: '700' },
  cardTitle: {
    ...typography.subheading,
    color: colors.text,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'nowrap',
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
    flexShrink: 1,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  hostRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostInitials: { ...typography.micro, fontWeight: '700' },
  hostName: { ...typography.caption, color: colors.textSecondary },
  spotsGroup: { alignItems: 'flex-end', gap: 4 },
  progressBg: {
    width: 64,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.pill },
  spotsText: { ...typography.micro, color: colors.textMuted },
});
