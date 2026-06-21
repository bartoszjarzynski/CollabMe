import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text } from 'react-native';
import {
  SettingsRow,
  SettingsScreen,
  SettingsSection,
} from '@/components/SettingsScreen';
import { colors, spacing, typography } from '@/theme';

const STORAGE_KEY = 'collabme.privacy';

interface PrivacySettings {
  profileVisible: boolean;
  showLocation: boolean;
  showInSearch: boolean;
  activityHistoryVisible: boolean;
  allowDirectMessages: boolean;
}

const DEFAULTS: PrivacySettings = {
  profileVisible: true,
  showLocation: true,
  showInSearch: true,
  activityHistoryVisible: false,
  allowDirectMessages: true,
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.border, true: `${colors.primary}70` }}
      thumbColor={value ? colors.primary : colors.textMuted}
      ios_backgroundColor={colors.border}
    />
  );
}

export default function PrivacyScreen() {
  const [settings, setSettings] = useState<PrivacySettings>(DEFAULTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v) setSettings({ ...DEFAULTS, ...JSON.parse(v) });
    });
  }, []);

  async function update<K extends keyof PrivacySettings>(
    key: K,
    value: PrivacySettings[K],
  ) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <SettingsScreen title="Privacy & Safety">
      <SettingsSection label="Profile visibility">
        <SettingsRow
          icon="person-outline"
          iconColor={colors.primary}
          label="Public profile"
          rightElement={
            <Toggle value={settings.profileVisible} onChange={(v) => update('profileVisible', v)} />
          }
          last={false}
        />
        <SettingsRow
          icon="location-outline"
          iconColor={colors.outdoors}
          label="Show approximate location"
          rightElement={
            <Toggle value={settings.showLocation} onChange={(v) => update('showLocation', v)} />
          }
          last={false}
        />
        <SettingsRow
          icon="search-outline"
          iconColor={colors.accent}
          label="Appear in search results"
          rightElement={
            <Toggle value={settings.showInSearch} onChange={(v) => update('showInSearch', v)} />
          }
          last={false}
        />
        <SettingsRow
          icon="time-outline"
          iconColor={colors.textMuted}
          label="Show activity history"
          rightElement={
            <Toggle value={settings.activityHistoryVisible} onChange={(v) => update('activityHistoryVisible', v)} />
          }
          last
        />
      </SettingsSection>

      <SettingsSection label="Messaging">
        <SettingsRow
          icon="chatbubble-outline"
          iconColor={colors.social}
          label="Allow direct messages"
          rightElement={
            <Toggle value={settings.allowDirectMessages} onChange={(v) => update('allowDirectMessages', v)} />
          }
          last
        />
      </SettingsSection>

      <SettingsSection label="Account actions">
        <SettingsRow
          icon="download-outline"
          iconColor={colors.primary}
          label="Download my data"
          onPress={() => {}}
          last={false}
        />
        <SettingsRow
          icon="trash-outline"
          label="Delete account"
          onPress={() => {}}
          destructive
          last
        />
      </SettingsSection>

      <Text style={styles.footnote}>
        CollabMe never shares your personal data with third parties for advertising purposes. Location data is only used to show you nearby activities and is never stored without consent.
      </Text>
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  footnote: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
});
