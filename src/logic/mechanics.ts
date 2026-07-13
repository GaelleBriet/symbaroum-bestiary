// src/logic/mechanics.ts
// Moteur de calcul des Stats Effectives Symbaroum — Logique pure (pas d'effets de bord)

import type { Monster, MonsterStats } from '@/types/monster'
import type { StatKey, TalentEffect } from '@/types/rules'
import { TALENTS } from '@/data/talents'
import { TRAITS } from '@/data/traits'
import { MONSTROUS_TRAITS } from '@/data/monstrousTraits'

// ─────────────────────────────────────────────────────────────────────────────
// Types de sortie
// ─────────────────────────────────────────────────────────────────────────────

export interface PlayerModifiers {
  // Ce que le joueur ajoute à son jet d'attaque contre ce monstre (10 - Agilité_effective)
  attackModifier: number;
  // Ce que le joueur ajoute à son jet de défense contre ce monstre (10 - stat_effective)
  defenseModifier: number;
  attackBaseStat: StatKey;
  // Stat utilisée pour la défense joueur (normalement 'accurate', 'strong' si Poigne de fer)
  defenseBaseStat: StatKey;
}

export interface ActiveAbility {
  source: string;
  talentId: string;
  rank: number;
  activation: 'free' | 'active' | 'reactive';
  customText?: string;
  defenseModifier?: number;
  damageBonus?: number;
  damageDice?: string;
  armorBonus?: number;
  replaceStat?: { sourceAction: string; useStat: StatKey };
}

export interface SkinProtection {
  source: string;    // "Vigoureux II" ou "Robuste I"
  dice?: string;     // "1d6" si dés (Vigoureux)
  fixed?: number;    // valeur fixe si Robuste
  average: number;   // moyenne non arrondie
}

export interface EffectiveStats {
  stats: MonsterStats;
  defense: number;
  armorBonusFromTraits: number;
  damageBonusFromTraits: number;
  damageDiceFromTraits: string[];
  activeReplaceStats: Array<{
    sourceAction: string;
    useStat: StatKey;
    source: string;
  }>;
  specialEffects: string[];
  playerModifiers: PlayerModifiers;
  activeAbilities: ActiveAbility[];
  // Protection cutanée passive (Vigoureux ou Robuste) — null si aucun
  skinProtection: SkinProtection | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Résolution d'un talent ou trait par son ID
// ─────────────────────────────────────────────────────────────────────────────

function resolveAbility(id: string) {
  const allSources = [
    Object.values(TALENTS),
    Object.values(TRAITS),
    Object.values(MONSTROUS_TRAITS),
  ]
  for (const source of allSources) {
    const found = source.find((a) => a.id === id)
    if (found) return found
  }
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// Application d'un effet passif sur les accumulateurs
// ─────────────────────────────────────────────────────────────────────────────

function applyPassiveEffect(
  effect: TalentEffect,
  abilityName: string,
  rank: number,
  ctx: {
    stats: MonsterStats;
    armorBonusFromTraits: { value: number };
    damageBonusFromTraits: { value: number };
    damageDiceFromTraits: string[];
    activeReplaceStats: EffectiveStats['activeReplaceStats'];
    specialEffects: string[];
  },
  skipDefenseModifier = false,
) {
  const label = `${abilityName} ${levelLabel(rank as 1 | 2 | 3)}`

  if (effect.statModifiers) {
    for (const [key, value] of Object.entries(effect.statModifiers) as [StatKey, number][]) {
      if (value !== undefined) ctx.stats[key] += value
    }
  }
  // BUG 1 FIX — defenseModifier appliqué directement sur stats.quick (Agilité effective)
  // Vigoureux/Robuste: valeur totale par rang (pas un delta cumulatif) → skipDefenseModifier
  // empêche les rangs inférieurs d'être additionnés au rang max.
  if (effect.defenseModifier !== undefined && !skipDefenseModifier) {
    ctx.stats.quick += effect.defenseModifier
  }
  if (effect.armorBonus !== undefined && effect.armorBonus !== 0) {
    ctx.armorBonusFromTraits.value += effect.armorBonus
  }
  if (effect.damageBonus !== undefined && effect.damageBonus !== 0) {
    ctx.damageBonusFromTraits.value += effect.damageBonus
  }
  if (effect.damageDice) {
    ctx.damageDiceFromTraits.push(`${effect.damageDice} (${label})`)
  }
  if (effect.replaceStat) {
    ctx.activeReplaceStats.push({
      sourceAction: effect.replaceStat.sourceAction,
      useStat: effect.replaceStat.useStat,
      source: label,
    })
  }
  if (effect.customText) {
    ctx.specialEffects.push(`[${label}] ${effect.customText}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Calcul principal
// ─────────────────────────────────────────────────────────────────────────────

export function calculateEffectiveStats(monster: Monster): EffectiveStats {
  // 1. Initialiser les stats effectives depuis les stats brutes + modificateurs fixes
  const stats: MonsterStats = {
    accurate:   monster.baseStats.accurate   + monster.statModifiers.accurate,
    cunning:    monster.baseStats.cunning    + monster.statModifiers.cunning,
    discreet:   monster.baseStats.discreet   + monster.statModifiers.discreet,
    persuasive: monster.baseStats.persuasive + monster.statModifiers.persuasive,
    quick:      monster.baseStats.quick      + monster.statModifiers.quick,
    resolute:   monster.baseStats.resolute   + monster.statModifiers.resolute,
    strong:     monster.baseStats.strong     + monster.statModifiers.strong,
    vigilant:   monster.baseStats.vigilant   + monster.statModifiers.vigilant,
  }

  // 2. Accumulateurs
  const armorBonusFromTraits = { value: 0 }
  const damageBonusFromTraits = { value: 0 }
  const damageDiceFromTraits: string[] = []
  const activeReplaceStats: EffectiveStats['activeReplaceStats'] = []
  const specialEffects: string[] = []
  const activeAbilities: ActiveAbility[] = []

  const ctx = {
    stats,
    armorBonusFromTraits,
    damageBonusFromTraits,
    damageDiceFromTraits,
    activeReplaceStats,
    specialEffects,
  }

  // 3. Parcourir toutes les capacités du monstre
  const allSelected = [...monster.talents, ...monster.traits]

  for (const selected of allSelected) {
    const ability = resolveAbility(selected.id)
    if (!ability) continue

    const level = selected.level as 1 | 2 | 3

    // 3a. Calculer l'ensemble des rangs remplacés par un rang supérieur
    const replacedRanks = new Set<number>()
    for (let i = 1; i <= level; i++) {
      const eff = ability.effects[i as 1 | 2 | 3]
      if (eff.isReplacementFor !== undefined) {
        replacedRanks.add(eff.isReplacementFor)
      }
    }

    // 3b. Appliquer cumulativement TOUS les rangs passive/special jusqu'au niveau du monstre.
    // Exception : pour les rangs 'special'/'passive', le defenseModifier de chaque rang représente
    // la valeur totale (ex: "Agilité - 3"), pas un delta. On n'applique donc ce champ
    // qu'au rang le plus élevé pour éviter de les additionner.
    for (let i = 1; i <= level; i++) {
      const eff = ability.effects[i as 1 | 2 | 3]
      if (eff.activation === 'passive' || eff.activation === 'special') {
        const skipDefenseModifier = (eff.activation === 'special' || eff.activation === 'passive') && i < level
        applyPassiveEffect(eff, ability.name, i, ctx, skipDefenseModifier)
      }
    }

    // 3c. Collecter les rangs non-passifs (free/active/reactive) comme capacités activables
    for (let i = 1; i <= level; i++) {
      const eff = ability.effects[i as 1 | 2 | 3]
      if (eff.activation === 'passive' || eff.activation === 'special') continue
      if (replacedRanks.has(i)) continue

      activeAbilities.push({
        source: `${ability.name} ${levelLabel(i as 1 | 2 | 3)} (${activationLabel(eff.activation)})`,
        talentId: ability.id,
        rank: i,
        activation: eff.activation,
        customText: eff.customText,
        defenseModifier: eff.defenseModifier,
        damageBonus: eff.damageBonus,
        damageDice: eff.damageDice,
        armorBonus: eff.armorBonus,
        replaceStat: eff.replaceStat,
      })
    }
  }

  // 4. Dés offensifs Vigoureux — non présents dans les données data/, hardcodés ici
  // (règle du livre : inflige 1d4/1d6/1d8 supplémentaires par rang)
  const VIGOUREUX_OFFENSE: Record<1|2|3, string> = { 1: '1d4', 2: '1d6', 3: '1d8' }
  for (const sel of allSelected) {
    if (sel.id === 'vigoureux') {
      const lvl = sel.level as 1|2|3
      damageDiceFromTraits.push(`${VIGOUREUX_OFFENSE[lvl]} (Vigoureux ${levelLabel(lvl)})`)
    }
  }

  // 5. Protection cutanée (PEAU) — Vigoureux (dés) ou Robuste (fixe)
  let skinProtection: SkinProtection | null = null
  for (const sel of allSelected) {
    if (sel.id === 'vigoureux') {
      const lvl = sel.level as 1|2|3
      const sides: Record<1|2|3, number> = { 1: 4, 2: 6, 3: 8 }
      const s = sides[lvl]
      skinProtection = {
        source: `Vigoureux ${levelLabel(lvl)}`,
        dice: `1d${s}`,
        average: (1 + s) / 2,
      }
      break
    }
    if (sel.id === 'robuste') {
      const ability = resolveAbility('robuste')
      if (ability) {
        const lvl = sel.level as 1|2|3
        const fixed = ability.effects[lvl].damageBonus ?? 0
        skinProtection = {
          source: `Robuste ${levelLabel(lvl)}`,
          fixed,
          average: fixed,
        }
      }
      break
    }
  }

  // 6. Calcul de la Défense finale (stats.quick est déjà l'Agilité effective après BUG 1 fix)
  const defense = stats.quick + monster.defenseBonus

  // 7. Modificateurs joueur
  // BUG 1: attackModifier utilise l'Agilité EFFECTIVE (stats.quick, pas baseStats.quick)
  // BUG 2: si un replaceStat passif existe pour meleeAttack (ex: Poigne de fer), DEF JOUEUR
  //        utilise la stat de remplacement au lieu de Précision
  const meleePlacement = activeReplaceStats.find(rs => rs.sourceAction === 'meleeAttack')
  const defenseBaseStat: StatKey = meleePlacement ? meleePlacement.useStat : 'accurate'
  // Si le monstre a un talent passif qui remplace sa stat de défense (ex: Tacticien II = Astuce),
  // alors ATT JOUEUR utilise cette stat au lieu d'Agilité
  const defensePlacement = activeReplaceStats.find(rs => rs.sourceAction === 'defense')
  const attackBaseStat: StatKey = defensePlacement ? defensePlacement.useStat : 'quick'
  const playerModifiers: PlayerModifiers = {
    attackModifier:  10 - stats[attackBaseStat],
    defenseModifier: 10 - stats[defenseBaseStat],
    attackBaseStat,
    defenseBaseStat,
  }

  return {
    stats,
    defense,
    armorBonusFromTraits: armorBonusFromTraits.value,
    damageBonusFromTraits: damageBonusFromTraits.value,
    damageDiceFromTraits,
    activeReplaceStats,
    specialEffects,
    playerModifiers,
    activeAbilities,
    skinProtection,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Modificateurs du joueur (délègue à calculateEffectiveStats)
// ─────────────────────────────────────────────────────────────────────────────

export function calculatePlayerModifiers(monster: Monster): PlayerModifiers {
  return calculateEffectiveStats(monster).playerModifiers
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────────────────────

export function levelLabel(level: 1 | 2 | 3): string {
  return ['', 'I', 'II', 'III'][level]
}

export function activationLabel(activation: string): string {
  const labels: Record<string, string> = {
    passive: 'Passif',
    free: 'Gratuit',
    reactive: 'Réactif',
    active: 'Actif',
    special: 'Spécial',
  }
  return labels[activation] ?? activation
}

export function painResistanceFromEndurance(endurance: number): number {
  return Math.ceil(endurance / 2)
}
