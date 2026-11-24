import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';

export interface BarChartItem {
  label: string; // tulisan di bawah batang, contoh "21/11"
  value: number;
}

interface BarChartProps {
  data: BarChartItem[];
  maxValue?: number; // batas atas sumbu; bawaan = nilai terbesar di data
  height?: number; // tinggi area batang
  barColor?: string;
  valueSuffix?: string; // contoh "%"
  emptyText?: string;
  testID?: string;
}

const ZERO_BAR_HEIGHT = 2;
const MIN_BAR_HEIGHT = 4;
const VALUE_LABEL_SPACE = 18;

/**
 * Grafik batang sederhana dari komponen biasa (tanpa library grafik),
 * jadi tidak menambah dependensi native dan tidak perlu build ulang.
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  height = 120,
  barColor = PALETTE.primary,
  valueSuffix = '',
  emptyText = 'Belum ada data.',
  testID,
}) => {
  if (data.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  const top = Math.max(maxValue ?? Math.max(...data.map(item => item.value)), 1);
  const summary = data
    .map(item => `${item.label}: ${Math.round(item.value)}${valueSuffix}`)
    .join(', ');

  return (
    <View
      accessible
      accessibilityLabel={`Grafik batang. ${summary}`}
      style={styles.row}
      testID={testID}>
      {data.map((item, index) => {
        const ratio = Math.min(Math.max(item.value / top, 0), 1);
        const barHeight =
          item.value > 0
            ? Math.max(Math.round(ratio * height), MIN_BAR_HEIGHT)
            : ZERO_BAR_HEIGHT;

        return (
          <View key={`${item.label}-${index}`} style={styles.column}>
            <View style={[styles.barArea, {height: height + VALUE_LABEL_SPACE}]}>
              <Text style={styles.value}>
                {`${Math.round(item.value)}${valueSuffix}`}
              </Text>
              <View
                testID={`bar-${index}`}
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor:
                      item.value > 0 ? barColor : PALETTE.secondaryShadow,
                  },
                ]}
              />
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.xs + 2},
  column: {flex: 1, alignItems: 'center', gap: SPACING.xs},
  barArea: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
  },
  bar: {width: '70%', borderRadius: RADIUS.sm},
  value: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  // Warna tulisan sama dengan nilai tapi sedikit lebih pudar, agar tetap terbaca
  // di atas kartu terang (warna sebelumnya terlalu pucat).
  label: {...TYPOGRAPHY.caption, color: PALETTE.ink, opacity: 0.7},
  empty: {...TYPOGRAPHY.bodyMd, color: PALETTE.ink},
});

export default BarChart;
