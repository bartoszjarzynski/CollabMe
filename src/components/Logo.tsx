import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

interface LogoProps {
  withWordmark?: boolean;
  size?: number;
}

export function Logo({ withWordmark = true, size = 44 }: LogoProps) {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.mark,
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
          },
        ]}
      >
        {/* Two-letter mark communicates "connection" between people */}
        <Text style={[styles.markText, { fontSize: size * 0.42 }]}>CM</Text>
      </View>
      {withWordmark && (
        <View>
          <Text style={styles.wordmark}>Collab</Text>
          <Text style={[styles.wordmark, styles.wordmarkAccent]}>Me</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mark: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: colors.textInverse,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  wordmark: {
    ...typography.heading,
    color: colors.text,
    lineHeight: 22,
  },
  wordmarkAccent: {
    color: colors.primary,
    lineHeight: 22,
  },
});
