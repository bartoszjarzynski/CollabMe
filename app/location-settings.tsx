import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SettingsScreen, SettingsSection } from '@/components/SettingsScreen';
import { colors, radius, spacing, typography } from '@/theme';

const RADIUS_OPTIONS = [
  { km: 1,  label: '1 km',  description: 'Walking distance' },
  { km: 5,  label: '5 km',  description: 'Short cycle or drive' },
  { km: 10, label: '10 km', description: 'City-wide' },
  { km: 25, label: '25 km', description: 'Greater area' },
  { km: 50, label: '50 km', description: 'Regional' },
];

const STORAGE_KEY = 'collabme.radius_km';

export default function LocationSettingsScreen() {
  const [selectedKm, setSelectedKm] = useState(10);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v) setSelectedKm(Number(v));
    });
  }, []);

  async function select(km: number) {
    setSelectedKm(km);
    await AsyncStorage.setItem(STORAGE_KEY, String(km));
  }

  return (
    <SettingsScreen title="Location & Radius">
      <Text style={styles.intro}>
        Set how far you want to discover activities. Only activities within this radius of your current location will appear in your feed and search results.
      </Text>

      <SettingsSection label="Discovery radius">
        {RADIUS_OPTIONS.map((opt, i) => {
          const active = selectedKm === opt.km;
          return (
            <Pressable
              key={opt.km}
              onPress={() => select(opt.km)}
              style={({ pressed }) => [
                styles.row,
                i < RADIUS_OPTIONS.length - 1 && styles.rowBorder,
                pressed && styles.pressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{opt.label}</Text>
                <Text style={styles.rowDesc}>{opt.description}</Text>
              </View>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </SettingsSection>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          📍 Precise location is only used locally to filter activity results. It is never stored on our servers without your explicit consent.
        </Text>
      </View>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { backgroundColor: colors.surfaceAlt },
  rowText: { flex: 1 },
  rowLabel: { ...typography.bodySemi, color: colors.text },
  rowDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  note: {
    backgroundColor: colors.primaryGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  noteText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
