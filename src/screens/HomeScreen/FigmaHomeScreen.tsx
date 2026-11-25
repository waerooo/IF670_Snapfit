import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import {
  FONTS,
  PALETTE,
  RADIUS,
  SIZES,
  SPACING,
  TYPOGRAPHY,
} from '../../constants';
import {DayStatus, MOCK_HOME} from '../../constants/mockData';
import type {RootScreenProps} from '../../navigation/types';

// ── Bagian kecil khusus layar ini ────────────────────────────

const DayCircle: React.FC<{day: string; status: DayStatus}> = ({
  day,
  status,
}) => (
  <View style={styles.dayItem}>
    <View
      style={[
        styles.dayCircle,
        status === 'done' && styles.dayDone,
        status === 'today' && styles.dayToday,
      ]}>
      {status === 'done' && <Text style={styles.dayCheck}>✓</Text>}
    </View>
    <Text style={styles.dayLabel}>{day}</Text>
  </View>
);

const IconButton: React.FC<{
  icon: string;
  label: string;
  onPress: () => void;
}> = ({icon, label, onPress}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={onPress}
    style={({pressed}) => [styles.iconButton, pressed && styles.iconPressed]}>
    <Text style={styles.iconText}>{icon}</Text>
  </Pressable>
);

// ── Layar ────────────────────────────────────────────────────

const HomeScreen: React.FC<RootScreenProps<'Home'>> = ({navigation}) => {
  const {displayName, streak, week} = MOCK_HOME;
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  // Status 'today' = hari ini belum main. Setelah main berubah jadi 'done'.
  const isTodayPending = week.some(item => item.status === 'today');

  return (
    <SafeAreaView style={styles.container}>
      {/* Profil */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.subtitle}>Ready to move today?</Text>
        </View>
      </View>

      {/* Streak */}
      <View style={styles.streakBlock}>
        <Text style={styles.streakTitle}>Daily Streak</Text>
        <View style={styles.streakRow}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.streakNumber}>{streak.current}</Text>
        </View>
        <Text style={styles.streakCaption}>
          days in a row · best: {streak.best}
        </Text>
      </View>

      {/* Minggu ini */}
      <View style={styles.weekCard}>
        <View style={styles.weekHeader}>
          <Text style={styles.weekTitle}>This week</Text>
          {isTodayPending && (
            <Text style={styles.weekToday}>Today: not yet played</Text>
          )}
        </View>
        <View style={styles.weekRow}>
          {week.map(item => (
            <DayCircle key={item.day} day={item.day} status={item.status} />
          ))}
        </View>
      </View>

      {/* Aksi */}
      <View style={styles.actions}>
        <IconButton
          icon="🏆"
          label="Achievements"
          onPress={() => navigation.navigate('Achievements')}
        />
        <Button
          title="▶  Play"
          onPress={() => navigation.navigate('Game')}
          style={styles.playButton}
        />
        <IconButton
          icon="⚙️"
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
    paddingHorizontal: SPACING.screenMargin,
  },

  // Profil
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    paddingTop: SPACING.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {...TYPOGRAPHY.labelMd, color: PALETTE.panel},
  name: {...TYPOGRAPHY.labelLg, color: PALETTE.white},
  subtitle: {...TYPOGRAPHY.caption, color: PALETTE.panel},

  // Streak
  streakBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTitle: {
    fontFamily: FONTS.displayItalic,
    fontSize: 26,
    lineHeight: 32,
    color: PALETTE.panel,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  flame: {fontSize: 56},
  streakNumber: {
    ...TYPOGRAPHY.counterGiant,
    color: PALETTE.white,
  },
  streakCaption: {...TYPOGRAPHY.caption, color: PALETTE.panel},

  // Minggu ini
  weekCard: {
    backgroundColor: PALETTE.backgroundElevated,
    borderRadius: RADIUS.card,
    padding: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekTitle: {...TYPOGRAPHY.labelMd, color: PALETTE.white},
  weekToday: {...TYPOGRAPHY.caption, color: PALETTE.reward},
  weekRow: {flexDirection: 'row', justifyContent: 'space-between'},
  dayItem: {alignItems: 'center', gap: SPACING.xs},
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDone: {backgroundColor: PALETTE.success},
  dayToday: {borderWidth: 2, borderColor: PALETTE.white},
  dayCheck: {color: PALETTE.background, fontWeight: 'bold'},
  dayLabel: {...TYPOGRAPHY.caption, color: PALETTE.panel},

  // Aksi
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    paddingBottom: SPACING.lg,
  },
  playButton: {flex: 1},
  iconButton: {
    width: SIZES.buttonHeight,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
    backgroundColor: PALETTE.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPressed: {opacity: 0.7},
  iconText: {fontSize: 22},
});

export default HomeScreen;
