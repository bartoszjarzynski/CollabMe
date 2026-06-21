import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { SettingsScreen } from '@/components/SettingsScreen';
import { TextField } from '@/components/TextField';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/theme';

export default function EditProfileScreen() {
  const { user, updateProfile, loading } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [bio,  setBio]  = useState(user?.bio  ?? '');
  const [nameError, setNameError] = useState<string | undefined>();

  // Keep fields in sync if user object updates (e.g. after a save)
  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio ?? '');
    }
  }, [user]);

  const isDirty =
    name.trim() !== (user?.name ?? '') ||
    bio.trim()  !== (user?.bio  ?? '');

  async function handleSave() {
    if (!name.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }
    setNameError(undefined);

    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() || undefined });
      router.back();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save changes.');
    }
  }

  return (
    <SettingsScreen title="Edit Profile">
      {/* Avatar placeholder */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {name.trim()
              ? name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
              : '?'}
          </Text>
        </View>
        <Text style={styles.avatarHint}>
          Avatar upload coming soon
        </Text>
      </View>

      <View style={styles.form}>
        <TextField
          label="Display name"
          value={name}
          onChangeText={setName}
          error={nameError}
          placeholder="Your name"
          autoCapitalize="words"
          textContentType="name"
          maxLength={50}
        />
        <TextField
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell people what you're into…"
          autoCapitalize="sentences"
          multiline
          numberOfLines={3}
          maxLength={200}
          style={styles.bioInput}
        />
        <Text style={styles.charCount}>{bio.length}/200</Text>
      </View>

      <Button
        label="Save changes"
        onPress={handleSave}
        loading={loading}
        disabled={!isDirty}
        style={styles.saveBtn}
      />
    </SettingsScreen>
  );
}

const styles = StyleSheet.create({
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryGlow,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.heading, color: colors.primary },
  avatarHint: { ...typography.caption, color: colors.textMuted },
  form: { gap: spacing.xs },
  bioInput: { height: 88, textAlignVertical: 'top', paddingTop: 14 },
  charCount: {
    ...typography.micro,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: -spacing.sm,
  },
  saveBtn: { marginTop: spacing.xl },
});
