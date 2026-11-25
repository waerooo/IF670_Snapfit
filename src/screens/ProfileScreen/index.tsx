import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { signOut } from '../../services/firebase/authService';
import { fetchUserStats } from '../../services/firebase/databaseService';
import type { UserStats } from '../../types';

interface ProfileScreenProps {
  userId: string;
  email: string;
  onBack: () => void;
  onSignOut?: () => void;
}

const EMPTY_STATS: UserStats = {
  totalGames: 0,
  totalScore: 0,
  totalPoses: 0,
  bestScore: 0,
  averageAccuracy: 0,
};

function ProfileScreen({ userId, email, onBack, onSignOut }: ProfileScreenProps) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (e) {
      console.warn('[ProfileScreen] SignOut error (proceeding to reset local state):', e);
    } finally {
      setIsLoggingOut(false);
      if (onSignOut) {
        onSignOut();
      } else {
        onBack();
      }
    }
  };

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setHasError(false);

    fetchUserStats(userId)
      .then(result => {
        if (isCurrent) {
          setStats(result ?? EMPTY_STATS);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setHasError(true);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadCount, userId]);

  const displayedStats = stats ?? EMPTY_STATS;
  const statItems = [
    { key: 'games', label: 'Permainan', value: String(displayedStats.totalGames) },
    { key: 'score', label: 'Total skor', value: String(displayedStats.totalScore) },
    { key: 'best', label: 'Skor terbaik', value: String(displayedStats.bestScore) },
    { key: 'poses', label: 'Pose berhasil', value: String(displayedStats.totalPoses) },
    { key: 'accuracy', label: 'Rata-rata akurasi', value: `${displayedStats.averageAccuracy}%` },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}
          testID="profile-back">
          <Text style={styles.backText}>‹  Menu</Text>
        </Pressable>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(email.trim().charAt(0) || '?').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>Profil</Text>
          <Text style={styles.email}>{email || 'Email tidak tersedia'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Statistik permainan</Text>
        {isLoading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.statusText}>Memuat statistik...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Statistik tidak dapat dimuat. Periksa koneksi lalu coba lagi.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setReloadCount(count => count + 1)}
              style={styles.retryButton}
              testID="profile-retry">
              <Text style={styles.retryText}>Coba Lagi</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {statItems.map(item => (
              <View key={item.key} style={styles.statCard} testID={`profile-stat-${item.key}`}>
                <Text
                  style={styles.statValue}
                  testID={`profile-stat-value-${item.key}`}>
                  {item.value}
                </Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]}
          testID="profile-logout">
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#FF5252" />
          ) : (
            <Text style={styles.logoutButtonText}>🚪 Keluar dari Akun</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 32 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8, paddingRight: 14 },
  backText: { color: COLORS.primary, fontSize: 16, fontWeight: '600' },
  profileHeader: { alignItems: 'center', marginTop: 18, marginBottom: 36 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginBottom: 14,
  },
  avatarText: { color: COLORS.text, fontSize: 30, fontWeight: '800' },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '800' },
  email: { color: COLORS.textSecondary, fontSize: 14, marginTop: 6 },
  sectionTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: 14 },
  statusContainer: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  statusText: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 4,
  },
  retryText: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    flexGrow: 1,
    flexBasis: '45%',
    minHeight: 112,
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
  },
  statValue: { color: COLORS.text, fontSize: 26, fontWeight: '800' },
  statLabel: { color: COLORS.textSecondary, fontSize: 13, marginTop: 8 },
  logoutButton: {
    marginTop: 32,
    borderWidth: 1.5,
    borderColor: '#FF5252',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.08)',
  },
  logoutButtonPressed: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 82, 82, 0.16)',
  },
  logoutButtonText: {
    color: '#FF5252',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ProfileScreen;
