import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { SettingsScreen } from '@/components/SettingsScreen';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/theme';
import type { ActivityCategory } from '@/types';

const ALL_CATEGORIES: {
  key: ActivityCategory;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { key: 'gaming',   label: 'Gaming',   description: 'Video games, esports, LAN parties', icon: 'game-controller', color: colors.gaming },
  { key: 'sports',   label: 'Sports',   description: 'Football, basketball, tennis & more', icon: 'football',        color: colors.sports },
  { key: 'fitness',  label: 'Fitness',  description: 'Gym, yoga, CrossFit, running',        icon: 'barbell',          color: colors.fitness },
  { key: 'outdoors', label: 'Outdoors', description: 'Hiking, cycling, climbing, camping',  icon: 'trail-sign',       color: colors.outdoors },
  { key: 'social',   label: 'Social',   description: 'Board games, meetups, book clubs',    icon: 'people',           color: colors.social },
];

export default function PreferencesScreen() {
  const { user, updateProfile, loading } = useAuth();
  const [selected, setSelected] = useState<Set<ActivityCategory>>(
    new Set(user?.interests ?? []),
  );

  function toggle(cat: ActivityCategory) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const isDirty =
    JSON.stringify([...selected].sort()) !==
    JSON.stringify([...(user?.interests ?? [])].sort());

  async function handleSave() {
    if (selected.size === 0) {
      Alert.alert('Pick at least one interest', 'We use this to show you relevant activities.');
      return;
    }
    try {
      await updateProfile({ interests: [...selected] });
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save preferences.');
    }
  }

  return (
    <SettingsScreen title="Activity Preferences">
      <Text style={styles.hint}>
        Select the types of activities you enjoy. We'll use this to surface relevant events and send you tailored notifications.
      </Text>

      <View style={styles.list}>
        {ALL_CATEGORIES.map((cat) => {
          const active = selected.has(cat.key);
          return (
            <Pressable
              key={cat.key}
              onPress={() => toggle(cat.key)}
              style={({ pressed }) => [
                styles.row,
                active && styles.rowActive,
                { borderColor: active ? `${cat.color}60` : colors.border },
                pressed && styles.pressed,
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: active }}
              accessibilityLabel={cat.label}
            >
              <View style={[styles.icon, { backgroundColor: `${cat.color}${active ? '30' : '18'}` }]}>
                <Ionicons name={cat.icon} size={22} color={cat.color} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{cat.label}</Text>
                <Text style={styles.rowDesc}>{cat.description}</Text>
              </View>
              <View style={[
                styles.check,
                active
                  ? { backgroundColor: cat.color, borderColor: cat.color }
                  : { borderColor: colors.border },
              ]}>
                {active && <Ionicons name="checkmark" size={14} color={colors.textInverse} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Button
        label="Save preferences"
        onPress={handleSave}
        loading={loading}
        disabled={!isDirty}
        style={styles.saveBtn}
      />
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  hint: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  list: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  rowActive: { backgroundColor: colors.surfaceAlt },
  pressed: { opacity: 0.82 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { ...typography.bodySemi, color: colors.text },
  rowDesc:  { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: { marginTop: spacing.xl, marginBottom: spacing.md },
});
