export const colors = {
  background: '#090b12',
  surface: '#121520',
  surfaceElevated: '#191d2b',
  surfaceMuted: '#202536',
  border: '#292f42',
  text: '#f5f3ff',
  textMuted: '#969bad',
  textSubtle: '#697086',
  accent: '#8b7cff',
  accentStrong: '#705cff',
  accentSoft: '#2a2548',
  success: '#5ee6a8',
  white: '#ffffff',
} as const;

export const layout = {
  maxWidth: 920,
  screenPadding: 20,
  sectionGap: 24,
  cardRadius: 20,
} as const;

export const shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.22,
  shadowRadius: 24,
  elevation: 8,
} as const;
