export const colors = {
  canvas: '#0a0a0a',
  canvasSoft: '#141414',
  canvasPaper: '#ededed',
  surface: '#1a1a1a',
  surfaceHover: '#1e1e1e',
  brand: '#FF5722',
  brandDim: 'rgba(255,87,34,0.10)',
  brandLight: 'rgba(255,87,34,0.15)',
  onPrimary: '#ffffff',
  textPrimary: '#f5f5f5',
  textSecondary: '#a3a3a3',
  ash: '#808080',
  mute: '#525252',
  graphite: '#2a2a2a',
  border: '#262626',
  success: '#10B981',
  error: '#DC2626',
  linkBlue: '#3B82F6',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 64,
  sectionLg: 96,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  card: 16,
  pill: 9999,
} as const;

export const typography = {
  displayHero: { fontSize: 48, fontWeight: '400', letterSpacing: -1.68 },
  displayLg: { fontSize: 36, fontWeight: '400', letterSpacing: -0.72 },
  displayMd: { fontSize: 32, fontWeight: '400', letterSpacing: -0.64 },
  headingLg: { fontSize: 22, fontWeight: '500', letterSpacing: -0.22 },
  headingMd: { fontSize: 20, fontWeight: '500', letterSpacing: -0.20 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodySm: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  captionTight: { fontSize: 13, fontWeight: '500', lineHeight: 17 },
  meta: { fontSize: 12, fontWeight: '400' },
  monoEyebrow: { fontSize: 11, fontWeight: '400', letterSpacing: 0.88 },
  button: { fontSize: 16, fontWeight: '600' },
  buttonSm: { fontSize: 14, fontWeight: '500' },
} as const;
