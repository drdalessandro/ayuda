import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EpaColors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

const PROPS = [
  {
    icon: 'heart.fill' as const,
    color: EpaColors.goRed,
    title: 'Evaluación Cardiovascular',
    description:
      'Conocé tu score LE8 en 5 minutos. 8 esenciales de la American Heart Association adaptados a la menopausia.',
  },
  {
    icon: 'calendar.badge.checkmark' as const,
    color: EpaColors.plum,
    title: 'Plan Bienestar 100 Días®',
    description:
      "Un plan personalizado del Dr. Alejandro D'Alessandro basado en tu evaluación. Una acción por día.",
  },
  {
    icon: 'person.2.fill' as const,
    color: '#2E7D32',
    title: 'Acompañamiento Real',
    description:
      'Aval de la Federación Argentina de Cardiología y el programa Go Red For Women (AHA). No estás sola.',
  },
] as const;

export default function WelcomeScreen() {
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonText');
  const background = useThemeColor({}, 'background');

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Banda superior Go Red */}
        <View style={[styles.heroBand, { backgroundColor: EpaColors.goRed }]}>
          <View style={styles.heroContent}>
            <IconSymbol name="heart.fill" size={48} color="#fff" />
            <ThemedText style={styles.heroTitle}>EPA Bienestar</ThemedText>
            <ThemedText style={styles.heroTagline}>
              Salud Cardiovascular de la Mujer
            </ThemedText>
            <View style={styles.heroBadges}>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>Go Red For Women</ThemedText>
              </View>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>FAC</ThemedText>
              </View>
            </View>
          </View>
        </View>

        {/* Dato de impacto */}
        <View style={[styles.impactCard, { backgroundColor: EpaColors.rosePetal }]}>
          <ThemedText style={[styles.impactNumber, { color: EpaColors.goRed }]}>
            2×
          </ThemedText>
          <ThemedText style={[styles.impactText, { color: EpaColors.warmBlack }]}>
            {'La menopausia '}
            <ThemedText style={[styles.impactBold, { color: EpaColors.goRed }]}>
              duplica el riesgo cardiovascular
            </ThemedText>
            {' en la mujer.\n'}
            {'El infarto es la primera causa de muerte femenina en LatAm.\n'}
            <ThemedText style={[styles.impactBold, { color: EpaColors.goRed }]}>
              Nadie te lo había dicho así.
            </ThemedText>
          </ThemedText>
        </View>

        {/* Propuesta de valor */}
        <View style={styles.propsSection}>
          <ThemedText style={styles.propsTitle}>
            Empezá a cuidar tu corazón hoy
          </ThemedText>

          {PROPS.map((prop, i) => (
            <View key={i} style={[styles.propItem, { backgroundColor: background, borderColor: EpaColors.goRed + '20' }]}>
              <View style={[styles.propIcon, { backgroundColor: prop.color + '18' }]}>
                <IconSymbol name={prop.icon} size={26} color={prop.color} />
              </View>
              <View style={styles.propText}>
                <ThemedText style={styles.propTitle}>{prop.title}</ThemedText>
                <ThemedText style={styles.propDescription}>{prop.description}</ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Firma */}
        <View style={styles.signatureRow}>
          <IconSymbol name="stethoscope" size={16} color={EpaColors.warmGrey} />
          <ThemedText style={[styles.signatureText, { color: EpaColors.warmGrey }]}>
            {"  Dr. Alejandro Sergio D'Alessandro · Cardiólogo"}
          </ThemedText>
        </View>

        {/* Nota de privacidad */}
        <ThemedText style={[styles.privacyNote, { color: EpaColors.warmGrey }]}>
          {'Tus datos son tuyos. Nunca los vendemos.\n'}
          {'Ley 25.326 (Argentina) · HIPAA (EE.UU.)'}
        </ThemedText>

        {/* CTA principal */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: buttonBackground, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push('/(onboarding)/features')}
          accessibilityRole="button"
          accessibilityLabel="Comenzar evaluación cardiovascular">
          <IconSymbol name="heart.fill" size={18} color={buttonText} />
          <ThemedText style={[styles.buttonText, { color: buttonText }]}>
            {'  Comenzar mi evaluación'}
          </ThemedText>
        </Pressable>

        {/* CTA secundario */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/(onboarding)/sign-in')}
          accessibilityRole="button"
          accessibilityLabel="Ya tengo cuenta, iniciar sesión">
          <ThemedText style={[styles.secondaryText, { color: buttonBackground }]}>
            Ya tengo cuenta — Iniciar sesión
          </ThemedText>
        </Pressable>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 48 },

  heroBand: {
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: Spacing.screenHorizontal,
    alignItems: 'center',
  },
  heroContent: { alignItems: 'center', gap: 8 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 8 },
  heroTagline: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
  heroBadges: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  badgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },

  impactCard: {
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  impactNumber: { fontSize: 48, fontWeight: '800', lineHeight: 56 },
  impactText: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  impactBold: { fontWeight: '700' },

  propsSection: {
    marginTop: 24,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 12,
  },
  propsTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  propItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  propIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  propText: { flex: 1, paddingTop: 2 },
  propTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  propDescription: { fontSize: 14, lineHeight: 20, opacity: 0.75 },

  signatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: Spacing.screenHorizontal,
  },
  signatureText: { fontSize: 13, fontStyle: 'italic' },

  privacyNote: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: Spacing.screenHorizontal,
    lineHeight: 18,
    opacity: 0.7,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginHorizontal: Spacing.screenHorizontal,
    paddingVertical: 17,
    borderRadius: 14,
  },
  buttonText: { fontSize: 17, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  secondaryText: { fontSize: 15, fontWeight: '500' },
});
