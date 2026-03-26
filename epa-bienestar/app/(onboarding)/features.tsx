import { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { PaginationDots, OnboardingButton } from '@spezivibe/onboarding';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { EpaColors, Spacing } from '@/constants/theme';

interface Slide {
  icon: IconSymbolName;
  iconColor: string;
  iconBg: string;
  tag: string;
  title: string;
  body: string;
  bullets: string[];
}

const SLIDES: Slide[] = [
  {
    icon: 'heart.text.square.fill',
    iconColor: EpaColors.goRed,
    iconBg: EpaColors.rosePetal,
    tag: 'Paso 1',
    title: 'Conocé tu score LE8',
    body: 'La American Heart Association define 8 esenciales para medir la salud cardiovascular. Los adaptamos a la menopausia para vos.',
    bullets: [
      'Alimentación y actividad física',
      'Sueño, tabaco y peso corporal',
      'Presión, colesterol y glucemia',
      '5 minutos · sin análisis obligatorios',
    ],
  },
  {
    icon: 'calendar.badge.checkmark',
    iconColor: EpaColors.plum,
    iconBg: '#F3E8F5',
    tag: 'Paso 2',
    title: 'Plan Bienestar 100 Días®',
    body: "Tu evaluación genera un plan personalizado con una acción diaria, diseñado por el Dr. D'Alessandro según tus áreas de mayor impacto.",
    bullets: [
      'Foco en los 2 esenciales con menor score',
      'Una micro-acción por día, alcanzable',
      'Re-evaluación LE8 en el día 50',
      'Resumen para tu médica/o tratante',
    ],
  },
  {
    icon: 'waveform.path.ecg',
    iconColor: '#2E7D32',
    iconBg: '#E8F5E9',
    tag: 'Por qué importa',
    title: 'Menopausia y corazón',
    body: 'Al bajar los estrógenos, el riesgo cardiovascular sube. Es una ventana de oportunidad para actuar — y el mejor momento es ahora.',
    bullets: [
      'Subdefinido · subdiagnosticado · subtratado',
      'Aval: Federación Argentina de Cardiología',
      'Alineado con Go Red For Women (AHA)',
      'Tu corazón te lo agradecerá',
    ],
  },
];

export default function FeaturesScreen() {
  const [current, setCurrent] = useState(0);
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonText');
  const background = useThemeColor({}, 'background');

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push('/(onboarding)/consent');
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.skipRow}>
        <Pressable
          onPress={() => router.push('/(onboarding)/consent')}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          accessibilityRole="button"
          accessibilityLabel="Saltar introducción">
          <ThemedText style={[styles.skipText, { color: buttonBackground }]}>
            Saltar
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.slideContent}
        showsVerticalScrollIndicator={false}>

        <View style={[styles.iconCircle, { backgroundColor: slide.iconBg }]}>
          <IconSymbol name={slide.icon} size={64} color={slide.iconColor} />
        </View>

        <View style={[styles.tag, { backgroundColor: slide.iconColor + '18', borderColor: slide.iconColor + '40' }]}>
          <ThemedText style={[styles.tagText, { color: slide.iconColor }]}>
            {slide.tag}
          </ThemedText>
        </View>

        <ThemedText style={styles.slideTitle}>{slide.title}</ThemedText>
        <ThemedText style={styles.slideBody}>{slide.body}</ThemedText>

        <View style={[styles.bulletsCard, { backgroundColor: background, borderColor: slide.iconColor + '25' }]}>
          {slide.bullets.map((bullet, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bulletDot, { backgroundColor: slide.iconColor }]} />
              <ThemedText style={styles.bulletText}>{bullet}</ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PaginationDots
          total={SLIDES.length}
          current={current}
          colors={{ primaryLight: buttonBackground, primaryDark: buttonBackground, inactiveLight: '#ddd', inactiveDark: '#444' }}
        />
        <OnboardingButton
          label={isLast ? 'Continuar' : 'Siguiente'}
          onPress={handleNext}
          style={[styles.nextButton, { backgroundColor: buttonBackground }]}
          labelStyle={{ color: buttonText, fontWeight: '700', fontSize: 17 }}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: Spacing.screenHorizontal, paddingTop: Spacing.screenTop },
  skipText: { fontSize: 16, fontWeight: '500' },
  slideContent: { paddingHorizontal: Spacing.screenHorizontal, paddingTop: 24, paddingBottom: 16, alignItems: 'center' },
  iconCircle: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  tag: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, borderWidth: 1, marginBottom: 14 },
  tagText: { fontSize: 13, fontWeight: '600' },
  slideTitle: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 12, lineHeight: 32 },
  slideBody: { fontSize: 16, textAlign: 'center', lineHeight: 24, opacity: 0.8, marginBottom: 20 },
  bulletsCard: { width: '100%', borderRadius: 14, borderWidth: 1, padding: 16, gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulletDot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  bulletText: { fontSize: 15, lineHeight: 21, flex: 1 },
  footer: { paddingHorizontal: Spacing.screenHorizontal, paddingBottom: 48, paddingTop: 8, gap: 16, alignItems: 'center' },
  nextButton: { width: '100%', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
});
