/**
 * EPA Bienestar — Pantalla de Resultados LE8
 *
 * Muestra el score cardiovascular Life's Essential 8 tras completar
 * la Evaluación Inicial. Visualiza:
 *   - Score global 0–100 con semáforo (óptimo / intermedio / inadecuado)
 *   - 8 dominios con barra de progreso y nivel de color
 *   - 2 dominios prioritarios para el Plan Bienestar 100 Días®
 *   - Mensaje del Dr. D'Alessandro
 *   - CTA para iniciar el Plan
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { EpaColors, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  calculateLe8Score,
  globalScoreMessage,
  Le8Score,
  Le8Domain,
} from '@/lib/questionnaires/le8-score';
import type { QuestionnaireResponse } from '@spezivibe/questionnaire';

export const LE8_LATEST_RESPONSE_KEY = '@le8_latest_response';

// ── Configuración visual de dominios ─────────────────────────────────────────

const DOMAIN_META: Record<Le8Domain, { icon: IconSymbolName; short: string }> = {
  diet:             { icon: 'fork.knife',           short: 'Alimentación' },
  physical_activity:{ icon: 'figure.walk',           short: 'Actividad' },
  nicotine:         { icon: 'nosign',                short: 'Tabaco' },
  sleep:            { icon: 'moon.fill',             short: 'Sueño' },
  body_weight:      { icon: 'scalemass.fill',        short: 'Peso' },
  blood_lipids:     { icon: 'drop.fill',             short: 'Colesterol' },
  blood_glucose:    { icon: 'cross.vial.fill',       short: 'Glucemia' },
  blood_pressure:   { icon: 'heart.fill',            short: 'Presión' },
};

function scoreColor(score: number): string {
  if (score >= 80) return EpaColors.optimal;
  if (score >= 50) return EpaColors.intermediate;
  return EpaColors.inadequate;
}

function levelLabel(score: number): string {
  if (score >= 80) return 'Óptimo';
  if (score >= 50) return 'Intermedio';
  return 'Por mejorar';
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function GlobalScoreCircle({ score, level }: { score: number; level: Le8Score['globalLevel'] }) {
  const color = scoreColor(score);
  const bg = color + '18';

  return (
    <View style={styles.circleWrapper}>
      <View style={[styles.circleOuter, { borderColor: color, backgroundColor: bg }]}>
        <View style={[styles.circleInner, { backgroundColor: color + '22' }]}>
          <ThemedText style={[styles.circleScore, { color }]}>{score}</ThemedText>
          <ThemedText style={[styles.circleOf100, { color: color + 'AA' }]}>/100</ThemedText>
        </View>
      </View>
      <View style={[styles.levelBadge, { backgroundColor: color }]}>
        <ThemedText style={styles.levelBadgeText}>{levelLabel(score)}</ThemedText>
      </View>
    </View>
  );
}

function DomainBar({
  label,
  icon,
  score,
  isPriority,
  isProxy,
}: {
  label: string;
  icon: IconSymbolName;
  score: number;
  isPriority: boolean;
  isProxy: boolean;
}) {
  const color = scoreColor(score);
  const background = useThemeColor({}, 'background');

  return (
    <View
      style={[
        styles.domainRow,
        { backgroundColor: background, borderColor: isPriority ? color : EpaColors.goRed + '15' },
        isPriority && styles.domainRowPriority,
      ]}>
      {isPriority && (
        <View style={[styles.priorityFlag, { backgroundColor: color }]}>
          <ThemedText style={styles.priorityFlagText}>Foco Plan 100D</ThemedText>
        </View>
      )}
      <View style={[styles.domainIcon, { backgroundColor: color + '18' }]}>
        <IconSymbol name={icon} size={20} color={color} />
      </View>
      <View style={styles.domainContent}>
        <View style={styles.domainHeader}>
          <ThemedText style={styles.domainLabel}>{label}</ThemedText>
          <View style={styles.domainScoreRow}>
            {isProxy && (
              <ThemedText style={[styles.proxyTag, { color: EpaColors.warmGrey }]}>~</ThemedText>
            )}
            <ThemedText style={[styles.domainScore, { color }]}>{score}</ThemedText>
          </View>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${score}%` as `${number}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

// ── Pantalla principal ────────────────────────────────────────────────────────

export default function Le8ResultadoScreen() {
  const [score, setScore] = useState<Le8Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const buttonBackground = useThemeColor({}, 'buttonBackground');
  const buttonText = useThemeColor({}, 'buttonText');

  useEffect(() => {
    let cancelled = false;

    async function loadScore() {
      try {
        const raw = await AsyncStorage.getItem(LE8_LATEST_RESPONSE_KEY);
        if (!raw) {
          if (!cancelled) setError('No encontramos una evaluación reciente.');
          return;
        }
        const response = JSON.parse(raw) as QuestionnaireResponse;
        const calculated = calculateLe8Score(response);
        if (!cancelled) setScore(calculated);
      } catch (e) {
        if (!cancelled) setError('No pudimos calcular tu score. Por favor repetí la evaluación.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadScore();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" color={EpaColors.goRed} />
        <ThemedText style={[styles.loadingText, { color: EpaColors.warmGrey }]}>
          Calculando tu score LE8...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !score) {
    return (
      <ThemedView style={styles.center}>
        <IconSymbol name="exclamationmark.circle.fill" size={48} color={EpaColors.goRed} />
        <ThemedText style={[styles.errorText, { color: EpaColors.warmBlack }]}>
          {error ?? 'Error inesperado'}
        </ThemedText>
        <Pressable
          style={[styles.ctaButton, { backgroundColor: buttonBackground }]}
          onPress={() => router.back()}>
          <ThemedText style={[styles.ctaText, { color: buttonText }]}>Volver</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const message = globalScoreMessage(score);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Cabecera Go Red */}
        <View style={[styles.header, { backgroundColor: EpaColors.goRed }]}>
          <ThemedText style={styles.headerTitle}>Tu Score LE8</ThemedText>
          <ThemedText style={styles.headerSub}>
            Life's Essential 8 · American Heart Association
          </ThemedText>
        </View>

        {/* Score global */}
        <View style={styles.scoreSection}>
          <GlobalScoreCircle score={score.global} level={score.globalLevel} />
          <ThemedText style={[styles.globalMessage, { color: EpaColors.warmBlack }]}>
            {message}
          </ThemedText>
        </View>

        {/* Dominios prioritarios */}
        <View style={[styles.priorityCard, { borderColor: EpaColors.goRed + '30', backgroundColor: EpaColors.rosePetal }]}>
          <View style={styles.priorityHeader}>
            <IconSymbol name="target" size={18} color={EpaColors.goRed} />
            <ThemedText style={[styles.priorityTitle, { color: EpaColors.goRed }]}>
              {'  '}Foco de tu Plan Bienestar 100 Días®
            </ThemedText>
          </View>
          {score.priorityDomains.map((domain) => {
            const meta = DOMAIN_META[domain];
            const domainScore = score.domains.find((d) => d.domain === domain)!;
            return (
              <View key={domain} style={styles.priorityDomainItem}>
                <IconSymbol name={meta.icon} size={16} color={scoreColor(domainScore.score)} />
                <ThemedText style={[styles.priorityDomainLabel, { color: EpaColors.warmBlack }]}>
                  {'  '}{meta.short} — {domainScore.message}
                </ThemedText>
              </View>
            );
          })}
        </View>

        {/* Barra de dominios */}
        <View style={styles.domainsSection}>
          <ThemedText style={styles.domainsTitle}>Los 8 Esenciales</ThemedText>
          {score.domains.map((d) => (
            <DomainBar
              key={d.domain}
              label={d.label}
              icon={DOMAIN_META[d.domain].icon}
              score={d.score}
              isPriority={score.priorityDomains.includes(d.domain)}
              isProxy={d.isProxy}
            />
          ))}
          <ThemedText style={[styles.proxyNote, { color: EpaColors.warmGrey }]}>
            ~ Score estimado (sin resultado de laboratorio)
          </ThemedText>
        </View>

        {/* Firma */}
        <View style={[styles.signatureCard, { backgroundColor: EpaColors.rosePetal, borderColor: EpaColors.goRed + '25' }]}>
          <IconSymbol name="stethoscope" size={18} color={EpaColors.goRed} />
          <ThemedText style={[styles.signatureText, { color: EpaColors.warmBlack }]}>
            {'  '}Este score es el punto de partida de tu Plan Bienestar 100 Días®.
            {'\n  '}— Dr. Alejandro Sergio D'Alessandro
          </ThemedText>
        </View>

        {/* CTA principal */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            { backgroundColor: buttonBackground, opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.replace('/(tabs)/schedule')}
          accessibilityRole="button"
          accessibilityLabel="Iniciar Plan Bienestar 100 Días">
          <IconSymbol name="calendar.badge.checkmark" size={20} color={buttonText} />
          <ThemedText style={[styles.ctaText, { color: buttonText }]}>
            {'  '}Iniciar Plan Bienestar 100 Días®
          </ThemedText>
        </Pressable>

        {/* CTA secundario */}
        <Pressable
          style={styles.secondaryAction}
          onPress={() => router.replace('/(tabs)')}
          accessibilityRole="button"
          accessibilityLabel="Ir al inicio">
          <ThemedText style={[styles.secondaryActionText, { color: buttonBackground }]}>
            Ir al inicio
          </ThemedText>
        </Pressable>

      </ScrollView>
    </ThemedView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 56 },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screenHorizontal,
    gap: 16,
  },
  loadingText: { fontSize: 15, marginTop: 8 },
  errorText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },

  // Cabecera
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: Spacing.screenHorizontal,
    alignItems: 'center',
    gap: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },

  // Score global
  scoreSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 28,
    paddingBottom: 8,
    gap: 16,
  },
  circleWrapper: { alignItems: 'center', gap: 10 },
  circleOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleScore: { fontSize: 52, fontWeight: '800', lineHeight: 56 },
  circleOf100: { fontSize: 16, fontWeight: '600' },
  levelBadge: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
  },
  levelBadgeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  globalMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.85,
  },

  // Dominios prioritarios
  priorityCard: {
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  priorityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  priorityTitle: { fontSize: 14, fontWeight: '700' },
  priorityDomainItem: { flexDirection: 'row', alignItems: 'flex-start' },
  priorityDomainLabel: { fontSize: 14, lineHeight: 20, flex: 1 },

  // 8 dominios
  domainsSection: {
    marginTop: 24,
    paddingHorizontal: Spacing.screenHorizontal,
    gap: 10,
  },
  domainsTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  domainRowPriority: { borderWidth: 2 },
  priorityFlag: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomLeftRadius: 8,
  },
  priorityFlagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  domainIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  domainContent: { flex: 1, gap: 6 },
  domainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  domainLabel: { fontSize: 14, fontWeight: '600' },
  domainScoreRow: { flexDirection: 'row', alignItems: 'center' },
  proxyTag: { fontSize: 14, marginRight: 2 },
  domainScore: { fontSize: 16, fontWeight: '700' },
  barTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 3 },
  proxyNote: { fontSize: 12, marginTop: 4, opacity: 0.7 },

  // Firma
  signatureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  signatureText: { fontSize: 14, lineHeight: 22, flex: 1, fontStyle: 'italic' },

  // Botones
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.screenHorizontal,
    marginTop: 24,
    paddingVertical: 17,
    borderRadius: 14,
  },
  ctaText: { fontSize: 17, fontWeight: '700' },
  secondaryAction: { alignItems: 'center', marginTop: 14, paddingVertical: 8 },
  secondaryActionText: { fontSize: 15, fontWeight: '500' },
});
