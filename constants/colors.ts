/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#000000',
    tint: '#AAF70A',
    heading: '#33294F',
    bodyText: '#403852',
    brandInk: '#33294F',
    softGreen: '#EAF7C9',
    softGray: '#F3F1EF',
    divider: '#E4E0DD',
    fieldBorder: '#D8D3D0',
    placeholder: '#8B858D',
    progressTrack: '#DDD8D4',
    progressBackground: '#F3EFF7',
    triageCard: '#F1FBE8',
    triageCheck: '#D8FBE4',
    triagePending: '#D8FBE4',
    triageGreen: '#1AA354',
    triageText: '#687273',
    triageCancel: '#F7F2FA',

    // Core surfaces
    background: '#AAF70A',
    onboardingBackground: '#FFFFFF',
    foreground: '#000000',

    // Cards / elevated surfaces
    card: '#AAF70A',
    cardForeground: '#000000',

    // Primary action color (buttons, links, active states)
    primary: '#AAF70A',
    primaryForeground: '#000000',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#C6FF4A',
    secondaryForeground: '#000000',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#C6FF4A',
    mutedForeground: '#315000',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#D8FF86',
    accentForeground: '#000000',
    locationBubble: '#FFDA4D',
    locationGreen: '#69C443',

    // Destructive actions (delete, error states)
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#86C900',
    input: '#86C900',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
