import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {PALETTE, RADIUS, SIZES, TYPOGRAPHY} from '../../constants';

interface ProfileButtonProps {
  name: string; // nama atau email pengguna, dipakai untuk inisial
  onPress: () => void;
}

/**
 * Inisial dari nama atau email.
 * "Gilber Johan" -> "GJ", "oki.rahmat@mail.com" -> "OR", "player@x.com" -> "PL".
 */
export function getInitials(name: string): string {
  const local = name.split('@')[0].trim();
  const parts = local.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Ikon profil bulat berisi inisial, untuk diletakkan di pojok kanan atas.
 * Isi menu profil (ganti email, password, dst.) dikerjakan terpisah.
 */
const ProfileButton: React.FC<ProfileButtonProps> = ({name, onPress}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Profil"
    hitSlop={4}
    onPress={onPress}
    style={({pressed}) => [styles.button, pressed && styles.pressed]}>
    <Text style={styles.initials}>{getInitials(name)}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: SIZES.minTouchTarget,
    height: SIZES.minTouchTarget,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {opacity: 0.7},
  initials: {...TYPOGRAPHY.labelMd, color: PALETTE.white},
});

export default ProfileButton;
