import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {PALETTE, RADIUS, SPACING} from '../../constants';
import CountdownTimer from './CountdownTimer';
import ScoreDisplay from './ScoreDisplay';

interface GameHudProps {
  poseCount: number;
  secondsLeft: number;
  onPause: () => void;
}

/**
 * Bilah atas saat bermain: jumlah pose (kiri), tombol jeda (tengah),
 * dan sisa waktu (kanan). Murni tampilan. Tempatkan di atas kamera.
 */
const GameHud: React.FC<GameHudProps> = ({poseCount, secondsLeft, onPause}) => (
  <View style={styles.container}>
    <View style={[styles.side, styles.sideLeft]}>
      <ScoreDisplay label="Pose Count" value={poseCount} tone="success" />
    </View>

    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Pause"
      hitSlop={SPACING.sm}
      onPress={onPause}
      style={({pressed}) => [styles.pauseButton, pressed && styles.pressed]}>
      <View style={styles.bar} />
      <View style={styles.bar} />
    </Pressable>

    <View style={[styles.side, styles.sideRight]}>
      <CountdownTimer seconds={secondsLeft} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenMargin,
    paddingVertical: SPACING.sm,
  },
  side: {flex: 1},
  sideLeft: {alignItems: 'flex-start'},
  sideRight: {alignItems: 'flex-end'},
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  pressed: {opacity: 0.7},
  bar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: PALETTE.white,
  },
});

export default GameHud;
