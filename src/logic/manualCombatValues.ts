// src/logic/manualCombatValues.ts
// Valeurs de combat corrigées à la main par le MJ (Dégâts, Absorption) quand le calcul
// automatique est faux ou incomplet.

export type ManualCombatField = 'manualDamage' | 'manualAbsorption'

export interface CombatValue {
  value: number
  computed: number
  isManual: boolean
}

export function resolveCombatValue(computed: number, manual: number | undefined): CombatValue {
  const isManual = manual !== undefined
  return { value: isManual ? manual : computed, computed, isManual }
}

/** Lit la saisie du MJ (virgule acceptée) ; null si ce n'est pas un nombre positif ou nul. */
export function parseManualValue(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (normalized === '') return null
  const value = Number(normalized)
  if (!Number.isFinite(value) || value < 0) return null
  return Math.round(value * 10) / 10
}
