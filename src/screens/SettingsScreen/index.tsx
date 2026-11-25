import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import {PALETTE, RADIUS, SPACING, TYPOGRAPHY} from '../../constants';
import {MOCK_STATISTICS} from '../../constants/mockData';
import type {RootScreenProps} from '../../navigation/types';

const SwitchRow: React.FC<{
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}> = ({label, value, onChange}) => (
  <View style={styles.switchRow}>
    <Text style={styles.switchLabel}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{false: PALETTE.secondaryShadow, true: PALETTE.success}}
      thumbColor={PALETTE.white}
    />
  </View>
);

const SettingsScreen: React.FC<RootScreenProps<'Settings'>> = ({
  navigation,
}) => {
  // TODO: simpan pengaturan audio (AsyncStorage atau Firebase) bila diperlukan
  const [soundEffect, setSoundEffect] = useState(true);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLogOut = () => {
    // TODO: panggil authService.signOut() saat login (FR-05) selesai
    navigation.reset({index: 0, routes: [{name: 'Welcome'}]});
  };

  const handleDeleteData = () => {
    // TODO: panggil fungsi hapus data dari backend (belum ada di databaseService)
    setConfirmDelete(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tutup"
          hitSlop={SPACING.sm}
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statGrid}>
          {MOCK_STATISTICS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Audio</Text>
        <View style={styles.card}>
          <SwitchRow
            label="Sound Effect"
            value={soundEffect}
            onChange={setSoundEffect}
          />
          <SwitchRow
            label="Background Music"
            value={backgroundMusic}
            onChange={setBackgroundMusic}
          />
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.accountButtons}>
          <Button title="Log Out" variant="secondary" onPress={handleLogOut} />
          <Button
            title="Delete User Data"
            variant="destructive"
            onPress={() => setConfirmDelete(true)}
          />
        </View>

        <Text style={styles.footer}>SnapFit v1.0 · Kelompok 8</Text>
      </ScrollView>

      {/* Dialog konfirmasi hapus data */}
      <Modal
        visible={confirmDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDelete(false)}>
        <View style={styles.overlay}>
          <View style={styles.dialog}>
            <Text style={styles.dialogIcon}>⚠️</Text>
            <Text style={styles.dialogTitle}>Delete all your data?</Text>
            <Text style={styles.dialogText}>
              Your streak, poses, and achievements will be permanently removed.
              This can't be undone.
            </Text>
            <Button
              title="Yes, delete everything"
              variant="destructive"
              onPress={handleDeleteData}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setConfirmDelete(false)}
            />
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    paddingTop: SPACING.md,
  },
  title: {...TYPOGRAPHY.headlineLg, color: PALETTE.white},
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.pill,
    backgroundColor: PALETTE.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {color: PALETTE.white, fontSize: 16},
  content: {paddingBottom: SPACING.lg},
  sectionTitle: {
    ...TYPOGRAPHY.labelMd,
    color: PALETTE.panel,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  // Statistik
  statGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm},
  statCard: {
    width: '48%',
    backgroundColor: PALETTE.panelLight,
    borderRadius: RADIUS.input,
    padding: SPACING.sm + 4,
  },
  statLabel: {...TYPOGRAPHY.caption, color: PALETTE.ink},
  statValue: {...TYPOGRAPHY.headlineMd, color: PALETTE.ink},

  // Audio
  card: {
    backgroundColor: PALETTE.panel,
    borderRadius: RADIUS.button,
    paddingHorizontal: SPACING.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  switchLabel: {...TYPOGRAPHY.labelMd, color: PALETTE.ink},

  // Akun
  accountButtons: {gap: SPACING.md},
  footer: {
    ...TYPOGRAPHY.caption,
    color: PALETTE.panel,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },

  // Dialog
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 0, 63, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.screenMargin,
  },
  dialog: {
    width: '100%',
    backgroundColor: PALETTE.panel,
    borderWidth: 3,
    borderColor: PALETTE.primary,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  dialogIcon: {fontSize: 36, textAlign: 'center'},
  dialogTitle: {
    ...TYPOGRAPHY.headlineMd,
    color: PALETTE.ink,
    textAlign: 'center',
  },
  dialogText: {
    ...TYPOGRAPHY.bodyMd,
    color: PALETTE.ink,
    textAlign: 'center',
  },
});

export default SettingsScreen;
