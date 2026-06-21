import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
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

const RECENT: string[] = ['Valorant squad', 'Sunday football', 'Bouldering beginner'];

const SUGGESTIONS = [
  { id: 's1', title: 'Chess evening — café meetup', category: 'social', when: 'Wed 7 PM' },
  { id: 's2', title: 'Morning yoga in the park', category: 'fitness', when: 'Sat 9 AM' },
  { id: 's3', title: 'Cycling group — 30km route', category: 'outdoors', when: 'Sun 8 AM' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* ── Search bar ── */}
      <View style={styles.headerRow}>
        <View style={[styles.searchBar, shadows.card]}>
          <Ionicons name="search" size={20} color={colors.primary} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search activities, people…"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Recent searches ── */}
        {query.length === 0 && (
          <>
            <Text style={styles.sectionLabel}>Recent</Text>
            {RECENT.map((term) => (
              <Pressable
                key={term}
                style={styles.recentRow}
                onPress={() => setQuery(term)}
              >
                <View style={styles.recentIcon}>
                  <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                </View>
                <Text style={styles.recentText}>{term}</Text>
                <Ionicons name="arrow-up-outline" size={16} color={colors.textMuted} style={{ transform: [{ rotate: '45deg' }] }} />
              </Pressable>
            ))}

            <View style={styles.divider} />

            {/* ── People nearby ── */}
            <Text style={styles.sectionLabel}>Activities near you</Text>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s.id} style={[styles.suggestionCard, shadows.card]}>
                <View style={styles.suggestionLeft}>
                  <Text style={styles.suggestionTitle}>{s.title}</Text>
                  <Text style={styles.suggestionMeta}>
                    {s.category} · {s.when}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </>
        )}

        {/* ── No-results state ── */}
        {query.length > 0 && (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>No results for "{query}"</Text>
            <Text style={styles.emptySubtitle}>
              Try a different keyword or browse categories
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderFocus,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },

  content: { paddingHorizontal: spacing.lg },

  sectionLabel: {
    ...typography.captionSemi,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: { ...typography.body, color: colors.text, flex: 1 },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },

  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionLeft: { flex: 1 },
  suggestionTitle: { ...typography.bodySemi, color: colors.text },
  suggestionMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: { ...typography.subheading, color: colors.text, marginTop: spacing.md },
  emptySubtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});
