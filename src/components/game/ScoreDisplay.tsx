import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {FONTS, PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';

export type ScoreTone = 'default' | 'success' | 'danger' | 'reward';

interface ScoreDisplayProps {
  label: string;
  value: string | number;
  tone?: ScoreTone;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLOR: Record<ScoreTone, string> = {
  default: PALETTE.white,
  success: PALETTE.success,
  danger: PALETTE.danger,
  reward: PALETTE.reward,
};

/**
 * Kotak kecil untuk HUD game: label kecil di atas, angka besar di bawah.
 * Contoh: "POSE COUNT" / 5.
 */
const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  label,
  value,
  tone = 'default',
  style,
}) => {
  const color = TONE_COLOR[tone];
  const borderColor = tone === 'default' ? PALETTE.primary : color;

  return (
    <View
      accessible
      accessibilityLabel={`${label} ${value}`}
      style={[styles.container, {borderColor}, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, {color}]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(9, 0, 63, 0.75)',
    borderWidth: 2,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'flex-start',
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: PALETTE.panel,
  },
  value: {
    fontFamily: FONTS.heading,
    fontSize: 26,
    lineHeight: 32,
  },
});

export default ScoreDisplay;
