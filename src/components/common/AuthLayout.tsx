import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  PALETTE,
  RADIUS,
  SNAP_FIT_APP_NAME,
  SPACING,
  TYPOGRAPHY,
} from '../../constants';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
  footerText: string; // contoh: "Already have an account?"
  footerLink: string; // contoh: "Login"
  onFooterPress: () => void;
}

/** Kerangka bersama untuk layar Login dan Register: logo, kartu form, tautan bawah. */
const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  children,
  footerText,
  footerLink,
  onFooterPress,
}) => (
  <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>{SNAP_FIT_APP_NAME}</Text>

        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {children}
        </View>

        <Text style={styles.footerText}>
          {footerText}{' '}
          <Text
            accessibilityRole="link"
            style={styles.footerLink}
            onPress={onFooterPress}>
            {footerLink}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: PALETTE.background},
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.screenMargin,
    gap: SPACING.lg,
  },
  logo: {
    ...TYPOGRAPHY.displayHero,
    color: PALETTE.panel,
    textAlign: 'center',
  },
  card: {
    backgroundColor: PALETTE.panel,
    borderWidth: 3,
    borderColor: PALETTE.primary,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  title: {...TYPOGRAPHY.headlineMd, color: PALETTE.ink, textAlign: 'center'},
  footerText: {
    ...TYPOGRAPHY.bodyMd,
    color: PALETTE.panel,
    textAlign: 'center',
  },
  footerLink: {
    ...TYPOGRAPHY.labelMd,
    color: PALETTE.white,
    textDecorationLine: 'underline',
  },
});

export default AuthLayout;
