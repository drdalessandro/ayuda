/**
 * useGoogleSignIn — hook para Google OAuth con expo-auth-session.
 *
 * Flujo:
 *   1. Usuario toca "Continuar con Google"
 *   2. Se abre el navegador nativo con la pantalla de Google
 *   3. El usuario elige su cuenta → Google devuelve un access token
 *   4. El token se intercambia en Medplum vía exchangeExternalAccessToken
 *   5. Se llama onSuccess() para navegar al dashboard
 *
 * CONFIGURACIÓN NECESARIA (.env):
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxx.apps.googleusercontent.com
 *   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=xxx.apps.googleusercontent.com   (para iOS)
 *   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=xxx.apps.googleusercontent.com (para Android)
 *
 * CONFIGURACIÓN EN MEDPLUM:
 *   Admin → Project → Edit → Google Auth Client ID → pegar WEB_CLIENT_ID
 *
 * CONFIGURACIÓN EN GOOGLE CLOUD CONSOLE:
 *   OAuth 2.0 Clients → Web (para Expo Go) + iOS + Android
 *   Authorized redirect URIs (web): https://auth.expo.io/@tu-usuario/epa-bienestar
 */

import { useEffect, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStandard } from '@/lib/services/standard-context';
import { ONBOARDING_COMPLETED_KEY } from '@/lib/constants';

// Required for expo-auth-session to complete the auth session on return
WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

export interface UseGoogleSignInOptions {
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export function useGoogleSignIn({ onSuccess, onError }: UseGoogleSignInOptions) {
  const { accountService } = useStandard();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    let cancelled = false;

    async function handleResponse() {
      if (!response) return;

      if (response.type === 'success') {
        const accessToken = response.authentication?.accessToken;
        if (!accessToken) {
          const msg = 'No se recibió token de Google. Intentá de nuevo.';
          setError(msg);
          onError?.(msg);
          return;
        }

        setIsLoading(true);
        setError(null);

        try {
          // Cast to access Medplum-specific method
          const service = accountService as Record<string, unknown>;
          if (typeof service.signInWithGoogle !== 'function') {
            throw new Error(
              'Google Sign-In no está configurado en el servidor. ' +
                'Verificá que el Google Client ID esté cargado en Medplum (Admin → Project → Edit).'
            );
          }

          await (service.signInWithGoogle as (token: string) => Promise<void>)(accessToken);

          if (!cancelled) {
            await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
            onSuccess();
          }
        } catch (err) {
          if (!cancelled) {
            const msg = err instanceof Error ? err.message : 'Error al iniciar sesión con Google.';
            setError(msg);
            onError?.(msg);
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      } else if (response.type === 'error') {
        const msg = 'Google canceló la autenticación. Intentá de nuevo.';
        setError(msg);
        onError?.(msg);
      }
      // 'cancel' type: user closed browser — do nothing
    }

    handleResponse();
    return () => {
      cancelled = true;
    };
  }, [response]);

  const signIn = useCallback(() => {
    setError(null);
    promptAsync();
  }, [promptAsync]);

  const isConfigured = Boolean(WEB_CLIENT_ID || IOS_CLIENT_ID || ANDROID_CLIENT_ID);

  return {
    signIn,
    isLoading,
    isReady: Boolean(request) && isConfigured,
    isConfigured,
    error,
  };
}
