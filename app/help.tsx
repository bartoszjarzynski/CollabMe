import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SettingsRow, SettingsScreen, SettingsSection } from '@/components/SettingsScreen';
import { colors, radius, spacing, typography } from '@/theme';

const FAQ: { q: string; a: string }[] = [
  {
    q: 'How do I join an activity?',
    a: 'Tap any activity card on the Discover or Explore screen, then press "Join activity". The host will be notified and you\'ll receive a confirmation.',
  },
  {
    q: 'How does the matching algorithm work?',
    a: 'We surface activities that match your selected interest categories, are within your discovery radius, and have available spots. You can tune both in Settings.',
  },
  {
    q: 'When will I get reminders?',
    a: 'Once you join an activity, we\'ll send you a reminder 1 hour before and again 15 minutes before it starts — as long as you have notifications enabled.',
  },
  {
    q: 'Can I cancel my spot?',
    a: 'Yes. Open the activity detail, tap "Leave activity". Cancellations made less than 2 hours before the start are flagged to the host.',
  },
  {
    q: 'How do I create an activity?',
    a: 'Tap the + button in the centre of the navigation bar, choose a category, fill in the details (title, time, location, spots), and publish.',
  },
  {
    q: 'Is my location data private?',
    a: 'Location is used locally to filter nearby activities. We never store your exact coordinates on our servers. You can disable location sharing in Privacy & Safety.',
  },
];

function FaqItem({ item }: { item: typeof FAQ[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable
      onPress={() => setOpen((o) => !o)}
      style={({ pressed }) => [styles.faqRow, pressed && styles.faqPressed]}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQ}>{item.q}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </View>
      {open && <Text style={styles.faqA}>{item.a}</Text>}
    </Pressable>
  );
}

export default function HelpScreen() {
  return (
    <SettingsScreen title="Help & Support">
      <SettingsSection label="Contact us">
        <SettingsRow
          icon="mail-outline"
          iconColor={colors.primary}
          label="Email support"
          value="support@collabme.app"
          onPress={() => {}}
          last={false}
        />
        <SettingsRow
          icon="logo-discord"
          iconColor={colors.gaming}
          label="Join our Discord"
          onPress={() => {}}
          last={false}
        />
        <SettingsRow
          icon="bug-outline"
          iconColor={colors.warning}
          label="Report a bug"
          onPress={() => {}}
          last
        />
      </SettingsSection>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={styles.faqSectionLabel}>FAQ</Text>
        <View style={styles.faqCard}>
          {FAQ.map((item, i) => (
            <View key={i} style={i < FAQ.length - 1 && styles.faqDivider}>
              <FaqItem item={item} />
            </View>
          ))}
        </View>
      </View>

      <SettingsSection label="Legal">
        <SettingsRow icon="document-text-outline" label="Terms of Service" onPress={() => {}} last={false} />
        <SettingsRow icon="shield-outline"        label="Privacy Policy"   onPress={() => {}} last={false} />
        <SettingsRow icon="information-circle-outline" label={`Version 0.1.0`} last />
      </SettingsSection>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  faqSection: { marginTop: spacing.lg },
  faqSectionLabel: {
    ...typography.captionSemi,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  faqDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  faqRow: { padding: spacing.md },
  faqPressed: { backgroundColor: colors.surfaceAlt },
  faqHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  faqQ: { ...typography.bodySemi, color: colors.text, flex: 1, lineHeight: 21 },
  faqA: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
