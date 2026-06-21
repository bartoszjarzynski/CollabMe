import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { scheduleDemoNotifications } from '@/services/notificationService';
import { colors } from '@/theme';

/**
 * Routing guard: redirects between the (auth) and (tabs) groups based on
 * whether a user is signed in. Runs whenever auth state or the active
 * route segment changes.
 */
function RootNavigator() {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    if (initializing) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments, router]);

  // Schedule demo "matching activity" notifications after a successful login.
  // In production this would be replaced by a Supabase Realtime subscription.
  useEffect(() => {
    if (!user || user.interests.length === 0) return;
    scheduleDemoNotifications(user.interests);
  }, [user?.id]); // run once per login session

  // Handle notification taps (deep-link to activity detail when tapped)
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, string>;
      if (data?.eventId) {
        // Navigate to activity detail when one exists
        // router.push(`/activity/${data.eventId}`);
      }
    });
    return () => sub.remove();
  }, []);

  if (initializing) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      {/* Settings screens — slide in from the right with no tab bar */}
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="notification-settings" />
      <Stack.Screen name="location-settings" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="help" />
      {/* Activity detail — dynamic route */}
      <Stack.Screen name="activity/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
