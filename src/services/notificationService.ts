/**
 * Notification Service
 *
 * Handles all local push notifications:
 *  - Permission request / channel setup
 *  - Event-start reminders (1 h and 15 min before)
 *  - "Matching activity" alerts when a new event fits the user's interests
 *  - Spot-filling-up alerts
 *
 * In production these would be driven by Supabase Realtime or a server-side
 * push service. Here we use scheduled local notifications to demonstrate the
 * full UX without a backend.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { ActivityCategory } from '@/types';

// ─── Notification handler (must be called before any notification fires) ──────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Preferences ──────────────────────────────────────────────────────────────

export interface NotificationPreferences {
  eventReminders: boolean;        // "Activity starts in 1 hour"
  matchingActivities: boolean;    // "New activity matching your interests"
  spotAlerts: boolean;            // "Only 2 spots left in an activity you saved"
  messages: boolean;              // In-app chat messages
  weeklyDigest: boolean;          // Weekly summary of nearby activity
}

export const DEFAULT_PREFS: NotificationPreferences = {
  eventReminders: true,
  matchingActivities: true,
  spotAlerts: true,
  messages: true,
  weeklyDigest: false,
};

const PREFS_KEY = 'collabme.notif_prefs';

export async function getNotificationPrefs(): Promise<NotificationPreferences> {
  try {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export async function saveNotificationPrefs(
  prefs: NotificationPreferences,
): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

// ─── Permission ───────────────────────────────────────────────────────────────

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('collabme', {
      name: 'CollabMe',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#5B8AF8',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─── Event reminders ──────────────────────────────────────────────────────────

/**
 * Schedule two reminders for an event the user joined:
 *   1 hour before  → gentle heads-up
 *   15 min before  → urgent reminder
 *
 * Returns the scheduled notification IDs so they can be cancelled on leave.
 */
export async function scheduleEventReminders(params: {
  eventId: string;
  title: string;
  location: string;
  startTime: Date;
}): Promise<string[]> {
  const prefs = await getNotificationPrefs();
  if (!prefs.eventReminders) return [];

  const granted = await requestPermissions();
  if (!granted) return [];

  const ids: string[] = [];
  const now = Date.now();

  const oneHour = new Date(params.startTime.getTime() - 60 * 60 * 1000);
  if (oneHour.getTime() > now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ Starting in 1 hour',
        body: `${params.title} — ${params.location}`,
        data: { eventId: params.eventId, type: 'reminder_1h' },
      },
      trigger: { date: oneHour, channelId: 'collabme' },
    });
    ids.push(id);
  }

  const fifteenMin = new Date(params.startTime.getTime() - 15 * 60 * 1000);
  if (fifteenMin.getTime() > now) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 Starting in 15 minutes!',
        body: `Get ready — ${params.title} is about to begin.`,
        data: { eventId: params.eventId, type: 'reminder_15m' },
      },
      trigger: { date: fifteenMin, channelId: 'collabme' },
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelEventReminders(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

// ─── "You might like this" notifications ──────────────────────────────────────

/**
 * Fires a notification when a new activity is posted that matches at least one
 * of the user's interest categories.
 *
 * In a real app this would be triggered by a Supabase Realtime INSERT on the
 * `activities` table, filtered server-side to the user's interests.
 * Here we fire it as a local scheduled notification after `delaySeconds`.
 */
export async function notifyMatchingActivity(params: {
  title: string;
  category: ActivityCategory;
  location: string;
  spotsLeft: number;
  delaySeconds?: number;
}): Promise<void> {
  const prefs = await getNotificationPrefs();
  if (!prefs.matchingActivities) return;

  const granted = await requestPermissions();
  if (!granted) return;

  const CATEGORY_EMOJI: Record<ActivityCategory, string> = {
    gaming:   '🎮',
    sports:   '⚽',
    fitness:  '🏋️',
    outdoors: '🥾',
    social:   '🎲',
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${CATEGORY_EMOJI[params.category]} New activity for you`,
      body: `${params.title} • ${params.location} • ${params.spotsLeft} spots left`,
      data: { type: 'matching_activity', category: params.category },
    },
    trigger: {
      seconds: params.delaySeconds ?? 5,
      channelId: 'collabme',
    },
  });
}

// ─── Spot alert ───────────────────────────────────────────────────────────────

/**
 * Fires immediately when spots in a saved activity drop to ≤ threshold.
 */
export async function notifySpotAlert(params: {
  eventId: string;
  title: string;
  spotsLeft: number;
}): Promise<void> {
  const prefs = await getNotificationPrefs();
  if (!prefs.spotAlerts) return;

  const granted = await requestPermissions();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Filling up fast!',
      body: `Only ${params.spotsLeft} spot${params.spotsLeft === 1 ? '' : 's'} left in "${params.title}"`,
      data: { eventId: params.eventId, type: 'spot_alert' },
    },
    trigger: null, // fire immediately
  });
}

// ─── Demo helper ──────────────────────────────────────────────────────────────

/**
 * Called once after login to demonstrate the "matching activity" flow.
 * Schedules a notification for each of the user's interest categories after
 * a short, staggered delay — mimicking what a real Supabase Realtime listener
 * would do when new events are inserted.
 */
export async function scheduleDemoNotifications(
  interests: ActivityCategory[],
): Promise<void> {
  const prefs = await getNotificationPrefs();
  if (!prefs.matchingActivities) return;

  const DEMO_EVENTS: Partial<Record<ActivityCategory, { title: string; location: string; spots: number }>> = {
    gaming:   { title: 'CS2 — ranked 5v5, 1 slot open', location: 'Online',            spots: 1 },
    sports:   { title: 'Sunday basketball 3-on-3',       location: 'City Sports Hall',  spots: 3 },
    fitness:  { title: 'Morning CrossFit — all levels',  location: 'FitZone Gym',       spots: 5 },
    outdoors: { title: 'Sunrise hike — 12 km trail',     location: 'Beskidy Mountains', spots: 4 },
    social:   { title: 'Escape room night — 6 players',  location: 'Mystery Rooms',     spots: 2 },
  };

  for (let i = 0; i < interests.length; i++) {
    const cat = interests[i];
    const demo = DEMO_EVENTS[cat];
    if (!demo) continue;

    // Stagger by 20 s each so they don't all arrive at once
    await notifyMatchingActivity({
      title: demo.title,
      category: cat,
      location: demo.location,
      spotsLeft: demo.spots,
      delaySeconds: 20 + i * 20,
    });
  }
}
