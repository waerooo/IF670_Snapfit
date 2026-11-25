// ============================================================
// SnapFit — Shared TypeScript Types
// ============================================================

// ── Pose Detection ──────────────────────────────────────────

export interface PoseLandmark {
  type: PoseLandmarkType;
  x: number;         // normalized [0,1]
  y: number;         // normalized [0,1]
  z: number;         // depth
  likelihood: number; // in-frame confidence [0,1]
}

export enum PoseLandmarkType {
  NOSE = 0,
  LEFT_EYE_INNER = 1,
  LEFT_EYE = 2,
  LEFT_EYE_OUTER = 3,
  RIGHT_EYE_INNER = 4,
  RIGHT_EYE = 5,
  RIGHT_EYE_OUTER = 6,
  LEFT_EAR = 7,
  RIGHT_EAR = 8,
  MOUTH_LEFT = 9,
  MOUTH_RIGHT = 10,
  LEFT_SHOULDER = 11,
  RIGHT_SHOULDER = 12,
  LEFT_ELBOW = 13,
  RIGHT_ELBOW = 14,
  LEFT_WRIST = 15,
  RIGHT_WRIST = 16,
  LEFT_PINKY = 17,
  RIGHT_PINKY = 18,
  LEFT_INDEX = 19,
  RIGHT_INDEX = 20,
  LEFT_THUMB = 21,
  RIGHT_THUMB = 22,
  LEFT_HIP = 23,
  RIGHT_HIP = 24,
  LEFT_KNEE = 25,
  RIGHT_KNEE = 26,
  LEFT_ANKLE = 27,
  RIGHT_ANKLE = 28,
  LEFT_HEEL = 29,
  RIGHT_HEEL = 30,
  LEFT_FOOT_INDEX = 31,
  RIGHT_FOOT_INDEX = 32,
}

export interface DetectedPose {
  landmarks: PoseLandmark[];
  timestamp: number;
}

export type PoseLabel =
  | 'T_POSE'
  | 'HANDS_UP'
  | 'HAND_RIGHT_UP'
  | 'HAND_LEFT_UP'
  | 'SQUAT'
  | 'LUNGE_LEFT'
  | 'LUNGE_RIGHT'
  | 'JUMPING_JACK_OPEN'
  | 'JUMPING_JACK_CLOSED'
  | 'UNKNOWN';

export interface PoseValidationResult {
  isValid: boolean;
  label: PoseLabel;
  confidence: number;
}

// ── Game ────────────────────────────────────────────────────

export interface GameSession {
  id: string;
  userId: string;
  score: number;
  poseCount: number;
  duration: number;       // seconds
  accuracy: number;       // 0-100
  timestamp: number;      // Unix ms
}

export interface GameChallenge {
  id: string;
  poseLabel: PoseLabel;
  displayName: string;
  emoji: string;
  durationMs: number;
  pointsReward: number;
}

export type GameStatus = 'IDLE' | 'COUNTDOWN' | 'ACTIVE' | 'PAUSED' | 'ENDED';

// ── User & Firebase ─────────────────────────────────────────

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: number;
  stats: UserStats;
}

export interface UserStats {
  totalGames: number;
  totalScore: number;
  totalPoses: number;
  bestScore: number;
  averageAccuracy: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: number;   // Unix ms, undefined = locked
  requiredScore?: number;
  requiredPoses?: number;
}