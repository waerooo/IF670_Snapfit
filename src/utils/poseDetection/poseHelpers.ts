/**
 *
 * Pure functions for pose classification and scoring.
 * No side effects → easy to unit-test (see __tests__/unit/utils/poseHelpers.test.ts).
 */

import { PoseLandmarkType } from '../../types';
import type { DetectedPose, PoseLabel, PoseValidationResult } from '../../types';

// ── Constants ────────────────────────────────────────────────

/** Minimum in-frame likelihood for a landmark to be considered reliable. */
const MIN_LIKELIHOOD = 0.6;

/** Angle tolerance in degrees for pose classification. */
const ANGLE_TOLERANCE = 20;

// ── Geometry Helpers ─────────────────────────────────────────

interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculate the angle (degrees) at vertex B formed by A–B–C.
 */
export function angleBetweenPoints(a: Point2D, b: Point2D, c: Point2D): number {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };

  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
  const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);

  if (magAB === 0 || magCB === 0) return 0;

  const cosine = Math.max(-1, Math.min(1, dot / (magAB * magCB)));
  return (Math.acos(cosine) * 180) / Math.PI;
}

/**
 * Euclidean distance between two normalised landmarks.
 */
export function distanceBetween(a: Point2D, b: Point2D): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// ── Landmark Extraction ──────────────────────────────────────

function lm(pose: DetectedPose, type: PoseLandmarkType) {
  const landmark = pose.landmarks.find(l => l.type === type);
  if (!landmark || landmark.likelihood < MIN_LIKELIHOOD) return null;
  return landmark;
}

// ── Pose Classification ──────────────────────────────────────

/**
 * Classify the pose and return a validation result.
 * Called once per captured frame during an active game.
 */
export function validatePose(pose: DetectedPose): PoseValidationResult {
  // Try each classifier in priority order
  const classifiers: Array<() => PoseValidationResult | null> = [
    () => classifyTPose(pose),
    () => classifyHandsUp(pose),
    () => classifyOneHandUp(pose),
    () => classifySquat(pose),
    () => classifyLunge(pose),
    () => classifyJumpingJack(pose),
  ];

  for (const classify of classifiers) {
    const result = classify();
    if (result) return result;
  }

  return { isValid: false, label: 'UNKNOWN', confidence: 0 };
}

// ── T-Pose ────────────────────────────────────────────────────

/**
 * T-Pose: both arms extended horizontally (elbows ~180° straight).
 */
function classifyTPose(pose: DetectedPose): PoseValidationResult | null {
  const lShoulder = lm(pose, PoseLandmarkType.LEFT_SHOULDER);
  const lElbow = lm(pose, PoseLandmarkType.LEFT_ELBOW);
  const lWrist = lm(pose, PoseLandmarkType.LEFT_WRIST);
  const rShoulder = lm(pose, PoseLandmarkType.RIGHT_SHOULDER);
  const rElbow = lm(pose, PoseLandmarkType.RIGHT_ELBOW);
  const rWrist = lm(pose, PoseLandmarkType.RIGHT_WRIST);

  if (!lShoulder || !lElbow || !lWrist || !rShoulder || !rElbow || !rWrist) {
    return null;
  }

  const leftAngle = angleBetweenPoints(lShoulder, lElbow, lWrist);
  const rightAngle = angleBetweenPoints(rShoulder, rElbow, rWrist);

  const leftStraight = Math.abs(leftAngle - 180) < ANGLE_TOLERANCE;
  const rightStraight = Math.abs(rightAngle - 180) < ANGLE_TOLERANCE;

  // Arms should be roughly at shoulder height (y similar)
  const leftHorizontal = Math.abs(lWrist.y - lShoulder.y) < 0.15;
  const rightHorizontal = Math.abs(rWrist.y - rShoulder.y) < 0.15;

  if (leftStraight && rightStraight && leftHorizontal && rightHorizontal) {
    const avgLikelihood = [lShoulder, lElbow, lWrist, rShoulder, rElbow, rWrist]
      .reduce((s, l) => s + l.likelihood, 0) / 6;
    return { isValid: true, label: 'T_POSE', confidence: avgLikelihood };
  }
  return null;
}

// ── Hands Up ─────────────────────────────────────────────────

/**
 * Hands Up: both wrists above the head (above nose landmark).
 */
function classifyHandsUp(pose: DetectedPose): PoseValidationResult | null {
  const nose = lm(pose, PoseLandmarkType.NOSE);
  const lWrist = lm(pose, PoseLandmarkType.LEFT_WRIST);
  const rWrist = lm(pose, PoseLandmarkType.RIGHT_WRIST);

  if (!nose || !lWrist || !rWrist) return null;

  // In normalised coordinates, smaller y = higher on screen
  const lAbove = lWrist.y < nose.y - 0.05;
  const rAbove = rWrist.y < nose.y - 0.05;

  if (lAbove && rAbove) {
    const confidence = (lWrist.likelihood + rWrist.likelihood) / 2;
    return { isValid: true, label: 'HANDS_UP', confidence };
  }
  return null;
}

// ── One Hand Up (Right / Left) ───────────────────────────────

/**
 * One Hand Up: one wrist above head, other hand below shoulder.
 */
function classifyOneHandUp(pose: DetectedPose): PoseValidationResult | null {
  const nose = lm(pose, PoseLandmarkType.NOSE);
  const lWrist = lm(pose, PoseLandmarkType.LEFT_WRIST);
  const rWrist = lm(pose, PoseLandmarkType.RIGHT_WRIST);
  const lShoulder = lm(pose, PoseLandmarkType.LEFT_SHOULDER);
  const rShoulder = lm(pose, PoseLandmarkType.RIGHT_SHOULDER);

  if (!nose || !lWrist || !rWrist || !lShoulder || !rShoulder) return null;

  const leftUp = lWrist.y < nose.y && rWrist.y > rShoulder.y;
  const rightUp = rWrist.y < nose.y && lWrist.y > lShoulder.y;

  if (rightUp && !leftUp) {
    return { isValid: true, label: 'HAND_RIGHT_UP', confidence: rWrist.likelihood };
  }
  if (leftUp && !rightUp) {
    return { isValid: true, label: 'HAND_LEFT_UP', confidence: lWrist.likelihood };
  }
  return null;
}

// ── Squat ─────────────────────────────────────────────────────

/**
 * Squat: knee angles ≈ 90° (hips below shoulders, knees bent).
 */
function classifySquat(pose: DetectedPose): PoseValidationResult | null {
  const lHip = lm(pose, PoseLandmarkType.LEFT_HIP);
  const lKnee = lm(pose, PoseLandmarkType.LEFT_KNEE);
  const lAnkle = lm(pose, PoseLandmarkType.LEFT_ANKLE);
  const rHip = lm(pose, PoseLandmarkType.RIGHT_HIP);
  const rKnee = lm(pose, PoseLandmarkType.RIGHT_KNEE);
  const rAnkle = lm(pose, PoseLandmarkType.RIGHT_ANKLE);

  if (!lHip || !lKnee || !lAnkle || !rHip || !rKnee || !rAnkle) return null;

  const leftKneeAngle = angleBetweenPoints(lHip, lKnee, lAnkle);
  const rightKneeAngle = angleBetweenPoints(rHip, rKnee, rAnkle);

  const leftSquat = leftKneeAngle > 60 && leftKneeAngle < 120;
  const rightSquat = rightKneeAngle > 60 && rightKneeAngle < 120;

  if (leftSquat && rightSquat) {
    const confidence = [lHip, lKnee, lAnkle, rHip, rKnee, rAnkle]
      .reduce((s, l) => s + l.likelihood, 0) / 6;
    return { isValid: true, label: 'SQUAT', confidence };
  }
  return null;
}

// ── Lunge ─────────────────────────────────────────────────────

/**
 * Lunge: one knee bent ~90°, other leg more extended.
 */
function classifyLunge(pose: DetectedPose): PoseValidationResult | null {
  const lHip = lm(pose, PoseLandmarkType.LEFT_HIP);
  const lKnee = lm(pose, PoseLandmarkType.LEFT_KNEE);
  const lAnkle = lm(pose, PoseLandmarkType.LEFT_ANKLE);
  const rHip = lm(pose, PoseLandmarkType.RIGHT_HIP);
  const rKnee = lm(pose, PoseLandmarkType.RIGHT_KNEE);
  const rAnkle = lm(pose, PoseLandmarkType.RIGHT_ANKLE);

  if (!lHip || !lKnee || !lAnkle || !rHip || !rKnee || !rAnkle) return null;

  const leftAngle = angleBetweenPoints(lHip, lKnee, lAnkle);
  const rightAngle = angleBetweenPoints(rHip, rKnee, rAnkle);

  const leftBent = leftAngle > 70 && leftAngle < 110;
  const rightBent = rightAngle > 70 && rightAngle < 110;
  const leftExt = leftAngle > 150;
  const rightExt = rightAngle > 150;

  if (leftBent && rightExt) {
    return { isValid: true, label: 'LUNGE_LEFT', confidence: 0.8 };
  }
  if (rightBent && leftExt) {
    return { isValid: true, label: 'LUNGE_RIGHT', confidence: 0.8 };
  }
  return null;
}

// ── Jumping Jack ──────────────────────────────────────────────

/**
 * Jumping Jack Open: arms up + feet wide apart.
 * Jumping Jack Closed: arms down + feet together.
 */
function classifyJumpingJack(pose: DetectedPose): PoseValidationResult | null {
  const lWrist = lm(pose, PoseLandmarkType.LEFT_WRIST);
  const rWrist = lm(pose, PoseLandmarkType.RIGHT_WRIST);
  const lAnkle = lm(pose, PoseLandmarkType.LEFT_ANKLE);
  const rAnkle = lm(pose, PoseLandmarkType.RIGHT_ANKLE);
  const nose = lm(pose, PoseLandmarkType.NOSE);

  if (!lWrist || !rWrist || !lAnkle || !rAnkle || !nose) return null;

  const handsUp = lWrist.y < nose.y && rWrist.y < nose.y;
  const feetWide = Math.abs(lAnkle.x - rAnkle.x) > 0.2;
  const handsDown = lWrist.y > nose.y && rWrist.y > nose.y;
  const feetClose = Math.abs(lAnkle.x - rAnkle.x) < 0.1;

  if (handsUp && feetWide) {
    return { isValid: true, label: 'JUMPING_JACK_OPEN', confidence: 0.82 };
  }
  if (handsDown && feetClose) {
    return { isValid: true, label: 'JUMPING_JACK_CLOSED', confidence: 0.82 };
  }
  return null;
}

// ── Score Calculator ─────────────────────────────────────────

/**
 * Calculate points earned for a valid pose.
 * Higher confidence = more points.
 */
export function calculatePoseScore(result: PoseValidationResult): number {
  if (!result.isValid) return 0;

  const basePoints: Record<PoseLabel, number> = {
    T_POSE: 10,
    HANDS_UP: 8,
    HAND_RIGHT_UP: 8,
    HAND_LEFT_UP: 8,
    SQUAT: 12,
    LUNGE_LEFT: 10,
    LUNGE_RIGHT: 10,
    JUMPING_JACK_OPEN: 8,
    JUMPING_JACK_CLOSED: 8,
    UNKNOWN: 0,
  };

  const base = basePoints[result.label] ?? 0;
  // Multiply by confidence (0.6–1.0 → 60%–100% of base points)
  return Math.round(base * Math.max(result.confidence, 0.6));
}

/**
 * Calculate overall accuracy percentage for a game session.
 *
 * @param validPoses   number of poses correctly detected
 * @param totalFrames  total frames where a person was detected
 */
export function calculateAccuracy(validPoses: number, totalFrames: number): number {
  if (totalFrames === 0) return 0;
  return Math.min(100, Math.round((validPoses / totalFrames) * 100));
}
