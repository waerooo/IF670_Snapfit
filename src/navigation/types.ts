import type {NativeStackScreenProps} from '@react-navigation/native-stack';

/**
 * Daftar semua layar dan parameter yang dikirim ke tiap layar.
 * `undefined` berarti layar itu tidak butuh parameter.
 */
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Game: undefined;
  Achievements: undefined;
  Settings: undefined;
};

/** Tipe props untuk sebuah layar: berisi `navigation` dan `route`. */
export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
