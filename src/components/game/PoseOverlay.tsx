import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import type { PoseLandmark } from '../../types';
import { PoseLandmarkType } from '../../types';

interface PoseOverlayProps {
  landmarks: PoseLandmark[] | null;
  isMatched?: boolean;
  resizeMode?: 'cover' | 'contain';
}

// Pairs of landmarks to connect with skeleton bones
const SKELETON_CONNECTIONS: [PoseLandmarkType, PoseLandmarkType][] = [
  // Torso
  [PoseLandmarkType.LEFT_SHOULDER, PoseLandmarkType.RIGHT_SHOULDER],
  [PoseLandmarkType.LEFT_SHOULDER, PoseLandmarkType.LEFT_HIP],
  [PoseLandmarkType.RIGHT_SHOULDER, PoseLandmarkType.RIGHT_HIP],
  [PoseLandmarkType.LEFT_HIP, PoseLandmarkType.RIGHT_HIP],

  // Left Arm
  [PoseLandmarkType.LEFT_SHOULDER, PoseLandmarkType.LEFT_ELBOW],
  [PoseLandmarkType.LEFT_ELBOW, PoseLandmarkType.LEFT_WRIST],

  // Right Arm
  [PoseLandmarkType.RIGHT_SHOULDER, PoseLandmarkType.RIGHT_ELBOW],
  [PoseLandmarkType.RIGHT_ELBOW, PoseLandmarkType.RIGHT_WRIST],

  // Left Leg
  [PoseLandmarkType.LEFT_HIP, PoseLandmarkType.LEFT_KNEE],
  [PoseLandmarkType.LEFT_KNEE, PoseLandmarkType.LEFT_ANKLE],

  // Right Leg
  [PoseLandmarkType.RIGHT_HIP, PoseLandmarkType.RIGHT_KNEE],
  [PoseLandmarkType.RIGHT_KNEE, PoseLandmarkType.RIGHT_ANKLE],
];

// Key joints to highlight with circular points
const KEY_JOINTS: PoseLandmarkType[] = [
  PoseLandmarkType.NOSE,
  PoseLandmarkType.LEFT_SHOULDER,
  PoseLandmarkType.RIGHT_SHOULDER,
  PoseLandmarkType.LEFT_ELBOW,
  PoseLandmarkType.RIGHT_ELBOW,
  PoseLandmarkType.LEFT_WRIST,
  PoseLandmarkType.RIGHT_WRIST,
  PoseLandmarkType.LEFT_HIP,
  PoseLandmarkType.RIGHT_HIP,
  PoseLandmarkType.LEFT_KNEE,
  PoseLandmarkType.RIGHT_KNEE,
  PoseLandmarkType.LEFT_ANKLE,
  PoseLandmarkType.RIGHT_ANKLE,
];

const BONE_THICKNESS = 5;
// Standard portrait camera sensor aspect ratio (width / height = 3 / 4 = 0.75)
const CAMERA_ASPECT = 0.75;

export const PoseOverlay: React.FC<PoseOverlayProps> = ({
  landmarks,
  isMatched = false,
  resizeMode = 'cover',
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  if (!landmarks || landmarks.length === 0) return null;

  const jointColor = isMatched ? '#00FF66' : '#00E5FF';
  const boneColor = isMatched ? 'rgba(0, 255, 102, 0.85)' : 'rgba(0, 229, 255, 0.75)';

  // Quick lookup map for detected landmarks with sufficient confidence
  const landmarkMap = new Map<number, PoseLandmark>();
  for (const lm of landmarks) {
    if (lm.likelihood >= 0.3) {
      landmarkMap.set(lm.type, lm);
    }
  }

  // Direct 1:1 coordinate mapper (matches real-time user movement without inverted mirroring)
  const getCoordinates = (normX: number, normY: number) => {
    if (resizeMode === 'contain') {
      // In contain mode: width fits screen, height is centered with top/bottom letterbox
      const renderedHeight = screenWidth / CAMERA_ASPECT;
      const offsetY = (screenHeight - renderedHeight) / 2;
      return {
        x: normX * screenWidth,
        y: offsetY + normY * renderedHeight,
      };
    } else {
      // In cover mode: height fits screen, width is centered with left/right cropping
      const renderedWidth = screenHeight * CAMERA_ASPECT;
      const offsetX = (screenWidth - renderedWidth) / 2;
      return {
        x: offsetX + normX * renderedWidth,
        y: normY * screenHeight,
      };
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* ── Skeleton Bones (Connecting Lines via Midpoint Geometry) ── */}
      {SKELETON_CONNECTIONS.map(([startType, endType], idx) => {
        const start = landmarkMap.get(startType);
        const end = landmarkMap.get(endType);
        if (!start || !end) return null;

        const p1 = getCoordinates(start.x, start.y);
        const p2 = getCoordinates(end.x, end.y);

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length < 1) return null;

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        return (
          <View
            key={`bone-${idx}`}
            style={[
              styles.bone,
              {
                left: midX - length / 2,
                top: midY - BONE_THICKNESS / 2,
                width: length,
                height: BONE_THICKNESS,
                backgroundColor: boneColor,
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          />
        );
      })}

      {/* ── Skeleton Joints (Glowing Points) ── */}
      {KEY_JOINTS.map(jointType => {
        const lm = landmarkMap.get(jointType);
        if (!lm) return null;

        const p = getCoordinates(lm.x, lm.y);
        const isHead = jointType === PoseLandmarkType.NOSE;
        const size = isHead ? 20 : 14;

        return (
          <View
            key={`joint-${jointType}`}
            style={[
              styles.joint,
              {
                left: p.x - size / 2,
                top: p.y - size / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: jointColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  joint: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
    elevation: 6,
  },
  bone: {
    position: 'absolute',
    borderRadius: BONE_THICKNESS / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 3,
    elevation: 4,
  },
});

export default PoseOverlay;
