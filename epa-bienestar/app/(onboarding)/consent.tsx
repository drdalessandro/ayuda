import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Alert from '@blazejkustra/react-native-alert';
import { router } from 'expo-router';
import {
  NameInputSection,
  ConsentCheckbox,
  OnboardingButton,
  ConsentService,
} from '@spezivibe/onboarding';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { EpaColors, Spacing } from '@/constants/theme';

export default function ConsentScreen() {
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonText');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleAgree = async () => {
    if (!givenName.trim() || !familyName.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresá tu nombre y apellido.');
      return;
    }

    if (!agreed) {
      Alert.alert('Consentimiento requerido', 'Por favor marcá la casilla para aceptar los términos.');
      return;
    }

    try {
      const consentData = ConsentService.createConsentData(givenName, familyName, true);
      await ConsentService.saveConsent(consentData);
      router.push('/(onboarding)/get-started');
    } catch {
      Alert.alert('Error', 'No se pudo guardar el consentimiento. Por favor intentá nuevamente.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.headerBadge, { backgroundColor: EpaColors.rosePetal }]}>
            <IconSymbol name="lock.shield.fill" size={20} color={EpaColors.goRed} />
            <ThemedText style={[styles.headerBadgeText, { color: EpaColors.goRed }]}>
              Consentimiento Informado
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.title}>
            Tus datos, tu control
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Antes de comenzar, necesitamos tu consentimiento para procesar tus datos de salud
          </ThemedText>
        </View>

        <View style={styles.consentDocument}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            ¿Para qué usamos tus datos?
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            EPA Bienestar procesa tus respuestas para calcular tu score cardiovascular LE8,
            generar tu Plan Bienestar 100 Días® y hacer seguimiento de tu progreso.
            Tus datos se almacenan en forma segura en nuestro servidor FHIR R4 (Medplum).
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            ¿Qué vas a hacer en la app?
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            {'• Completar la Evaluación Inicial Life\'s Essential 8 (5 minutos)\n'}
            {'• Seguir el Plan Bienestar 100 Días® (una micro-acción por día)\n'}
            {'• Hacer check-ins semanales de seguimiento\n'}
            {'• Acceder a tu historia clínica digital en cualquier momento'}
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Tu privacidad
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Tus datos nunca se venden ni se comparten con terceros sin tu autorización expresa.
            Podés solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento.
            Cumplimos con la Ley 25.326 de Protección de Datos Personales (Argentina) y HIPAA (EE.UU.).
          </ThemedText>

          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Responsable del tratamiento
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Dr. Alejandro Sergio D'Alessandro — EPA Bienestar.{'\n'}
            Ante dudas o consultas, contactanos desde la sección Contactos de la app.
          </ThemedText>
        </View>

        <View style={styles.signatureSection}>
          <ThemedText type="defaultSemiBold" style={styles.signatureTitle}>
            Tus datos
          </ThemedText>

          <NameInputSection
            givenName={givenName}
            familyName={familyName}
            onGivenNameChange={setGivenName}
            onFamilyNameChange={setFamilyName}
          />

          <ConsentCheckbox
            checked={agreed}
            onToggle={() => setAgreed(!agreed)}
            label="Leí y acepto los términos descriptos. Consiento el procesamiento de mis datos de salud por parte de EPA Bienestar para los fines indicados."
            colors={{ primaryLight: buttonBackground, primaryDark: buttonBackground, inactiveLight: '#ccc', inactiveDark: '#666' }}
            renderCheckmark={(color) => (
              <IconSymbol name="checkmark" size={16} color={color} />
            )}
          />

          <ThemedText style={styles.dateText}>
            {'Fecha: '}{new Date().toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <OnboardingButton
          label="Acepto y continúo"
          onPress={handleAgree}
          style={{ backgroundColor: buttonBackground }}
          labelStyle={{ color: buttonText, fontWeight: '700' }}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.screenTop,
    paddingBottom: Spacing.screenHorizontal,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },
  headerBadgeText: { fontSize: 13, fontWeight: '600' },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.7,
    lineHeight: 21,
  },
  consentDocument: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  signatureSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  signatureTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 13,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  footer: {
    padding: 24,
    paddingBottom: 48,
  },
});
