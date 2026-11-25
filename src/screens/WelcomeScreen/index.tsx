import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import {
  PALETTE,
  SNAP_FIT_APP_NAME,
  SPACING,
  TYPOGRAPHY,
} from '../../constants';
import type {RootScreenProps} from '../../navigation/types';

const WelcomeScreen: React.FC<RootScreenProps<'Welcome'>> = ({navigation}) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.hero}>
      <Text style={styles.logo}>{SNAP_FIT_APP_NAME}</Text>
      <Text style={styles.tagline}>
        Strike a pose. Move a little, every day.
      </Text>
    </View>

    <View style={styles.actions}>
      {/* TODO: sambungkan ke LoginScreen dan RegisterScreen milik FR-05
          (Eric/Daniel) setelah pekerjaan mereka digabung. */}
      <Button title="Login" onPress={() => {}} disabled />
      <Button
        title="Create Account"
        variant="secondary"
        onPress={() => {}}
        disabled
      />
      <Pressable
        accessibilityRole="link"
        hitSlop={SPACING.md}
        onPress={() => navigation.replace('Home')}
        style={styles.guestLink}>
        <Text style={styles.guestText}>Continue as Guest</Text>
      </Pressable>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
    paddingHorizontal: SPACING.screenMargin,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  logo: {
    ...TYPOGRAPHY.displayHero,
    color: PALETTE.panel,
  },
  tagline: {
    ...TYPOGRAPHY.bodyMd,
    color: PALETTE.panel,
    textAlign: 'center',
  },
  actions: {
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  guestLink: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
  },
  guestText: {
    ...TYPOGRAPHY.labelMd,
    color: PALETTE.panel,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;
