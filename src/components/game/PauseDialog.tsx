import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';
import Button from '../common/Button';
import {formatTime} from './CountdownTimer';

interface PauseDialogProps {
  visible: boolean;
  poseCount: number;
  secondsLeft: number;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
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
 * Dialog "Paused": ringkasan sesi dan tiga pilihan (lanjut, ulang, keluar).
 * Murni tampilan. Logika jeda game tetap di GameScreen.
 */
const PauseDialog: React.FC<PauseDialogProps> = ({
  visible,
  poseCount,
  secondsLeft,
  onResume,
  onRestart,
  onQuit,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onResume}>
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>Paused</Text>

        <View style={styles.statsRow}>
          <Stat label="Pose Count" value={poseCount} />
          <Stat label="Time Left" value={formatTime(secondsLeft)} />
        </View>

        <Button title="▶  Resume" onPress={onResume} />
        <Button title="↺  Restart" variant="outline" onPress={onRestart} />
        <Button title="Quit to Home" variant="destructive" onPress={onQuit} />

        <Text style={styles.note}>Quitting won't count this session.</Text>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 0, 63, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.screenMargin,
  },
  dialog: {
    width: '100%',
    backgroundColor: PALETTE.panel,
    borderWidth: 3,
    borderColor: PALETTE.primary,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {
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
  note: {
    ...TYPOGRAPHY.caption,
    color: PALETTE.ink,
    textAlign: 'center',
  },
});

export default PauseDialog;
