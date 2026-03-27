import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterForm } from '@spezivibe/account';
import { useAutoSkipIfAuthenticated } from '@/hooks/use-auto-skip-if-authenticated';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useGoogleSignIn } from '@/hooks/use-google-sign-in';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { RecaptchaModal } from '@/components/auth/recaptcha-modal';
import { EpaColors } from '@/constants/theme';
import { ONBOARDING_COMPLETED_KEY } from '@/lib/constants';

const RECAPTCHA_SITE_KEY = process.env.EXPO_PUBLIC_RECAPTCHA_SITE_KEY;

export default function RegisterScreen() {
  const isSkipping = useAutoSkipIfAuthenticated();
  const tintColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonText');

  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<Record<string, unknown> | null>(null);

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
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={[styles.backArrow, { color: EpaColors.goRed }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Accedé a tu evaluación cardiovascular LE8</Text>
        </View>

        {/* Google Sign-In */}
        {googleConfigured && (
          <>
            <GoogleSignInButton
              onPress={signInWithGoogle}
              isLoading={googleLoading}
              label="Registrarse con Google"
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
        <RegisterForm
          onSuccess={handleSuccess}
          onSignInPress={() => router.push('/(onboarding)/sign-in')}
          containerStyle={styles.form}
          inputStyle={{ ...styles.input, color: textColor, borderColor, backgroundColor }}
          buttonStyle={{ ...styles.button, backgroundColor: buttonBackground }}
          buttonTextStyle={{ ...styles.buttonText, color: buttonText }}
          buttonText="Crear cuenta"
          minPasswordLength={6}
        />

        {/* reCAPTCHA note */}
        {RECAPTCHA_SITE_KEY && (
          <Text style={styles.recaptchaNote}>
            Protegido por reCAPTCHA v3 · Política de privacidad de Google
          </Text>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* reCAPTCHA modal — se activa si el servidor lo requiere */}
      {RECAPTCHA_SITE_KEY && showRecaptcha && (
        <RecaptchaModal
          siteKey={RECAPTCHA_SITE_KEY}
          visible={showRecaptcha}
          onToken={(token) => {
            setShowRecaptcha(false);
            if (pendingCredentials) {
              // credentials con token ya listos — el RegisterForm manejará el submit
              setPendingCredentials({ ...pendingCredentials, recaptchaToken: token });
            }
          }}
          onClose={() => {
            setShowRecaptcha(false);
            setPendingCredentials(null);
          }}
        />
      )}
    </KeyboardAvoidingView>
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
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    gap: 0,
  },
  header: {
    marginBottom: 28,
  },
  backBtn: {
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 24,
    fontWeight: '300',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: EpaColors.warmGrey,
    lineHeight: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 18,
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
  recaptchaNote: {
    fontSize: 11,
    color: EpaColors.warmGrey,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 13,
    color: EpaColors.inadequate,
    textAlign: 'center',
    marginTop: 6,
  },
});
