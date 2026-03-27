import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignInForm } from '@spezivibe/account';
import { useAutoSkipIfAuthenticated } from '@/hooks/use-auto-skip-if-authenticated';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useGoogleSignIn } from '@/hooks/use-google-sign-in';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { EpaColors } from '@/constants/theme';
import { ONBOARDING_COMPLETED_KEY } from '@/lib/constants';

export default function SignInScreen() {
  const isSkipping = useAutoSkipIfAuthenticated();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonText');

  const [googleError, setGoogleError] = useState<string | null>(null);

  async function handleSuccess() {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    router.replace('/(tabs)');
  }

  const { signIn: signInWithGoogle, isLoading: googleLoading, isConfigured: googleConfigured } =
    useGoogleSignIn({
      onSuccess: handleSuccess,
      onError: setGoogleError,
    });

  if (isSkipping) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={tintColor} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Red top band */}
      <View style={styles.topBand}>
        <Text style={styles.appName}>EPA Bienestar</Text>
        <Text style={styles.subtitle}>Iniciá sesión para continuar</Text>
      </View>

      <View style={styles.content}>
        {/* Google Sign-In — solo si está configurado */}
        {googleConfigured && (
          <>
            <GoogleSignInButton
              onPress={signInWithGoogle}
              isLoading={googleLoading}
            />
            {googleError && <Text style={styles.errorText}>{googleError}</Text>}

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
              <Text style={[styles.dividerText, { color: EpaColors.warmGrey }]}>o con email</Text>
              <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
            </View>
          </>
        )}

        {/* Email/password form */}
        <SignInForm
          onSuccess={handleSuccess}
          showRegisterLink={false}
          containerStyle={styles.form}
          inputStyle={{ ...styles.input, color: textColor, borderColor, backgroundColor }}
          buttonStyle={{ ...styles.button, backgroundColor: buttonBackground }}
          buttonTextStyle={{ ...styles.buttonText, color: buttonText }}
          buttonText="Iniciar sesión"
        />

        {/* Bottom links */}
        <View style={styles.links}>
          <TouchableOpacity onPress={() => router.push('/(onboarding)/register')}>
            <Text style={[styles.linkText, { color: EpaColors.goRed }]}>
              ¿No tenés cuenta? <Text style={styles.linkBold}>Registrate</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(onboarding)/forgot-password')}>
            <Text style={[styles.linkText, { color: EpaColors.warmGrey }]}>
              Olvidé mi contraseña
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBand: {
    backgroundColor: EpaColors.goRed,
    paddingTop: 64,
    paddingBottom: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 6,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 28,
    gap: 0,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  links: {
    marginTop: 20,
    gap: 14,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
  },
  linkBold: {
    fontWeight: '700',
  },
  errorText: {
    fontSize: 13,
    color: EpaColors.inadequate,
    textAlign: 'center',
    marginTop: 6,
  },
});
