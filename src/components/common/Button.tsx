import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {PALETTE, RADIUS, SIZES, SPACING, TYPOGRAPHY} from '../../constants';

// 'outline' dipakai bila tombol berada di atas kartu terang (dialog), karena
// warna 'secondary' sama dengan warna kartu dan akan menyatu dengan latarnya.
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Warna tiap varian: face = permukaan, rim = "alas" 3D di bawahnya.
const VARIANTS: Record<
  ButtonVariant,
  {face: string; rim: string; label: string; border?: string}
> = {
  primary: {
    face: PALETTE.primary,
    rim: PALETTE.primaryShadow,
    label: PALETTE.white,
  },
  secondary: {
    face: PALETTE.panel,
    rim: PALETTE.secondaryShadow,
    label: PALETTE.ink,
  },
  outline: {
    face: PALETTE.panelLight,
    rim: 'transparent',
    label: PALETTE.ink,
    border: PALETTE.primary,
  },
  destructive: {
    face: PALETTE.white,
    rim: 'transparent',
    label: PALETTE.danger,
    border: PALETTE.danger,
  },
};

/**
 * Tombol 3D bergaya arcade. Efek "tebal" dibuat dari dua View bertumpuk:
 * alas (rim) diam di bawah, permukaan (face) turun saat ditekan.
 * Tidak memakai boxShadow supaya jalan di arsitektur lama maupun baru.
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const v = VARIANTS[variant];
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: inactive, busy: loading}}
      disabled={inactive}
      onPress={onPress}
      style={[styles.wrapper, inactive && styles.inactive, style]}>
      {({pressed}) => (
        <>
          <View style={[styles.rim, {backgroundColor: v.rim}]} />
          <View
            style={[
              styles.face,
              {
                backgroundColor: v.face,
                marginTop: pressed ? SIZES.buttonPress : 0,
              },
              v.border ? {borderWidth: 2, borderColor: v.border} : null,
            ]}>
            {loading ? (
              <ActivityIndicator color={v.label} />
            ) : (
              <Text style={[styles.label, {color: v.label}]}>{title}</Text>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: SIZES.buttonHeight + SIZES.buttonDepth,
    alignSelf: 'stretch',
  },
  rim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
  },
  face: {
    height: SIZES.buttonHeight,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.labelLg,
  },
  inactive: {
    opacity: 0.5,
  },
});

export default Button;
