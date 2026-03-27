import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { EpaColors } from '@/constants/theme';

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  label?: string;
}

export function GoogleSignInButton({
  onPress,
  isLoading = false,
  label = 'Continuar con Google',
}: GoogleSignInButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={EpaColors.warmGrey} />
      ) : (
        <GoogleLogo />
      )}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

// Inline Google "G" logo using colored squares (no SVG dependency)
function GoogleLogo() {
  return (
    <View style={styles.logo}>
      <View style={styles.logoInner}>
        <View style={[styles.segment, { backgroundColor: '#4285F4', borderTopLeftRadius: 8, borderTopRightRadius: 0 }]} />
        <View style={[styles.segment, { backgroundColor: '#EA4335', borderTopRightRadius: 8 }]} />
        <View style={[styles.segment, { backgroundColor: '#34A853', borderBottomLeftRadius: 8 }]} />
        <View style={[styles.segment, { backgroundColor: '#FBBC05', borderBottomRightRadius: 8 }]} />
      </View>
      {/* White center circle to form the "G" */}
      <View style={styles.center} />
      {/* Right notch for "G" arm */}
      <View style={styles.arm} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingVertical: 13,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3C4043',
    letterSpacing: 0.1,
  },
  // Logo: 20×20 grid of 4 colored squares with white circle overlay
  logo: {
    width: 20,
    height: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    width: 10,
    height: 10,
  },
  center: {
    position: 'absolute',
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  arm: {
    position: 'absolute',
    right: 0,
    top: 8,
    width: 6,
    height: 4,
    backgroundColor: '#4285F4',
  },
});
