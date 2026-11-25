import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useCameraPermission} from '../../hooks/useCameraPermission';
import {COLORS} from '../../constants';

interface CameraViewProps {
  onCameraReady?: () => void;
  style?: object;
}

const CameraView: React.FC<CameraViewProps> = ({onCameraReady, style}) => {
  const {isGranted, isLoading, requestPermission} = useCameraPermission();
  const device = useCameraDevice('front'); // Pakai kamera depan untuk pose detection

  if (isLoading) {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Memeriksa izin kamera...</Text>
      </View>
    );
  }

  if (!isGranted) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.icon}>📷</Text>
        <Text style={styles.text}>Izin kamera diperlukan</Text>
        <Text style={styles.subText}>
          SnapFit perlu mengakses kamera untuk mendeteksi posemu
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.text}>Kamera tidak tersedia di perangkat ini</Text>
      </View>
    );
  }

  return (
    <Camera
      style={[styles.camera, style]}
      device={device}
      isActive={true}
      onInitialized={onCameraReady}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  camera: {
    flex: 1,
  },
  icon: {
    fontSize: 48,
  },
  text: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraView;
