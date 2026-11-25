// ============================================================
// SnapFit Design Tokens
// Sumber: DESIGN.md (Figma "SnapFit Kinetic Gamified System")
// Terpisah dari COLORS di index.ts supaya tidak mengubah
// tampilan GameScreen yang sudah ada.
// ============================================================

import type {TextStyle} from 'react-native';

// ── Warna ────────────────────────────────────────────────────

export const PALETTE = {
  // Latar
  background: '#09003F', // kanvas utama layar
  backgroundElevated: '#140B6E', // bar bawah, track, badge streak

  // Aksi utama
  primary: '#2D4BFF',
  primaryShadow: '#1B2FB0', // "tebal" tombol 3D

  // Panel terang (kartu, modal, input)
  panel: '#C7DCFF',
  panelLight: '#E4EEFF',
  secondaryShadow: '#8BA7E8',

  // Teks
  ink: '#16228A', // teks di atas panel terang
  white: '#FFFFFF',

  // Status
  success: '#22DD5C',
  reward: '#FFC93D',
  danger: '#FF3D55',
} as const;

// ── Font ─────────────────────────────────────────────────────
// Nama = nama FILE font (tanpa .ttf) di
// android/app/src/main/assets/fonts/. Kalau file belum ada,
// Android otomatis memakai font bawaan (tidak crash).
// Jangan pakai fontWeight bersama font ini, bobotnya sudah
// ada di nama file.

export const FONTS = {
  displayItalic: 'Lora-BoldItalic', // judul besar
  heading: 'Lora-Bold', // angka dan judul
  body: 'Poppins-Regular',
  bodyMedium: 'Poppins-Medium',
  label: 'Poppins-SemiBold', // tombol, chip
} as const;

export const TYPOGRAPHY = {
  displayHero: {
    fontFamily: FONTS.displayItalic,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -0.4,
  },
  counterGiant: {
    fontFamily: FONTS.heading,
    fontSize: 68,
    lineHeight: 72,
    letterSpacing: -1.4,
  },
  headlineLg: {fontFamily: FONTS.heading, fontSize: 26, lineHeight: 32},
  headlineMd: {fontFamily: FONTS.heading, fontSize: 20, lineHeight: 26},
  titleSm: {fontFamily: FONTS.heading, fontSize: 16, lineHeight: 22},
  bodyLg: {fontFamily: FONTS.body, fontSize: 15, lineHeight: 22},
  bodyMd: {fontFamily: FONTS.body, fontSize: 13, lineHeight: 18},
  labelLg: {fontFamily: FONTS.label, fontSize: 16, lineHeight: 20},
  labelMd: {fontFamily: FONTS.label, fontSize: 13, lineHeight: 16},
  caption: {fontFamily: FONTS.bodyMedium, fontSize: 11, lineHeight: 14},
} satisfies Record<string, TextStyle>;

// ── Jarak, sudut, ukuran ─────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  screenMargin: 20,
} as const;

export const RADIUS = {
  sm: 4,
  input: 12,
  button: 14,
  card: 22, // modal dan kartu besar
  pill: 9999,
} as const;

export const SIZES = {
  buttonHeight: 52,
  buttonDepth: 4, // tinggi "alas" tombol 3D
  buttonPress: 3, // seberapa turun saat ditekan
  inputHeight: 48,
  minTouchTarget: 44,
} as const;
