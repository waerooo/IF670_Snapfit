import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import ScoreDisplay from './ScoreDisplay';

interface CountdownTimerProps {
  seconds: number; // sisa waktu dalam detik
  label?: string;
  dangerAt?: number; // di bawah/sama dengan ini, angka jadi merah
  style?: StyleProp<ViewStyle>;
}

/** 75 -> "1:15", 5 -> "0:05". Nilai negatif dianggap 0. */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
}

/**
 * Menampilkan sisa waktu game ("TIME LEFT 1:02").
 * Komponen ini hanya menampilkan; yang menghitung mundur tetap GameScreen.
 */
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  seconds,
  label = 'Time Left',
  dangerAt = 10,
  style,
}) => (
  <ScoreDisplay
    label={label}
    value={formatTime(seconds)}
    tone={seconds <= dangerAt ? 'danger' : 'default'}
    style={style}
  />
);

export default CountdownTimer;
