// ============================================================
// DATA PALSU untuk membangun UI sebelum backend siap.
// Ganti dengan data asli (hook/service) lalu hapus file ini.
// ============================================================

import type {Achievement} from '../types';

// ── Home ─────────────────────────────────────────────────────

export type DayStatus = 'done' | 'today' | 'upcoming';

export const MOCK_HOME = {
  displayName: 'Gilber Johan',
  streak: {current: 11, best: 14},
  week: [
    {day: 'Mon', status: 'done'},
    {day: 'Tue', status: 'done'},
    {day: 'Wed', status: 'done'},
    {day: 'Thu', status: 'today'},
    {day: 'Fri', status: 'upcoming'},
    {day: 'Sat', status: 'upcoming'},
    {day: 'Sun', status: 'upcoming'},
  ] as {day: string; status: DayStatus}[],
};

// ── Settings ─────────────────────────────────────────────────
// UserStats di types belum punya playtime dan pose/menit,
// jadi sementara berupa daftar label/nilai biasa.

export const MOCK_STATISTICS = [
  {label: 'Total Pose', value: '143'},
  {label: 'Total Playtime', value: '1h 12m'},
  {label: 'Highest Pose/Min', value: '12.67'},
  {label: 'Best Streak', value: '14 days'},
];

// ── Achievements ─────────────────────────────────────────────
// Achievement di types belum punya progres, jadi ditambah di sini.

export interface AchievementItem extends Achievement {
  progress: number;
  target: number;
}

export const MOCK_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'healthy-steps',
    title: 'Healthy Steps',
    description: 'Get 10 total pose',
    emoji: '👟',
    unlockedAt: 1731800000000,
    progress: 10,
    target: 10,
  },
  {
    id: 'healthy-milestone',
    title: 'Healthy Milestone',
    description: 'Get 100 total pose',
    emoji: '🏅',
    unlockedAt: 1731800000000,
    progress: 100,
    target: 100,
  },
  {
    id: 'apprentice-athlete',
    title: 'Apprentice Athlete',
    description: 'At least 5 pose/minute',
    emoji: '⚡',
    unlockedAt: 1731800000000,
    progress: 5,
    target: 5,
  },
  {
    id: 'adept-athlete',
    title: 'Adept Athlete',
    description: 'At least 10 pose/minute',
    emoji: '🔒',
    progress: 8,
    target: 10,
  },
  {
    id: 'path-to-healthiness',
    title: 'Path to Healthiness',
    description: 'Reach 14 daily streak',
    emoji: '🔒',
    progress: 11,
    target: 14,
  },
  {
    id: 'health-enthusiast',
    title: 'Health Enthusiast',
    description: 'Reach 35 daily streak',
    emoji: '🔒',
    progress: 11,
    target: 35,
  },
  {
    id: 'diligence-is-the-way',
    title: 'Diligence is The Way',
    description: 'Reach 100 daily streak',
    emoji: '🔒',
    progress: 11,
    target: 100,
  },
];

// ── Hasil game (ResultCard) dan jeda (PauseDialog) ───────────

export const MOCK_RESULT = {
  poseCount: 19,
  posePerMinute: 12.67,
  streakFrom: 11,
  streakTo: 12,
  newAchievement: {
    emoji: '🏆',
    title: 'Adept Athlete',
    description: 'At least 10 pose/minute',
  },
};

export const MOCK_PAUSE = {poseCount: 5, secondsLeft: 112};

// ── HUD saat bermain (GameHud) ───────────────────────────────

export const MOCK_HUD = {poseCount: 5, secondsLeft: 62};
