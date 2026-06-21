// ─── Design System ────────────────────────────────────────────────────────────
//
// Palette rationale:
//   bg/surfaces  → deep charcoal layers create perceived depth without black-on-black flatness
//   primary      → electric blue-violet (#5B8AF8) — trusted, energetic, modern social apps
//   accent       → soft violet (#A78BFA) — secondary emphasis, gradients
//   category hues→ each activity type owns a distinct hue so the feed is scannable at a glance
//   text         → warm off-white (#E6EDF3) reduces eye strain on dark backgrounds

export const colors = {
  // ─── Background layers (darkest → lightest) ───────────────────────────────
  background:   '#0D1117',   // base screen background
  surface:      '#161B22',   // cards, bottom sheets
  surfaceAlt:   '#1C2333',   // input fields, inner cards
  surfaceHigh:  '#21262D',   // modals, tooltips

  // ─── Brand ────────────────────────────────────────────────────────────────
  primary:      '#5B8AF8',   // main CTAs, active nav, focus rings
  primaryDark:  '#3D6FE8',   // pressed state
  primaryLight: '#7DA4FA',   // hover state, pills
  primaryGlow:  'rgba(91,138,248,0.18)',  // ambient glow behind hero elements

  accent:       '#A78BFA',   // secondary gradient end, badges
  accentDark:   '#8B5CF6',

  // ─── Semantic ─────────────────────────────────────────────────────────────
  success:  '#34D399',       // joined, confirmed
  warning:  '#FBBF24',       // limited spots, expiring soon
  danger:   '#F87171',       // errors, cancel
  info:     '#38BDF8',       // informational

  // ─── Activity category signature colours ──────────────────────────────────
  // Used for card accents, category pills, icon backgrounds
  gaming:   '#A78BFA',   // violet  — screen glow, controller energy
  sports:   '#34D399',   // emerald — grass, motion
  fitness:  '#FB923C',   // orange  — heat, exertion
  outdoors: '#38BDF8',   // sky     — sky, water
  social:   '#F472B6',   // pink    — warmth, connection

  // ─── Text ─────────────────────────────────────────────────────────────────
  text:          '#E6EDF3',  // headings, primary content
  textSecondary: '#8B949E',  // subtext, labels
  textMuted:     '#6E7681',  // placeholders, timestamps
  textInverse:   '#0D1117',  // text on light/colored backgrounds

  // ─── Chrome ───────────────────────────────────────────────────────────────
  border:       '#30363D',   // dividers, card outlines
  borderFocus:  '#5B8AF8',   // focused input ring
  overlay:      'rgba(0,0,0,0.65)',

  // ─── Gradient presets (used as array in LinearGradient) ───────────────────
  gradientPrimary: ['#5B8AF8', '#A78BFA'] as const,   // primary CTA
  gradientCard:    ['#1C2333', '#161B22'] as const,   // subtle card depth
  gradientHero:    ['#0D1117', '#1C2333'] as const,   // hero section
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
// 4-point grid. All spatial decisions derive from multiples of 4.
export const spacing = {
  xxs: 2,
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
  xxxl: 64,
} as const;

// ─── Radius ───────────────────────────────────────────────────────────────────
// Generous curves throughout — social apps feel warmer with rounded shapes
export const radius = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  pill: 999,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
// No custom font loaded — leverages SF Pro (iOS) / Roboto (Android) system fonts.
// Weights are intentionally distinct so the scale has visible rhythm.
export const typography = {
  display:    { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.5 },
  title:      { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading:    { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.2 },
  subheading: { fontSize: 17, fontWeight: '600' as const },
  body:       { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySemi:   { fontSize: 15, fontWeight: '600' as const },
  caption:    { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionSemi:{ fontSize: 13, fontWeight: '600' as const },
  micro:      { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.3 },
  button:     { fontSize: 16, fontWeight: '700' as const },
  buttonSm:   { fontSize: 14, fontWeight: '600' as const },
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
// Dark-mode shadows are achieved through border + background contrast,
// not traditional box-shadow (which is invisible on dark backgrounds).
// These are used via elevation and borderWidth in StyleSheet.
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: '#5B8AF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const theme = { colors, spacing, radius, typography, shadows };
export type Theme = typeof theme;
