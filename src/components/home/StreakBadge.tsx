import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';

interface StreakBadgeProps {
  count: number; // jumlah hari beruntun
  style?: StyleProp<ViewStyle>;
}

/** Pil kecil berisi api dan jumlah hari streak. */
const StreakBadge: React.FC<StreakBadgeProps> = ({count, style}) => (
  <View
    accessible
    accessibilityLabel={`Streak ${count} hari`}
    style={[styles.container, style]}>
    <Text style={styles.icon}>🔥</Text>
    <Text style={styles.count}>{count}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    backgroundColor: PALETTE.backgroundElevated,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.xs,
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: 14,
  },
  count: {
    ...TYPOGRAPHY.labelMd,
    color: PALETTE.reward,
  },
});

export default StreakBadge;
