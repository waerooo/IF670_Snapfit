import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BarChart from '../../components/common/BarChart';
import StatCard from '../../components/common/StatCard';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';
import type {GameSession, UserStats} from '../../types';

export const EMPTY_STATS: UserStats = {
  totalGames: 0,
  totalScore: 0,
  totalPoses: 0,
  bestScore: 0,
  averageAccuracy: 0,
};

interface StatisticsViewProps {
  stats: UserStats | null;
  sessions: GameSession[]; // urutan dari server: terbaru lebih dulu
  isLoading: boolean;
  hasError: boolean;
  onBack: () => void;
}

/** Tanggal singkat "dd/MM" dari waktu Unix (milidetik). */
export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * Tampilan halaman statistik: murni menerima data lewat props, tanpa
 * memanggil database. Pengambilan data ada di StatisticsScreen.
 */
const StatisticsView: React.FC<StatisticsViewProps> = ({
  stats,
  sessions,
  isLoading,
  hasError,
  onBack,
}) => {
  const shownStats = stats ?? EMPTY_STATS;
  // Data dari server berurutan terbaru lebih dulu; grafik dibaca dari lama ke baru.
  const chronological = [...sessions].reverse();
  const isEmpty =
    !isLoading && !hasError && sessions.length === 0 && shownStats.totalGames === 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={SPACING.md}
          onPress={onBack}
          testID="statistics-back">
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Statistik</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PALETTE.panel} />
          <Text style={styles.centerText}>Memuat statistik...</Text>
        </View>
      ) : hasError ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>
            Statistik tidak dapat dimuat. Coba lagi nanti.
          </Text>
        </View>
      ) : isEmpty ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>
            Belum ada permainan. Main dulu untuk melihat statistikmu.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.grid}>
            <StatCard
              label="Permainan"
              value={shownStats.totalGames}
              style={styles.gridItem}
              testID="statistics-stat-games"
            />
            <StatCard
              label="Total skor"
              value={shownStats.totalScore}
              style={styles.gridItem}
              testID="statistics-stat-score"
            />
            <StatCard
              label="Skor terbaik"
              value={shownStats.bestScore}
              style={styles.gridItem}
              testID="statistics-stat-best"
            />
            <StatCard
              label="Pose berhasil"
              value={shownStats.totalPoses}
              style={styles.gridItem}
              testID="statistics-stat-poses"
            />
            <StatCard
              label="Rata-rata akurasi"
              value={`${Math.round(shownStats.averageAccuracy)}%`}
              style={styles.gridItemWide}
              testID="statistics-stat-accuracy"
            />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              {`Skor ${chronological.length} sesi terakhir`}
            </Text>
            <BarChart
              testID="statistics-chart-score"
              data={chronological.map(item => ({
                label: formatShortDate(item.timestamp),
                value: item.score,
              }))}
              emptyText="Belum ada sesi."
            />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Akurasi per sesi</Text>
            <BarChart
              testID="statistics-chart-accuracy"
              data={chronological.map(item => ({
                label: formatShortDate(item.timestamp),
                value: item.accuracy,
              }))}
              maxValue={100}
              valueSuffix="%"
              barColor={PALETTE.success}
              emptyText="Belum ada sesi."
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
    paddingHorizontal: SPACING.screenMargin,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  back: {fontSize: 36, lineHeight: 36, color: PALETTE.white},
  title: {...TYPOGRAPHY.headlineLg, color: PALETTE.white},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  centerText: {...TYPOGRAPHY.bodyLg, color: PALETTE.panel, textAlign: 'center'},
  content: {gap: SPACING.md, paddingBottom: SPACING.lg},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm},
  gridItem: {width: '48%'},
  gridItemWide: {width: '100%'},
  chartCard: {
    backgroundColor: PALETTE.panel,
    borderRadius: RADIUS.button,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  chartTitle: {...TYPOGRAPHY.labelMd, color: PALETTE.ink},
});

export default StatisticsView;
