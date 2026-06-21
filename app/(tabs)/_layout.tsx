import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadows, spacing, typography } from '@/theme';

// ─── Tab config ───────────────────────────────────────────────────────────────

type TabName = 'index' | 'search' | 'create' | 'messages' | 'profile';

const TAB_CONFIG: Record<TabName, {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}> = {
  index: {
    label: 'Discover',
    icon: 'compass-outline',
    iconFocused: 'compass',
  },
  search: {
    label: 'Search',
    icon: 'search-outline',
    iconFocused: 'search',
  },
  create: {
    label: '',
    icon: 'add',
    iconFocused: 'add',
  },
  messages: {
    label: 'Messages',
    icon: 'chatbubble-outline',
    iconFocused: 'chatbubble',
  },
  profile: {
    label: 'Profile',
    icon: 'person-outline',
    iconFocused: 'person',
  },
};

// ─── Custom floating tab bar ───────────────────────────────────────────────────
// Rationale: the standard RN tab bar is flat and full-width. A floating pill
// visually separates navigation chrome from content, modernising the layout.

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={[styles.bar, shadows.float]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCreate = route.name === 'create';
          const config = TAB_CONFIG[route.name as TabName];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Skip internal Expo Router routes (e.g. +not-found) that have no config
          if (!config) return null;

          if (isCreate) {
            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel="Create activity"
                style={({ pressed }) => [
                  styles.createBtn,
                  pressed && styles.pressed,
                  shadows.glow,
                ]}
              >
                <Ionicons name="add" size={28} color={colors.textInverse} />
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={config.label}
              accessibilityState={{ selected: isFocused }}
              style={({ pressed }) => [
                styles.tab,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name={isFocused ? config.iconFocused : config.icon}
                size={24}
                color={isFocused ? colors.primary : colors.textMuted}
              />
              {config.label !== '' && (
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                  ]}
                >
                  {config.label}
                </Text>
              )}
              {isFocused && <View style={styles.activeDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"    options={{ title: 'Discover' }} />
      <Tabs.Screen name="search"   options={{ title: 'Search' }} />
      <Tabs.Screen name="create"   options={{ title: 'Create' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Profile' }} />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    // transparent so the screen content shows behind the bar
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    gap: 2,
    minHeight: 48,
  },
  tabLabel: {
    ...typography.micro,
  },
  tabLabelActive: { color: colors.primary },
  tabLabelInactive: { color: colors.textMuted },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    marginTop: 1,
  },
  createBtn: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16, // lifts the button above the bar
  },
  pressed: { opacity: 0.75 },
});
