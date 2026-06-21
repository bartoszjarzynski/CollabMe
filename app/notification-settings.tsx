import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import {
  SettingsRow,
  SettingsScreen,
  SettingsSection,
} from '@/components/SettingsScreen';
import {
  DEFAULT_PREFS,
  NotificationPreferences,
  getNotificationPrefs,
  requestPermissions,
  saveNotificationPrefs,
} from '@/services/notificationService';
import { colors, spacing, typography } from '@/theme';

function PrefToggle({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: colors.border, true: `${colors.primary}70` }}
      thumbColor={value ? colors.primary : colors.textMuted}
      ios_backgroundColor={colors.border}
    />
  );
}

export default function NotificationSettingsScreen() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getNotificationPrefs();
      setPrefs(saved);

      // Check current permission status without prompting
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionGranted(status === 'granted');
      setLoaded(true);
    })();
  }, []);

  async function updatePref<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ) {
    // If enabling any notification and permission is not granted, request it
    if (value === true && !permissionGranted) {
      const granted = await requestPermissions();
      setPermissionGranted(granted);
      if (!granted) {
        Alert.alert(
          'Permission required',
          'Enable notifications in Settings → CollabMe to receive alerts.',
        );
        return;
      }
    }

    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await saveNotificationPrefs(updated);
  }

  if (!loaded) return null;

  return (
    <SettingsScreen title="Notifications">
      {/* Permission banner */}
      {permissionGranted === false && (
        <View style={styles.banner}>
          <Ionicons name="notifications-off-outline" size={20} color={colors.warning} />
          <Text style={styles.bannerText}>
            Notifications are disabled for this app. Enable them in your device Settings to receive alerts.
          </Text>
        </View>
      )}

      <SettingsSection label="Activity Alerts">
        <SettingsRow
          icon="time-outline"
          iconColor={colors.primary}
          label="Event reminders"
          rightElement={
            <PrefToggle
              value={prefs.eventReminders}
              onValueChange={(v) => updatePref('eventReminders', v)}
            />
          }
          last={false}
        />
        <SettingsRow
          icon="star-outline"
          iconColor={colors.gaming}
          label="Matching activities"
          rightElement={
            <PrefToggle
              value={prefs.matchingActivities}
              onValueChange={(v) => updatePref('matchingActivities', v)}
            />
          }
          last={false}
        />
        <SettingsRow
          icon="flame-outline"
          iconColor={colors.fitness}
          label="Spot alerts"
          rightElement={
            <PrefToggle
              value={prefs.spotAlerts}
              onValueChange={(v) => updatePref('spotAlerts', v)}
            />
          }
          last
        />
      </SettingsSection>

      <SettingsSection label="Social">
        <SettingsRow
          icon="chatbubble-outline"
          iconColor={colors.social}
          label="New messages"
          rightElement={
            <PrefToggle
              value={prefs.messages}
              onValueChange={(v) => updatePref('messages', v)}
            />
          }
          last={false}
        />
        <SettingsRow
          icon="newspaper-outline"
          iconColor={colors.accent}
          label="Weekly digest"
          rightElement={
            <PrefToggle
              value={prefs.weeklyDigest}
              onValueChange={(v) => updatePref('weeklyDigest', v)}
            />
          }
          last
        />
      </SettingsSection>

      <Text style={styles.footnote}>
        Reminder timings: 1 hour before and 15 minutes before an event starts. Matching-activity alerts fire when a new event in one of your preferred categories is posted nearby.
      </Text>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: `${colors.warning}18`,
    borderWidth: 1,
    borderColor: `${colors.warning}40`,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  bannerText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
    lineHeight: 18,
  },
  footnote: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
});
