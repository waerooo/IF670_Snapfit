<<<<<<< Updated upstream
// TODO
=======
import React from 'react';
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SNAP_FIT_APP_NAME } from '../../constants';

interface HomeScreenProps {
  email: string;
  onOpenProfile: () => void;
  onStartGame: () => void;
  onOpenSettings: () => void;
}

function HomeScreen({ email, onOpenProfile, onStartGame, onOpenSettings }: HomeScreenProps) {
  const displayName = email.split('@')[0] || 'SnapFit';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>S</Text>
          </View>
          <Text style={styles.appName}>{SNAP_FIT_APP_NAME}</Text>
          <View style={styles.settingsBox}>
            <Pressable
            accessibilityRole='button'
            onPress={onOpenSettings}
            testID='menu-settings'>
              {({pressed}) => (
                <Text style={[styles.settingsText, pressed && styles.settingsTextPressed]}>
                  Settings
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        <Text style={styles.greeting}>Halo, {displayName}!</Text>
        <Text style={styles.subtitle}>Siap bergerak hari ini?</Text>

        <Pressable
          accessibilityRole="button"
          onPress={onStartGame}
          style={({ pressed }) => [styles.gameCard, pressed && styles.pressed]}
          testID="menu-play">
          <Text style={styles.gameEmoji}>💪</Text>
          <Text style={styles.gameTitle}>Mulai Gameplay</Text>
          <Text style={styles.gameDescription}>
            Ikuti tantangan pose dan kumpulkan skor.
          </Text>
          <View style={styles.playButton}>
            <Text style={styles.playButtonText}>Mulai Bermain</Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onOpenProfile}
          style={({ pressed }) => [styles.profileCard, pressed && styles.pressed]}
          testID="menu-profile">
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.profileTitle}>Profil & Statistik</Text>
            <Text style={styles.profileDescription}>
              Lihat progres dan catatan permainan kamu.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  brandMarkText: { color: COLORS.text, fontSize: 22, fontWeight: '800' },
  appName: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  greeting: { color: COLORS.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: COLORS.textSecondary, fontSize: 16, marginTop: 6, marginBottom: 28 },
  gameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#343449',
    padding: 24,
    marginBottom: 16,
  },
  gameEmoji: { fontSize: 36, marginBottom: 14 },
  gameTitle: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  gameDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  playButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    marginTop: 22,
  },
  playButtonText: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  profileCard: {
    minHeight: 90,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#343449',
    marginRight: 14,
  },
  avatarText: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  profileCopy: { flex: 1 },
  profileTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  profileDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  chevron: { color: COLORS.textSecondary, fontSize: 28, marginLeft: 8 },
  pressed: { opacity: 0.82 },
  settingsBox: {
    flex: 1, /*fills up the rest available parent flexbox volume*/
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  settingsText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500'
  },
  settingsTextPressed: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700'
  },
});

export default HomeScreen;
>>>>>>> Stashed changes
