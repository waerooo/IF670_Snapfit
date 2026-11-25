import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FONTS, PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';
import Button from '../common/Button';

export interface ResultAchievement {
  emoji: string;
  title: string;
  description: string;
}

interface ResultCardProps {
  poseCount: number;
  posePerMinute: number;
  streakFrom: number; // streak sebelum sesi ini
  streakTo: number; // streak sesudah sesi ini
  newAchievement?: ResultAchievement; // kosong = bagian achievement disembunyikan
  saved?: boolean; // tampilkan "Progress saved"
  onPlayAgain: () => void;
  onContinue: () => void;
}

const Stat: React.FC<{label: string; value: string | number}> = ({
  label,
  value,
}) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

/**
 * Tampilan hasil game ("Time's Up!"): judul, kartu ringkasan, dan tombol aksi.
 * Murni tampilan. Dipasang oleh GameScreen setelah waktu habis.
 */
const ResultCard: React.FC<ResultCardProps> = ({
  poseCount,
  posePerMinute,
  streakFrom,
  streakTo,
  newAchievement,
  saved = true,
  onPlayAgain,
  onContinue,
}) => {
  const streakGain = streakTo - streakFrom;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Time's Up!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Result</Text>

        <View style={styles.statsRow}>
          <Stat label="Pose Count" value={poseCount} />
          <Stat label="Pose / Minute" value={posePerMinute.toFixed(2)} />
        </View>

        <View style={styles.streakRow}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={styles.streakBody}>
            <Text style={styles.streakLabel}>Daily Streak</Text>
            <Text style={styles.streakValue}>{`${streakFrom} → ${streakTo}`}</Text>
          </View>
          {streakGain > 0 && (
            <View style={styles.gainChip}>
              <Text style={styles.gainText}>{`+${streakGain}`}</Text>
            </View>
          )}
        </View>

        {newAchievement && (
          <View>
            <Text style={styles.sectionLabel}>Achievement Gained</Text>
            <View style={styles.achievement}>
              <View style={styles.achievementIcon}>
                <Text style={styles.achievementEmoji}>
                  {newAchievement.emoji}
                </Text>
              </View>
              <View style={styles.achievementBody}>
                <Text style={styles.achievementTitle}>
                  {newAchievement.title}
                </Text>
                <Text style={styles.achievementDesc}>
                  {newAchievement.description}
                </Text>
              </View>
              <View style={styles.newChip}>
                <Text style={styles.newText}>NEW</Text>
              </View>
            </View>
          </View>
        )}

        {saved && <Text style={styles.saved}>☁  Progress saved</Text>}
      </View>

      <View style={styles.actions}>
        <Button
          title="Play Again"
          variant="secondary"
          onPress={onPlayAgain}
          style={styles.actionButton}
        />
        <Button
          title="Continue"
          onPress={onContinue}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
    padding: SPACING.screenMargin,
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  heading: {
    ...TYPOGRAPHY.displayHero,
    color: PALETTE.white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: PALETTE.panel,
    borderWidth: 3,
    borderColor: PALETTE.primary,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: PALETTE.ink,
    textAlign: 'center',
  },
  statsRow: {flexDirection: 'row', gap: SPACING.sm},
  stat: {
    flex: 1,
    backgroundColor: PALETTE.panelLight,
    borderRadius: RADIUS.input,
    padding: SPACING.sm + 4,
  },
  statLabel: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  statValue: {...TYPOGRAPHY.headlineMd, color: PALETTE.ink},

  // Streak
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    backgroundColor: PALETTE.panelLight,
    borderRadius: RADIUS.input,
    padding: SPACING.sm + 4,
  },
  streakIcon: {fontSize: 24},
  streakBody: {flex: 1},
  streakLabel: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  streakValue: {...TYPOGRAPHY.titleSm, color: PALETTE.ink},
  gainChip: {
    backgroundColor: PALETTE.success,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm + 2,
  },
  gainText: {...TYPOGRAPHY.caption, color: PALETTE.background},

  // Achievement
  sectionLabel: {
    ...TYPOGRAPHY.labelMd,
    color: PALETTE.ink,
    marginBottom: SPACING.xs + 2,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    backgroundColor: PALETTE.panelLight,
    borderRadius: RADIUS.input,
    padding: SPACING.sm + 4,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.input,
    backgroundColor: PALETTE.reward,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEmoji: {fontSize: 20},
  achievementBody: {flex: 1},
  achievementTitle: {...TYPOGRAPHY.titleSm, color: PALETTE.ink},
  achievementDesc: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  newChip: {
    backgroundColor: PALETTE.reward,
    borderRadius: RADIUS.pill,
    paddingVertical: 2,
    paddingHorizontal: SPACING.sm,
  },
  newText: {
    fontFamily: FONTS.label,
    fontSize: 10,
    lineHeight: 14,
    color: PALETTE.ink,
  },

  saved: {...TYPOGRAPHY.caption, color: PALETTE.ink, textAlign: 'center'},

  // Aksi
  actions: {flexDirection: 'row', gap: SPACING.sm + 4},
  actionButton: {flex: 1},
});

export default ResultCard;
