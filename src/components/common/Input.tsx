import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {FONTS, PALETTE, RADIUS, SIZES, SPACING, TYPOGRAPHY} from '../../constants';

const PLACEHOLDER_COLOR = '#6A74B8';
const VALID_COLOR = '#12A844'; // hijau yang terbaca di atas latar terang

interface InputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null; // pesan error, tampil di bawah kolom
  hint?: string; // petunjuk kecil, tampil saat tidak ada error
  valid?: boolean; // tampilkan tanda centang
  icon?: string; // emoji di sisi kiri
}

/**
 * Kolom isian bergaya SnapFit.
 * Kalau `secureTextEntry` aktif, otomatis ada tombol untuk menampilkan password.
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  valid = false,
  icon,
  secureTextEntry = false,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secureTextEntry);

  const borderColor = error
    ? PALETTE.danger
    : focused
    ? PALETTE.primary
    : PALETTE.panel;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, {borderColor}]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <TextInput
          {...rest}
          accessibilityLabel={label}
          secureTextEntry={secureTextEntry && hidden}
          placeholderTextColor={PLACEHOLDER_COLOR}
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={styles.input}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={SPACING.sm}
            onPress={() => setHidden(current => !current)}>
            <Text style={styles.icon}>{hidden ? '👁️' : '🙈'}</Text>
          </Pressable>
        ) : valid ? (
          <Text style={styles.check}>✓</Text>
        ) : null}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {gap: SPACING.xs},
  label: {...TYPOGRAPHY.labelMd, color: PALETTE.ink},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    height: SIZES.inputHeight,
    backgroundColor: PALETTE.panelLight,
    borderWidth: 2,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.sm + 4,
  },
  icon: {fontSize: 16},
  check: {color: VALID_COLOR, fontSize: 16, fontWeight: 'bold'},
  input: {
    flex: 1,
    paddingVertical: 0,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: PALETTE.ink,
  },
  error: {...TYPOGRAPHY.caption, color: PALETTE.danger},
  hint: {...TYPOGRAPHY.caption, color: PALETTE.ink},
});

export default Input;
