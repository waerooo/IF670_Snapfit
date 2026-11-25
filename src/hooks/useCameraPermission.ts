// Camera Permission Hook — menggunakan react-native-permissions
// Memastikan permission di-request saat runtime (OWASP M8 compliant)

import {useEffect, useState, useCallback} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';

const CAMERA_PERMISSION: Permission = Platform.select({
  android: PERMISSIONS.ANDROID.CAMERA,
  ios: PERMISSIONS.IOS.CAMERA,
}) as Permission;

export const useCameraPermission = () => {
  const [status, setStatus] = useState<PermissionStatus>('denied');
  const [isLoading, setIsLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await check(CAMERA_PERMISSION);
      switch (result) {
        case RESULTS.GRANTED:
          setStatus('granted');
          break;
        case RESULTS.BLOCKED:
          setStatus('blocked');
          break;
        case RESULTS.UNAVAILABLE:
          setStatus('unavailable');
          break;
        default:
          setStatus('denied');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const result = await request(CAMERA_PERMISSION);
    if (result === RESULTS.GRANTED) {
      setStatus('granted');
      return true;
    } else if (result === RESULTS.BLOCKED) {
      setStatus('blocked');
      Alert.alert(
        'Izin Kamera Diperlukan',
        'SnapFit membutuhkan akses kamera untuk Pose Detection. Silakan aktifkan izin kamera di Pengaturan.',
        [
          {text: 'Batal', style: 'cancel'},
          {text: 'Buka Pengaturan', onPress: () => Linking.openSettings()},
        ],
      );
      return false;
    }
    setStatus('denied');
    return false;
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    status,
    isLoading,
    isGranted: status === 'granted',
    requestPermission,
    checkPermission,
  };
};
