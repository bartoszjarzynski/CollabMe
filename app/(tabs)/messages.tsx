import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing, typography } from '@/theme';

interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  activity: string;
}

const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Marta K.',
    initials: 'MK',
    avatarColor: colors.gaming,
    lastMessage: 'Are you ready for tonight? Lobby opens at 7:45',
    time: '8:12 PM',
    unread: 2,
    activity: 'Valorant squad',
  },
  {
    id: '2',
    name: 'Football Group',
    initials: '⚽',
    avatarColor: colors.sports,
    lastMessage: 'Kuba: See you all Saturday morning!',
    time: 'Yesterday',
    unread: 0,
    activity: '5-a-side football',
  },
  {
    id: '3',
    name: 'Ola W.',
    initials: 'OW',
    avatarColor: colors.fitness,
    lastMessage: 'I can book us a lane for Sunday if you want',
    time: 'Mon',
    unread: 0,
    activity: 'Bouldering session',
  },
];

function ConversationRow({ item }: { item: Conversation }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Conversation with ${item.name}`}
    >
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: `${item.avatarColor}30` }]}>
        <Text style={[styles.avatarText, { color: item.avatarColor }]}>
          {item.initials}
        </Text>
        {item.unread > 0 && <View style={styles.unreadDot} />}
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <View style={styles.rowTop}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.activity} numberOfLines={1}>
          {item.activity}
        </Text>
        <Text
          style={[styles.lastMsg, item.unread > 0 && styles.lastMsgUnread]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Unread badge */}
      {item.unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Pressable style={styles.newBtn} accessibilityLabel="New message">
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {CONVERSATIONS.length > 0 ? (
          CONVERSATIONS.map((c) => <ConversationRow key={c.id} item={c} />)
        ) : (
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={52} color={colors.border} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptySubtitle}>
              Join an activity to start chatting with other participants
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: { ...typography.title, color: colors.text },
  newBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  content: { paddingHorizontal: spacing.lg },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pressed: { opacity: 0.7 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: { ...typography.subheading, fontWeight: '700' },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
  },
  rowContent: { flex: 1 },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { ...typography.bodySemi, color: colors.text },
  time: { ...typography.caption, color: colors.textMuted },
  activity: { ...typography.micro, color: colors.primary, marginTop: 1 },
  lastMsg: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  lastMsgUnread: { color: colors.text, fontWeight: '600' },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { ...typography.micro, color: colors.textInverse, fontWeight: '700' },

  empty: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: { ...typography.subheading, color: colors.text, marginTop: spacing.md },
  emptySubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
