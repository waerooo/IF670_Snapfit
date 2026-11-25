/**
 * Wraps the native Android ML Kit Pose Detection module.
 * On-device inference only — no data ever leaves the device (NFR-02).
 *
 * Native dependency (android/app/build.gradle):
 *   implementation 'com.google.mlkit:pose-detection:18.0.0-beta5'
 *   implementation 'com.google.mlkit:pose-detection-accurate:18.0.0-beta5'
 */

import {NativeModules, Platform} from 'react-native';
import type {DetectedPose, PoseLandmark} from '../../types';
import {PoseLandmarkType} from '../../types';

// ── Native Module Bridge ─────────────────────────────────────

interface MLKitPoseDetectionModule {
  /**
   * Detect pose from a photo URI (file:// or content://).
   * Returns a JSON-serialised DetectedPose or null if no person found.
   */
  detectPose(imageUri: string): Promise<string | null>;

  /**
   * Process a base64-encoded JPEG frame (from VisionCamera snapshot).
   * Returns a JSON-serialised DetectedPose or null.
   */
  detectPoseFromBase64(base64: string): Promise<string | null>;

  /** Release native detector resources. Call on unmount. */
  release(): Promise<void>;
}

const { MLKitPoseDetection } = NativeModules as {
  MLKitPoseDetection: MLKitPoseDetectionModule;
};

// ── Type Guards ──────────────────────────────────────────────

function isAndroid(): boolean {
  return Platform.OS === 'android';
}

function assertAndroid(): void {
  if (!isAndroid()) {
    throw new Error('MLKit Pose Detection is Android-only in this build.');
  }
}

// ── Public Service ───────────────────────────────────────────

/**
 * Detect a human pose from a photo file URI.
 *
 * @param imageUri  file:// URI from Camera.takePhoto()
 * @returns         DetectedPose with 33 landmarks, or null
 */
export async function detectPoseFromPhoto(
  imageUri: string,
): Promise<DetectedPose | null> {
  assertAndroid();

  if (!MLKitPoseDetection) {
    console.warn(
      '[PoseDetection] Native module not linked. ' +
      'Run `npx react-native run-android` to rebuild.',
    );
    return _mockPose(); // fallback for JS-only testing
  }

  try {
    const raw = await MLKitPoseDetection.detectPose(imageUri);
    if (!raw) return null;
    return JSON.parse(raw) as DetectedPose;
  } catch (err) {
    console.error('[PoseDetection] detectPoseFromPhoto error:', err);
    return null;
  }
}

/**
 * Detect a human pose from a base64 JPEG string.
 * Use this when capturing VisionCamera snapshots in JS.
 *
 * @param base64  JPEG bytes as base64 string (no data: prefix)
 * @returns       DetectedPose or null
 */
export async function detectPoseFromBase64(
  base64: string,
): Promise<DetectedPose | null> {
  assertAndroid();

  if (!MLKitPoseDetection) {
    return _mockPose();
  }

  try {
    const raw = await MLKitPoseDetection.detectPoseFromBase64(base64);
    if (!raw) return null;
    return JSON.parse(raw) as DetectedPose;
  } catch (err) {
    console.error('[PoseDetection] detectPoseFromBase64 error:', err);
    return null;
  }
}

/**
 * Release the ML Kit detector.
 * Call inside a useEffect cleanup when the game screen unmounts.
 */
export async function releasePoseDetector(): Promise<void> {
  if (!MLKitPoseDetection) return;
  try {
    await MLKitPoseDetection.release();
  } catch (_) {
    /* ignore */
  }
}

// ── Landmark Helper ──────────────────────────────────────────

/**
 * Get a specific landmark from a detected pose by its type.
 */
export function getLandmark(
  pose: DetectedPose,
  type: PoseLandmarkType,
): PoseLandmark | undefined {
  return pose.landmarks.find(lm => lm.type === type);
}

// ── Mock (JS-only dev / unit tests) ─────────────────────────

function _mockPose(): DetectedPose {
  const landmarks: PoseLandmark[] = Array.from({ length: 33 }, (_, i) => ({
    type: i as PoseLandmarkType,
    x: 0.5 + (Math.random() - 0.5) * 0.2,
    y: 0.3 + i * 0.02 + (Math.random() - 0.5) * 0.05,
    z: 0,
    likelihood: 0.85 + Math.random() * 0.15,
  }));
  return { landmarks, timestamp: Date.now() };
}
