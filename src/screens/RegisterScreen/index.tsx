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
import { createUserWithEmailAndPassword } from '../../services/firebase/authService';

interface RegisterScreenProps {
  onPressLogin: () => void;
}

function getRegistrationErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined;

  switch (code) {
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar. Silakan masuk.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
    case 'auth/operation-not-allowed':
      return 'Pendaftaran email dan kata sandi belum diaktifkan di Firebase.';
    case 'auth/network-request-failed':
      return 'Tidak dapat terhubung. Periksa koneksi internet.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Coba lagi nanti.';
    default:
      return 'Akun gagal dibuat. Silakan coba lagi.';
  }
}

function RegisterScreen({ onPressLogin }: RegisterScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password || !confirmPassword) {
      setErrorMessage('Lengkapi email dan kedua kolom kata sandi.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Kata sandi harus terdiri dari minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(normalizedEmail, password);
    } catch (error) {
      setErrorMessage(getRegistrationErrorMessage(error));
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
            <Text style={styles.subtitle}>Mulai perjalanan aktifmu</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.heading}>Buat akun</Text>
            <Text style={styles.helper}>Daftar untuk menyimpan progres game kamu.</Text>

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
              testID="register-email"
              textContentType="emailAddress"
              value={email}
            />

            <Text style={styles.label}>Kata sandi</Text>
            <View style={styles.passwordField}>
              <TextInput
                accessibilityLabel="Kata sandi"
                autoCapitalize="none"
                autoComplete="new-password"
                onChangeText={value => {
                  setPassword(value);
                  setErrorMessage('');
                }}
                placeholder="Minimal 6 karakter"
                placeholderTextColor="#77778A"
                returnKeyType="next"
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
                testID="register-password"
                textContentType="newPassword"
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

            <Text style={styles.label}>Konfirmasi kata sandi</Text>
            <TextInput
              accessibilityLabel="Konfirmasi kata sandi"
              autoCapitalize="none"
              autoComplete="new-password"
              onChangeText={value => {
                setConfirmPassword(value);
                setErrorMessage('');
              }}
              onSubmitEditing={handleRegister}
              placeholder="Ulangi kata sandi"
              placeholderTextColor="#77778A"
              returnKeyType="go"
              secureTextEntry={!isPasswordVisible}
              style={styles.input}
              testID="register-confirm-password"
              textContentType="newPassword"
              value={confirmPassword}
            />

            {errorMessage ? (
              <Text accessibilityLiveRegion="polite" style={styles.error}>
                {errorMessage}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isSubmitting && styles.submitButtonPressed,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              testID="register-submit">
              {isSubmitting ? (
                <ActivityIndicator color={COLORS.text} />
              ) : (
                <Text style={styles.submitButtonText}>Buat akun</Text>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={onPressLogin}
              style={styles.loginLink}
              testID="register-login">
              <Text style={styles.loginText}>
                Sudah punya akun? <Text style={styles.loginTextEmphasis}>Masuk</Text>
              </Text>
            </Pressable>
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
  brand: { alignItems: 'center', marginBottom: 36 },
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
    marginBottom: 20,
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
  loginLink: { alignItems: 'center', paddingTop: 20 },
  loginText: { color: COLORS.textSecondary, fontSize: 14 },
  loginTextEmphasis: { color: COLORS.primary, fontWeight: '700' },
});

export default RegisterScreen;
