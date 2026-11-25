import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';
import {AchievementItem, MOCK_ACHIEVEMENTS} from '../../constants/mockData';
import type {RootScreenProps} from '../../navigation/types';

const isUnlocked = (item: AchievementItem) => item.unlockedAt !== undefined;

const ProgressBar: React.FC<{value: number}> = ({value}) => (
  <View style={styles.track}>
    <View style={[styles.fill, {width: `${Math.min(100, value * 100)}%`}]} />
  </View>
);

const AchievementCard: React.FC<{item: AchievementItem}> = ({item}) => {
  const unlocked = isUnlocked(item);
  return (
    <View style={[styles.card, !unlocked && styles.cardLocked]}>
      <View style={styles.cardIcon}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
        {!unlocked && <ProgressBar value={item.progress / item.target} />}
      </View>
      {unlocked ? (
        <View style={styles.doneChip}>
          <Text style={styles.doneText}>✓ Done</Text>
        </View>
      ) : (
        <Text style={styles.count}>
          {item.progress}/{item.target}
        </Text>
      )}
    </View>
  );
};

const AchievementsScreen: React.FC<RootScreenProps<'Achievements'>> = ({
  navigation,
}) => {
  const unlockedCount = MOCK_ACHIEVEMENTS.filter(isUnlocked).length;
  const total = MOCK_ACHIEVEMENTS.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kembali"
          hitSlop={SPACING.md}
          onPress={() => navigation.goBack()}>
          <Text style={styles.back}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Achievements</Text>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {unlockedCount} of {total} unlocked
        </Text>
        <ProgressBar value={unlockedCount / total} />
      </View>

      <FlatList
        data={MOCK_ACHIEVEMENTS}
        keyExtractor={item => item.id}
        renderItem={({item}) => <AchievementCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
    paddingHorizontal: SPACING.screenMargin,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingTop: SPACING.md,
  },
  back: {fontSize: 36, lineHeight: 36, color: PALETTE.white},
  title: {...TYPOGRAPHY.headlineLg, color: PALETTE.white},
  summary: {gap: SPACING.sm, marginVertical: SPACING.md},
  summaryText: {...TYPOGRAPHY.labelMd, color: PALETTE.panel},
  list: {gap: SPACING.sm + 4, paddingBottom: SPACING.lg},

  // Progress bar
  track: {
    height: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.secondaryShadow,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.primary,
  },

  // Kartu
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm + 4,
    backgroundColor: PALETTE.panel,
    borderRadius: RADIUS.button,
    padding: SPACING.sm + 4,
  },
  cardLocked: {opacity: 0.8},
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.input,
    backgroundColor: PALETTE.panelLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {fontSize: 22},
  cardBody: {flex: 1, gap: SPACING.xs},
  cardTitle: {...TYPOGRAPHY.titleSm, color: PALETTE.ink},
  cardDesc: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  doneChip: {
    backgroundColor: PALETTE.panelLight,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm + 2,
  },
  doneText: {...TYPOGRAPHY.caption, color: '#12A844'},
  count: {...TYPOGRAPHY.labelMd, color: PALETTE.ink},
});

export default AchievementsScreen;
