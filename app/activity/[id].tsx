import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import {
  ACTIVITIES,
  CATEGORY_COLOR,
  CATEGORY_ICON_NAME,
  Member,
  getActivityById,
} from '@/data/activities';
import { scheduleEventReminders } from '@/services/notificationService';
import { colors, radius, shadows, spacing, typography } from '@/theme';

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({
  member,
  size = 44,
  showRing = false,
}: {
  member: Member;
  size?: number;
  showRing?: boolean;
}) {
  return (
    <View
      style={[
        avatarStyles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${member.avatarColor}28`,
          borderWidth: showRing ? 2 : 0,
          borderColor: member.avatarColor,
        },
      ]}
    >
      {member.role === 'host' && (
        <View style={avatarStyles.hostBadge}>
          <Ionicons name="star" size={8} color={colors.textInverse} />
        </View>
      )}
      <Text style={[avatarStyles.initials, { fontSize: size * 0.33, color: member.avatarColor }]}>
        {member.initials}
      </Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  initials: { fontWeight: '700' },
  hostBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.background,
    zIndex: 1,
  },
});

// ─── Stars ────────────────────────────────────────────────────────────────────

function StarRating({ value }: { value: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={value >= i ? 'star' : 'star-outline'}
          size={11}
          color={colors.warning}
        />
      ))}
      <Text style={starStyles.label}>{value.toFixed(1)}</Text>
    </View>
  );
}

const starStyles = StyleSheet.create({
  label: { ...typography.micro, color: colors.textMuted, marginLeft: 3 },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const activity = getActivityById(id);

  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);

  const catColor = activity ? CATEGORY_COLOR[activity.category] : colors.primary;
  const host = activity?.members.find((m) => m.role === 'host');
  const otherMembers = activity?.members.filter((m) => m.role === 'member') ?? [];

  // ── Derived state ──
  const displayedSpots = joined ? activity!.spotsLeft - 1 : activity!.spotsLeft;
  const joinedMembers = joined && user
    ? [
        ...(activity?.members ?? []),
        {
          id: 'me',
          name: user.name,
          initials: user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
          avatarColor: catColor,
          activitiesCount: 0,
          rating: 5,
          role: 'member' as const,
        },
      ]
    : activity?.members ?? [];

  const handleJoin = useCallback(async () => {
    if (joined) {
      Alert.alert('Leave activity?', 'You will lose your spot.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => setJoined(false),
        },
      ]);
      return;
    }

    if (!activity) return;
    setJoinLoading(true);
    // Simulate network request
    await new Promise<void>((r) => setTimeout(r, 800));

    try {
      await scheduleEventReminders({
        eventId: activity.id,
        title: activity.title,
        location: activity.location,
        startTime: new Date(activity.isoDate),
      });
    } catch {
      // Notifications may not be granted — join still succeeds
    }

    setJoined(true);
    setJoinLoading(false);
  }, [joined, activity]);

  const handleShare = useCallback(async () => {
    if (!activity) return;
    await Share.share({
      title: activity.title,
      message: `Join me for: ${activity.title} — ${activity.when} at ${activity.location}. Find it on CollabMe!`,
    });
  }, [activity]);

  if (!activity) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.border} />
        <Text style={styles.notFoundText}>Activity not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const filledSpots = activity.totalSpots - displayedSpots;
  const fillRatio = filledSpots / activity.totalSpots;
  const isAlmostFull = displayedSpots <= 2;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* ── Hero ── */}
        <View style={[styles.hero, { backgroundColor: `${catColor}22` }]}>
          {/* Category icon */}
          <View style={[styles.heroCatIcon, { backgroundColor: `${catColor}30` }]}>
            <Ionicons
              name={CATEGORY_ICON_NAME[activity.category] as keyof typeof Ionicons.glyphMap}
              size={56}
              color={catColor}
            />
          </View>

          {/* Category badge */}
          <View style={[styles.catBadge, { backgroundColor: `${catColor}30`, borderColor: `${catColor}50` }]}>
            <Text style={[styles.catBadgeText, { color: catColor }]}>
              {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* ── Main card (overlapping hero) ── */}
        <View style={styles.mainCard}>
          {/* Title + urgency row */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{activity.title}</Text>
            {isAlmostFull && (
              <View style={styles.urgencyPill}>
                <Text style={styles.urgencyText}>🔥 {displayedSpots} left</Text>
              </View>
            )}
          </View>

          {/* Quick meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={13} color={colors.textMuted} />
              <Text style={styles.metaChipText}>{activity.when}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons
                name={activity.isOnline ? 'globe-outline' : 'location-outline'}
                size={13}
                color={colors.textMuted}
              />
              <Text style={styles.metaChipText} numberOfLines={1}>{activity.location}</Text>
            </View>
          </View>

          {/* Spots progress bar */}
          <View style={styles.spotsRow}>
            <Text style={styles.spotsLabel}>
              {filledSpots}/{activity.totalSpots} joined
            </Text>
            <Text style={[styles.spotsLeft, isAlmostFull && { color: colors.fitness }]}>
              {displayedSpots} spot{displayedSpots !== 1 ? 's' : ''} left
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${fillRatio * 100}%` as `${number}%`, backgroundColor: catColor },
              ]}
            />
          </View>
        </View>

        {/* ── Description ── */}
        <Section title="About this activity">
          <Text style={styles.description}>{activity.description}</Text>
        </Section>

        {/* ── Members ── */}
        <Section title={`Who's joining (${joinedMembers.length}/${activity.totalSpots})`}>
          {/* Avatar row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarRow}
          >
            {joinedMembers.map((m) => (
              <View key={m.id} style={styles.avatarCell}>
                <Avatar member={m} size={52} showRing={m.role === 'host'} />
                <Text style={styles.avatarName} numberOfLines={1}>
                  {m.name.split(' ')[0]}
                  {m.role === 'host' ? ' ★' : ''}
                </Text>
              </View>
            ))}
            {/* Empty slot placeholders */}
            {Array.from({ length: displayedSpots }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.avatarCell}>
                <View style={[styles.emptySlot, { borderColor: catColor }]}>
                  <Ionicons name="add" size={22} color={catColor} />
                </View>
                <Text style={[styles.avatarName, { color: catColor }]}>Open</Text>
              </View>
            ))}
          </ScrollView>

          {/* Member list */}
          <View style={styles.memberList}>
            {joinedMembers.map((m, i) => (
              <View
                key={m.id}
                style={[
                  styles.memberRow,
                  i < joinedMembers.length - 1 && styles.memberRowBorder,
                ]}
              >
                <Avatar member={m} size={40} showRing={m.role === 'host'} />
                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{m.name}</Text>
                    {m.role === 'host' && (
                      <View style={styles.hostTag}>
                        <Text style={styles.hostTagText}>Host</Text>
                      </View>
                    )}
                  </View>
                  <StarRating value={m.rating} />
                </View>
                <Text style={styles.memberActivities}>{m.activitiesCount} activities</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* ── Event details ── */}
        <Section title="Event details">
          <DetailRow icon="calendar-outline" label="Date & time"  value={activity.when} />
          <DetailRow
            icon={activity.isOnline ? 'globe-outline' : 'location-outline'}
            label="Location"
            value={activity.locationDetail}
          />
          <DetailRow
            icon="people-outline"
            label="Group size"
            value={`${activity.totalSpots} people max`}
          />
          {activity.requirements && (
            <DetailRow
              icon="checkmark-circle-outline"
              label="Requirements"
              value={activity.requirements}
              last
            />
          )}
        </Section>

        {/* ── Tags ── */}
        {activity.tags.length > 0 && (
          <Section title="Tags">
            <View style={styles.tagsWrap}>
              {activity.tags.map((tag) => (
                <View key={tag} style={[styles.tag, { borderColor: `${catColor}50`, backgroundColor: `${catColor}12` }]}>
                  <Text style={[styles.tagText, { color: catColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* ── Host card ── */}
        {host && (
          <Section title="Hosted by">
            <View style={styles.hostCard}>
              <Avatar member={host} size={56} showRing />
              <View style={styles.hostCardInfo}>
                <Text style={styles.hostCardName}>{host.name}</Text>
                <StarRating value={host.rating} />
                <Text style={styles.hostCardActivities}>
                  {host.activitiesCount} activities hosted
                </Text>
              </View>
              <Pressable style={[styles.msgBtn, { borderColor: `${catColor}50` }]}>
                <Ionicons name="chatbubble-outline" size={18} color={catColor} />
              </Pressable>
            </View>
          </Section>
        )}
      </ScrollView>

      {/* ── Floating header (back + share) ── */}
      <View style={[styles.floatingHeader, { paddingTop: insets.top + spacing.xs }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.headerBtn}
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={styles.headerBtn}
          accessibilityLabel="Share activity"
        >
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      {/* ── Sticky CTA ── */}
      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }, shadows.float]}>
        <View style={styles.ctaInfo}>
          <Text style={styles.ctaTitle} numberOfLines={1}>{activity.title}</Text>
          <Text style={[styles.ctaSpots, isAlmostFull && { color: colors.fitness }]}>
            {isAlmostFull ? `🔥 Only ${displayedSpots} spot${displayedSpots !== 1 ? 's' : ''} left` : `${displayedSpots} spots available`}
          </Text>
        </View>
        <Pressable
          onPress={handleJoin}
          disabled={joinLoading || (!joined && displayedSpots === 0)}
          style={({ pressed }) => [
            styles.joinBtn,
            { backgroundColor: joined ? colors.surfaceHigh : catColor },
            pressed && styles.joinBtnPressed,
            joinLoading && { opacity: 0.7 },
            !joined && displayedSpots === 0 && styles.joinBtnDisabled,
            !joined && shadows.glow,
          ]}
          accessibilityRole="button"
          accessibilityLabel={joined ? 'Leave activity' : 'Join activity'}
        >
          {joinLoading ? (
            <Ionicons name="refresh" size={20} color={joined ? colors.text : colors.textInverse} />
          ) : (
            <>
              <Ionicons
                name={joined ? 'exit-outline' : 'checkmark-circle-outline'}
                size={18}
                color={joined ? colors.textSecondary : colors.textInverse}
              />
              <Text style={[styles.joinBtnText, joined && styles.joinBtnTextLeave]}>
                {joined ? 'Leave' : displayedSpots === 0 ? 'Full' : 'Join'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.card}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  title: {
    ...typography.captionSemi,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
});

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[detailStyles.row, !last && detailStyles.border]}>
      <View style={detailStyles.iconWrap}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={detailStyles.textWrap}>
        <Text style={detailStyles.label}>{label}</Text>
        <Text style={detailStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
  },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1 },
  label: { ...typography.captionSemi, color: colors.textMuted, marginBottom: 2 },
  value: { ...typography.body, color: colors.text, lineHeight: 21 },
});

// ─── Main styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },

  // Hero
  hero: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCatIcon: {
    width: 100,
    height: 100,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catBadge: {
    position: 'absolute',
    bottom: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  catBadgeText: { ...typography.captionSemi },

  // Main card
  mainCard: {
    marginHorizontal: spacing.lg,
    marginTop: -spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    color: colors.text,
    flex: 1,
    lineHeight: 26,
  },
  urgencyPill: {
    backgroundColor: 'rgba(251,146,60,0.15)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    marginTop: 2,
  },
  urgencyText: { ...typography.micro, color: colors.fitness, fontWeight: '700' },
  metaRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.md },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaChipText: { ...typography.caption, color: colors.textSecondary },
  spotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  spotsLabel: { ...typography.captionSemi, color: colors.textSecondary },
  spotsLeft: { ...typography.captionSemi, color: colors.primary },
  progressBg: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: radius.pill },

  // Description
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 23,
    padding: spacing.md,
  },

  // Avatar row (scroll)
  avatarRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarCell: { alignItems: 'center', gap: spacing.xs, width: 56 },
  avatarName: {
    ...typography.micro,
    color: colors.textSecondary,
    textAlign: 'center',
    width: 56,
  },
  emptySlot: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  // Member list
  memberList: { paddingHorizontal: spacing.md },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  memberRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  memberInfo: { flex: 1, gap: 3 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  memberName: { ...typography.bodySemi, color: colors.text },
  hostTag: {
    backgroundColor: `${colors.warning}22`,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  hostTagText: { ...typography.micro, color: colors.warning, fontWeight: '700' },
  memberActivities: { ...typography.caption, color: colors.textMuted },

  // Tags
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    padding: spacing.md,
  },
  tag: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
  },
  tagText: { ...typography.captionSemi },

  // Host card
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  hostCardInfo: { flex: 1, gap: 3 },
  hostCardName: { ...typography.subheading, color: colors.text },
  hostCardActivities: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  msgBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  // Floating header
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: `${colors.surface}CC`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Sticky CTA bar
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  ctaInfo: { flex: 1 },
  ctaTitle: { ...typography.bodySemi, color: colors.text },
  ctaSpots: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    minWidth: 90,
    justifyContent: 'center',
  },
  joinBtnPressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  joinBtnDisabled: { opacity: 0.4 },
  joinBtnText: { ...typography.buttonSm, color: colors.textInverse },
  joinBtnTextLeave: { color: colors.textSecondary },

  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  notFoundText: { ...typography.subheading, color: colors.text },
  backLink: { marginTop: spacing.sm },
  backLinkText: { ...typography.body, color: colors.primary },
});
