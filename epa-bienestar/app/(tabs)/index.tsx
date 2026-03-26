import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAccount } from '@spezivibe/account';
import { AccountButton } from '@/components/account/account-button';
import { useAccountSheet } from './_layout';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EpaColors } from '@/constants/theme';
import { calculateLe8Score, type Le8Score } from '@/lib/questionnaires/le8-score';

const LE8_KEY = '@le8_latest_response';

const LEVEL_LABELS: Record<string, string> = {
  optimal: 'Óptimo',
  intermediate: 'Intermedio',
  inadequate: 'A mejorar',
};

function scoreColor(score: number): string {
  if (score >= 80) return EpaColors.optimal;
  if (score >= 50) return EpaColors.intermediate;
  return EpaColors.inadequate;
}

// Static tips — rotate by day of week (MVP)
const TIPS = [
  {
    icon: 'heart.fill' as const,
    title: 'Menopausia y corazón',
    text: 'El riesgo cardiovascular se duplica en los primeros 10 años post-menopausia. Conocer tu score LE8 es el primer paso.',
  },
  {
    icon: 'figure.walk' as const,
    title: 'Moverte importa',
    text: '150 minutos de actividad moderada por semana reducen el riesgo cardíaco hasta un 35%. ¡Cada paso cuenta!',
  },
  {
    icon: 'moon.fill' as const,
    title: 'El sueño repara',
    text: 'Dormir menos de 7 horas duplica el riesgo de HTA. Los sofocos nocturnos merecen atención médica.',
  },
  {
    icon: 'fork.knife' as const,
    title: 'Alimentación cardioprotectora',
    text: '5 porciones de frutas y verduras al día reducen el riesgo cardiovascular. Menos ultraprocesados, más colores.',
  },
  {
    icon: 'smoke' as const,
    title: 'Sin tabaco, mejor corazón',
    text: 'A los 12 meses de dejar de fumar, el riesgo cardiovascular se reduce a la mitad. Nunca es tarde.',
  },
];

const tip = TIPS[new Date().getDay() % TIPS.length];

// ─── Sub-components ────────────────────────────────────────────────────────

function Le8ScoreCard({ score }: { score: Le8Score }) {
  const color = scoreColor(score.globalScore);
  const label = LEVEL_LABELS[score.globalLevel] ?? score.globalLevel;
  const topTwo = score.priorityDomains.slice(0, 2);

  return (
    <View style={styles.card}>
      <View style={styles.scoreRow}>
        <View style={[styles.scoreCircle, { borderColor: color }]}>
          <Text style={[styles.scoreNumber, { color }]}>{score.globalScore}</Text>
          <Text style={styles.scoreDenom}>/100</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.cardTitle}>Score LE8</Text>
          <View style={[styles.levelPill, { backgroundColor: color + '22' }]}>
            <Text style={[styles.levelText, { color }]}>{label}</Text>
          </View>
          <Text style={styles.cardSub}>Salud Cardiovascular AHA 2022</Text>
          {topTwo.length > 0 && (
            <Text style={styles.priorityHint} numberOfLines={2}>
              Foco: {topTwo.map(d => score.domains[d]?.message?.split('.')[0] ?? d).join(' · ')}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push('/le8-resultado')}
        activeOpacity={0.7}
      >
        <Text style={styles.linkButtonText}>Ver resultados completos →</Text>
      </TouchableOpacity>
    </View>
  );
}

function EvalCTA() {
  return (
    <View style={[styles.card, styles.ctaCard]}>
      <IconSymbol name="heart.text.square.fill" size={44} color={EpaColors.goRed} />
      <Text style={styles.ctaTitle}>Conocé tu Score LE8</Text>
      <Text style={styles.ctaSub}>
        La evaluación tarda ~5 minutos y calcula tu salud cardiovascular en los 8 dominios esenciales de la AHA.
      </Text>
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => router.push('/questionnaire/le8-menopausia-v1')}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaButtonText}>Comenzar evaluación gratuita</Text>
      </TouchableOpacity>
    </View>
  );
}

function Plan100Card({ hasScore }: { hasScore: boolean }) {
  return (
    <View style={[styles.card, styles.plan100Card]}>
      <View style={styles.cardHeader}>
        <IconSymbol name="calendar.badge.checkmark" size={22} color={EpaColors.plum} />
        <Text style={[styles.cardTitle, { color: EpaColors.plum }]}>Plan Bienestar 100 Días®</Text>
      </View>
      <Text style={styles.cardSub}>
        {hasScore
          ? 'Tu plan personalizado está activo. Cada día, una micro-acción para tu corazón.'
          : 'Completá tu Evaluación LE8 para activar tu Plan Bienestar personalizado.'}
      </Text>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push('/(tabs)/schedule')}
        activeOpacity={0.7}
      >
        <Text style={[styles.linkButtonText, { color: EpaColors.plum }]}>
          {hasScore ? 'Ver tareas de hoy →' : 'Ir al plan →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function TipCard() {
  return (
    <View style={[styles.card, styles.tipCard]}>
      <View style={styles.cardHeader}>
        <IconSymbol name={tip.icon} size={20} color={EpaColors.goRed} />
        <Text style={styles.tipLabel}>Sabías que…</Text>
      </View>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      <Text style={styles.tipText}>{tip.text}</Text>
    </View>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { signedIn, user } = useAccount();
  const { showAccountSheet } = useAccountSheet();
  const insets = useSafeAreaInsets();
  const [le8Score, setLe8Score] = useState<Le8Score | null>(null);
  const [loadingScore, setLoadingScore] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadScore() {
      try {
        const raw = await AsyncStorage.getItem(LE8_KEY);
        if (!cancelled && raw) {
          const response = JSON.parse(raw);
          setLe8Score(calculateLe8Score(response));
        }
      } catch {
        // silently ignore — user may not have taken the evaluation yet
      } finally {
        if (!cancelled) setLoadingScore(false);
      }
    }
    loadScore();
    return () => {
      cancelled = true;
    };
  }, []);

  const givenName = user?.name?.givenName ?? user?.name?.nickname;
  const greeting = givenName ? `¡Hola, ${givenName}!` : '¡Hola!';

  return (
    <View style={styles.root}>
      {/* Red header band */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.headerSub}>Tu salud cardiovascular</Text>
        </View>
        {signedIn && <AccountButton onPress={showAccountSheet} />}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* LE8 Score or evaluation CTA */}
        {!loadingScore && (le8Score ? <Le8ScoreCard score={le8Score} /> : <EvalCTA />)}

        {/* Plan 100 Días® */}
        <Plan100Card hasScore={!!le8Score} />

        {/* Consejo del día */}
        <TipCard />

        {/* Scientific endorsement badges */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <IconSymbol name="shield.checkmark.fill" size={13} color={EpaColors.goRed} />
            <Text style={styles.badgeText}>Go Red For Women · AHA</Text>
          </View>
          <View style={styles.badge}>
            <IconSymbol name="cross.case.fill" size={13} color={EpaColors.plum} />
            <Text style={[styles.badgeText, { color: EpaColors.plum }]}>FAC</Text>
          </View>
        </View>

        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: EpaColors.warmWhite,
  },

  // Header
  header: {
    backgroundColor: EpaColors.goRed,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    marginTop: 2,
  },

  // Scroll content
  content: {
    padding: 16,
    gap: 14,
  },

  // LE8 Score card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '800',
  },
  scoreDenom: {
    fontSize: 11,
    color: EpaColors.warmGrey,
    marginTop: -2,
  },
  scoreInfo: {
    flex: 1,
    gap: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: EpaColors.warmBlack,
  },
  levelPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardSub: {
    fontSize: 12,
    color: EpaColors.warmGrey,
    lineHeight: 17,
  },
  priorityHint: {
    fontSize: 12,
    color: EpaColors.warmGrey,
    lineHeight: 16,
    fontStyle: 'italic',
  },
  linkButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: EpaColors.goRed,
  },

  // Eval CTA card
  ctaCard: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: EpaColors.warmBlack,
    textAlign: 'center',
  },
  ctaSub: {
    fontSize: 14,
    color: EpaColors.warmGrey,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  ctaButton: {
    backgroundColor: EpaColors.goRed,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  // Plan 100 Días card
  plan100Card: {
    borderLeftWidth: 4,
    borderLeftColor: EpaColors.plum,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Tip card
  tipCard: {
    backgroundColor: EpaColors.rosePetal,
    gap: 6,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: EpaColors.goRed,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: EpaColors.warmBlack,
  },
  tipText: {
    fontSize: 13,
    color: EpaColors.warmGrey,
    lineHeight: 19,
  },

  // Bottom badges
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E8D5D8',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: EpaColors.goRed,
  },
});
