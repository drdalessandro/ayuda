/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// EPA Bienestar — Go Red For Women (AHA) con escala cálida
const tintColorLight = '#C8102E';
const tintColorDark = '#FF6B6B';

export const Colors = {
  light: {
    text: '#1A1A2E',
    background: '#FFFAF9',
    tint: tintColorLight,
    icon: '#6B5B6E',
    tabIconDefault: '#9E8FA0',
    tabIconSelected: tintColorLight,
    border: '#E8D5D8',
    buttonBackground: '#C8102E',
    buttonText: '#FFFFFF',
  },
  dark: {
    text: '#F5EEF0',
    background: '#1A0F12',
    tint: tintColorDark,
    icon: '#C4A8B0',
    tabIconDefault: '#8A707A',
    tabIconSelected: tintColorDark,
    border: '#3D2530',
    buttonBackground: '#C8102E',
    buttonText: '#FFFFFF',
  },
};

// EPA Bienestar — Go Red For Women color palette
export const EpaColors = {
  goRed: '#C8102E',       // AHA Go Red For Women
  goRedDeep: '#8B0000',   // Rojo profundo
  goRedLight: '#FF6B6B',  // Rojo claro / dark mode
  rosePetal: '#FFF0F2',   // Fondo tarjetas suave
  plum: '#8B2252',        // Acento violáceo
  plumLight: '#C97BA0',   // Plum suave
  warmWhite: '#FFFAF9',   // Fondo principal
  warmGrey: '#6B5B6E',    // Texto secundario
  warmBlack: '#1A1A2E',   // Texto principal
  // Semáforo LE8
  optimal: '#2E7D32',
  intermediate: '#F57C00',
  inadequate: '#C8102E',
};

/**
 * Layout spacing constants
 */
export const Spacing = {
  /** Horizontal padding for screen content */
  screenHorizontal: 24,
  /** Top padding to account for status bar (use SafeAreaView when possible) */
  screenTop: 60,
  /** Standard vertical gap between sections */
  sectionGap: 24,
  /** Small gap between related elements */
  elementGap: 12,
  /** Extra small gap */
  xs: 4,
  /** Small gap */
  sm: 8,
  /** Medium gap */
  md: 16,
  /** Large gap */
  lg: 24,
  /** Extra large gap */
  xl: 32,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
