import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { ActivityCategory } from '@/types';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface CategoryItem {
  key: ActivityCategory;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  count: number;
}

const CATEGORIES: CategoryItem[] = [
  {
    key: 'gaming',
    label: 'Gaming',
    description: 'Find teammates & squads',
    icon: 'game-controller',
    color: colors.gaming,
    count: 24,
  },
  {
    key: 'sports',
    label: 'Sports',
    description: 'Pickup games & matches',
    icon: 'football',
    color: colors.sports,
    count: 18,
  },
  {
    key: 'fitness',
    label: 'Fitness',
    description: 'Gym buddies & classes',
    icon: 'barbell',
    color: colors.fitness,
    count: 31,
  },
  {
    key: 'outdoors',
    label: 'Outdoors',
    description: 'Hikes, runs & rides',
    icon: 'trail-sign',
    color: colors.outdoors,
    count: 12,
  },
  {
    key: 'social',
    label: 'Social',
    description: 'Meetups & hangouts',
    icon: 'people',
    color: colors.social,
    count: 9,
  },
];

const TRENDING = [
  { id: 't1', label: 'Running clubs', icon: 'walk-outline' },
  { id: 't2', label: 'Chess & board games', icon: 'extension-puzzle-outline' },
  { id: 't3', label: 'Climbing gyms', icon: 'fitness-outline' },
  { id: 't4', label: 'Valorant ranked', icon: 'game-controller-outline' },
];

// ─── Components ───────────────────────────────────────────────────────────────

function CategoryCard({ item }: { item: CategoryItem }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.catCard, pressed && styles.pressed, shadows.card]}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${item.label}`}
    >
      {/* Colour wash background */}
      <View style={[styles.catCardBg, { backgroundColor: `${item.color}18` }]} />

      <View style={[styles.catIcon, { backgroundColor: `${item.color}25` }]}>
        <Ionicons name={item.icon} size={26} color={item.color} />
      </View>
      <Text style={styles.catLabel}>{item.label}</Text>
      <Text style={styles.catDesc} numberOfLines={1}>{item.description}</Text>
      <View style={styles.catFooter}>
        <Text style={[styles.catCount, { color: item.color }]}>
          {item.count} activities
        </Text>
        <Ionicons name="chevron-forward" size={14} color={item.color} />
      </View>
    </Pressable>
  );
}

function TrendingPill({ item }: { item: typeof TRENDING[0] }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.trendPill, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={15} color={colors.primary} />
      <Text style={styles.trendText}>{item.label}</Text>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ── */}
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Discover activities near you</Text>

      {/* ── Search bar ── */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities, people, places…"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {/* ── Trending searches ── */}
      <Text style={styles.sectionLabel}>Trending now</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendRow}
      >
        {TRENDING.map((t) => <TrendingPill key={t.id} item={t} />)}
      </ScrollView>

      {/* ── Categories grid ── */}
      <Text style={styles.sectionLabel}>Browse by category</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.key} item={cat} />
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  title:    { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 50,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },

  // Section labels
  sectionLabel: {
    ...typography.captionSemi,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },

  // Trending
  trendRow: { gap: spacing.sm, paddingBottom: spacing.lg },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  trendText: { ...typography.captionSemi, color: colors.primary },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  catCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    gap: 4,
  },
  catCardBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  catIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  catLabel: { ...typography.subheading, color: colors.text },
  catDesc: { ...typography.caption, color: colors.textSecondary },
  catFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  catCount: { ...typography.captionSemi },
});
