import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';

interface StatCardProps {
  label: string;
  value: string | number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Kartu kecil berisi satu angka statistik: label di atas, nilai di bawah. */
const StatCard: React.FC<StatCardProps> = ({label, value, style, testID}) => (
  <View
    accessible
    accessibilityLabel={`${label} ${value}`}
    style={[styles.card, style]}
    testID={testID}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{`${value}`}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: PALETTE.panelLight,
    borderRadius: RADIUS.input,
    padding: SPACING.sm + 4,
  },
  label: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  value: {...TYPOGRAPHY.headlineMd, color: PALETTE.ink},
});

export default StatCard;
