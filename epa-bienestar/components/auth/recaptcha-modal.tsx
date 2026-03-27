/**
 * RecaptchaModal — obtiene un token reCAPTCHA v3 de Google.
 *
 * REQUERIMIENTOS:
 *   - Requiere react-native-webview (no disponible en Expo Go).
 *   - Para usar con Expo Go: deshabilitar reCAPTCHA en Medplum
 *     (Admin → Proyecto → Security → desmarcar "Require reCAPTCHA").
 *   - Para producción: usar EAS Build o bare workflow.
 */

import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { EpaColors } from '@/constants/theme';

// Lazy require — evita error en Expo Go (donde WebView no está disponible)
let WebView: React.ComponentType<any> | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  WebView = require('react-native-webview').WebView;
} catch {
  // Expo Go: react-native-webview no disponible
}

interface RecaptchaModalProps {
  /** reCAPTCHA v3 Site Key de Google Cloud Console */
  siteKey: string;
  visible: boolean;
  onToken: (token: string) => void;
  onClose: () => void;
}

export function RecaptchaModal({ siteKey, visible, onToken, onClose }: RecaptchaModalProps) {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<any>(null);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
  <style>
    body {
      margin: 0; padding: 20px;
      display: flex; flex-direction: column;
      justify-content: center; align-items: center;
      min-height: 100vh; background: #FFFAF9;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .badge { color: #6B5B6E; font-size: 14px; text-align: center; line-height: 1.5; }
  </style>
</head>
<body>
  <p class="badge">Verificando que sos humana…</p>
  <script>
    grecaptcha.ready(function() {
      grecaptcha.execute('${siteKey}', { action: 'register' })
        .then(function(token) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ token: token }));
        })
        .catch(function(err) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ error: String(err) }));
        });
    });
  </script>
</body>
</html>`;

  // Expo Go fallback: WebView no disponible
  if (!WebView) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.fallbackCard}>
            <Text style={styles.fallbackTitle}>reCAPTCHA no disponible</Text>
            <Text style={styles.fallbackBody}>
              {`En Expo Go, WebView no está disponible.\n\nPara continuar, deshabilita reCAPTCHA en Medplum:\nAdmin → Proyecto → Security → desmarcar "Require reCAPTCHA"`}
            </Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  function handleMessage(event: { nativeEvent: { data: string } }) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.token) {
        onToken(data.token);
      } else {
        onClose();
      }
    } catch {
      onClose();
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Verificación de seguridad</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.closeX}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loaderOverlay}>
              <ActivityIndicator size="large" color={EpaColors.goRed} />
              <Text style={styles.loaderText}>Verificando…</Text>
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ html }}
            onMessage={handleMessage}
            onLoad={() => setLoading(false)}
            style={[styles.webview, loading && { opacity: 0 }]}
            javaScriptEnabled
            originWhitelist={['*']}
            // Avoids Google reCAPTCHA iframe blocked errors
            mixedContentMode="always"
            {...(Platform.OS === 'android' ? { androidLayerType: 'hardware' } : {})}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 260,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8EA',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: EpaColors.warmBlack,
  },
  closeX: {
    fontSize: 16,
    color: EpaColors.warmGrey,
  },
  webview: {
    flex: 1,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: EpaColors.warmWhite,
    zIndex: 10,
  },
  loaderText: {
    fontSize: 14,
    color: EpaColors.warmGrey,
  },
  // Expo Go fallback
  fallbackCard: {
    backgroundColor: '#FFF',
    margin: 24,
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  fallbackTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: EpaColors.warmBlack,
    textAlign: 'center',
  },
  fallbackBody: {
    fontSize: 14,
    color: EpaColors.warmGrey,
    lineHeight: 20,
    textAlign: 'center',
  },
  closeBtn: {
    backgroundColor: EpaColors.goRed,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
