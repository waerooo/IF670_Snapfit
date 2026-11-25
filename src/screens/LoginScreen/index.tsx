import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SNAP_FIT_APP_NAME } from '../../constants';
import { signInWithEmailAndPassword } from '../../services/firebase/authService';

interface LoginScreenProps {
  onPressRegister: () => void;
  onPressGuest?: () => void;
}

function getSignInErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined;

  switch (code) {
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email atau kata sandi salah.';
    case 'auth/user-disabled':
      return 'Akun ini dinonaktifkan.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan masuk. Coba lagi nanti.';
    case 'auth/network-request-failed':
      return 'Tidak dapat terhubung. Periksa koneksi internet.';
    case 'auth/operation-not-allowed':
      return 'Login email dan kata sandi belum diaktifkan di Firebase.';
    default:
      return 'Gagal masuk. Silakan coba lagi.';
  }
}

function LoginScreen({ onPressRegister, onPressGuest }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setErrorMessage('Masukkan email dan kata sandi.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(normalizedEmail, password);
    } catch (error) {
      setErrorMessage(getSignInErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>S</Text>
            </View>
            <Text style={styles.title}>{SNAP_FIT_APP_NAME}</Text>
            <Text style={styles.subtitle}>Masuk dan mulai bergerak</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.heading}>Selamat datang kembali</Text>
            <Text style={styles.helper}>Masuk menggunakan akun kamu.</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={value => {
                setEmail(value);
                setErrorMessage('');
              }}
              placeholder="nama@email.com"
              placeholderTextColor="#77778A"
              returnKeyType="next"
              style={styles.input}
              testID="login-email"
              textContentType="emailAddress"
              value={email}
            />

            <Text style={styles.label}>Kata sandi</Text>
            <View style={styles.passwordField}>
              <TextInput
                accessibilityLabel="Kata sandi"
                autoCapitalize="none"
                autoComplete="password"
                onChangeText={value => {
                  setPassword(value);
                  setErrorMessage('');
                }}
                onSubmitEditing={handleSignIn}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="#77778A"
                returnKeyType="go"
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
                testID="login-password"
                textContentType="password"
                value={password}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isPasswordVisible ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'
                }
                onPress={() => setIsPasswordVisible(visible => !visible)}
                style={styles.visibilityButton}>
                <Text style={styles.visibilityText}>
                  {isPasswordVisible ? 'Sembunyikan' : 'Lihat'}
                </Text>
              </Pressable>
            </View>

            {errorMessage ? (
              <Text accessibilityLiveRegion="polite" style={styles.error}>
                {errorMessage}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isSubmitting && styles.submitButtonPressed,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              testID="login-submit">
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.submitButtonText}>Masuk</Text>
              )}
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onPressRegister}
              style={styles.registerLink}
              testID="login-register">
              <Text style={styles.registerText}>
                Belum punya akun? <Text style={styles.registerTextEmphasis}>Daftar</Text>
              </Text>
            </Pressable>

            {onPressGuest && (
              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting}
                onPress={onPressGuest}
                style={styles.guestLink}
                testID="login-guest">
                <Text style={styles.guestText}>
                  Atau coba game <Text style={styles.guestTextEmphasis}>Sebagai Tamu (Guest) →</Text>
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 36,
  },
  brand: { alignItems: 'center', marginBottom: 44 },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginBottom: 16,
  },
  logoText: { color: COLORS.text, fontSize: 34, fontWeight: '800' },
  title: { color: COLORS.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 15, marginTop: 6 },
  form: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
  },
  heading: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  helper: { color: COLORS.textSecondary, fontSize: 14, marginTop: 6, marginBottom: 24 },
  label: { color: COLORS.text, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#343449',
    borderRadius: 12,
    color: COLORS.text,
    fontSize: 15,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  passwordField: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#343449',
    borderRadius: 12,
    marginBottom: 8,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  visibilityButton: { paddingHorizontal: 12, paddingVertical: 12 },
  visibilityText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  error: {
    color: '#FF8A80',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 8,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginTop: 16,
  },
  submitButtonPressed: { opacity: 0.85 },
  submitButtonDisabled: { opacity: 0.65 },
  submitButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  registerLink: { alignItems: 'center', paddingTop: 20 },
  registerText: { color: COLORS.textSecondary, fontSize: 14 },
  registerTextEmphasis: { color: COLORS.primary, fontWeight: '700' },
  guestLink: { alignItems: 'center', paddingTop: 16, paddingBottom: 4 },
  guestText: { color: COLORS.textSecondary, fontSize: 13 },
  guestTextEmphasis: { color: '#00E5FF', fontWeight: '700' },
});

export default LoginScreen;
