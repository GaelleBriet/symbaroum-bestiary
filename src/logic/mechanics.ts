// src/logic/mechanics.ts
// Moteur de calcul des Stats Effectives Symbaroum — Logique pure (pas d'effets de bord)

import type { Monster, MonsterStats } from '@/types/monster'
import type { ActivationType, StatKey, TalentEffect, TalentOrTrait } from '@/types/rules'
import { TALENTS } from '@/data/talents'
import { TRAITS } from '@/data/traits'
import { MONSTROUS_TRAITS } from '@/data/monstrousTraits'

// ─────────────────────────────────────────────────────────────────────────────
// Types de sortie
// ─────────────────────────────────────────────────────────────────────────────

export interface PlayerModifiers {
  // Ce que le joueur ajoute à son jet d'attaque contre ce monstre (10 - Défense du monstre)
  attackModifier: number;
  // Ce que le joueur ajoute à son jet de défense contre ce monstre (10 - stat_effective)
  defenseModifier: number;
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

// Comme ActiveAbility, mais pour TOUS les types d'activation (y compris passif/spécial) —
// utilisé pour l'affichage exhaustif des fiches de capacités (écran détail monstre), alors
// qu'ActiveAbility ne sert qu'aux capacités "activables" (free/active/reactive).
export interface AbilityEntry {
  key: string;
  abilityName: string;
  source: string;
  talentId: string;
  rank: number;
  activation: ActivationType;
  customText?: string;
  defenseModifier?: number;
  damageBonus?: number;
  damageDice?: string;
  armorBonus?: number;
  replaceStat?: { sourceAction: string; useStat: StatKey };
}

export interface SkinProtection {
  source: string;    // "Vigoureux II" ou "Robuste I"
  dice?: string;      // "1d6" — protection toujours exprimée en dé (Vigoureux ET Robuste)
  average: number;   // moyenne non arrondie
}

export interface EffectiveStats {
  stats: MonsterStats;
  // Défense de la créature (point de vue MJ) : stats[defenseStatKey] + modificateurs de traits (Robuste, Vigoureux...)
  defense: number;
  // Stat sur laquelle la Défense est basée : 'quick' par défaut, ou la stat de remplacement
  // si un talent passif de type Tacticien II (replaceStat sourceAction 'defense') est actif.
  defenseStatKey: StatKey;
  // Taille de dé de l'arme naturelle/mains nues (4 par défaut, 6/8/10 selon le rang du trait Arme Naturelle)
  naturalWeaponSides: number;
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
  // Toutes les capacités (traits + talents), tous types d'activation confondus, pour l'affichage
  // exhaustif des fiches de capacités — voir AbilityEntry.
  allAbilities: AbilityEntry[];
  // Protection cutanée passive (Vigoureux ou Robuste) — null si aucun
  skinProtection: SkinProtection | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Résolution d'un talent ou trait par son ID
// ─────────────────────────────────────────────────────────────────────────────

export function resolveAbility(id: string): TalentOrTrait | null {
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
// Rangs non remplacés d'une capacité, jusqu'à son niveau choisi
// ─────────────────────────────────────────────────────────────────────────────

// Règle "seul le rang le plus élevé compte" : un rang marqué `isReplacementFor` décrit la
// valeur TOTALE à ce rang (pas un delta cumulatif — ex. Robuste III = [Agilité - 4], pas
// [Agilité - 2 - 3 - 4]), donc on ne garde que le(s) rang(s) non remplacé(s) jusqu'au niveau
// choisi. Centralisé ici pour éviter de recalculer ce Set à plusieurs endroits.
function nonReplacedRanks(
  ability: TalentOrTrait,
  level: 1 | 2 | 3,
): Array<{ rank: 1 | 2 | 3; effect: TalentEffect }> {
  const replacedRanks = new Set<number>()
  for (let i = 1; i <= level; i++) {
    const eff = ability.effects[i as 1 | 2 | 3]
    if (eff.isReplacementFor !== undefined) replacedRanks.add(eff.isReplacementFor)
  }

  const result: Array<{ rank: 1 | 2 | 3; effect: TalentEffect }> = []
  for (let i = 1; i <= level; i++) {
    if (replacedRanks.has(i)) continue
    result.push({ rank: i as 1 | 2 | 3, effect: ability.effects[i as 1 | 2 | 3] })
  }
  return result
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
    defenseModifierFromTraits: { value: number };
    armorBonusFromTraits: { value: number };
    damageBonusFromTraits: { value: number };
    damageDiceFromTraits: string[];
    activeReplaceStats: EffectiveStats['activeReplaceStats'];
    specialEffects: string[];
  },
) {
  const label = `${abilityName} ${levelLabel(rank as 1 | 2 | 3)}`

  if (effect.statModifiers) {
    for (const [key, value] of Object.entries(effect.statModifiers) as [StatKey, number][]) {
      if (value !== undefined) ctx.stats[key] += value
    }
  }
  // Le defenseModifier (Robuste, Vigoureux...) ne doit PAS toucher la stat Agilité générale :
  // il n'intervient que dans le calcul de la case DÉFENSE, via un accumulateur séparé.
  if (effect.defenseModifier !== undefined) {
    ctx.defenseModifierFromTraits.value += effect.defenseModifier
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
// Taille de dé de l'arme naturelle / attaque à mains nues, selon le rang du trait Arme Naturelle
// (règle implicite du livre : 1d4 de base, 1d6/1d8/1d10 aux rangs I/II/III)
// ─────────────────────────────────────────────────────────────────────────────

const NATURAL_WEAPON_SIDES: Record<0 | 1 | 2 | 3, number> = { 0: 4, 1: 6, 2: 8, 3: 10 }

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
  const defenseModifierFromTraits = { value: 0 }
  const armorBonusFromTraits = { value: 0 }
  const damageBonusFromTraits = { value: 0 }
  const damageDiceFromTraits: string[] = []
  const activeReplaceStats: EffectiveStats['activeReplaceStats'] = []
  const specialEffects: string[] = []
  const activeAbilities: ActiveAbility[] = []

  const ctx = {
    stats,
    defenseModifierFromTraits,
    armorBonusFromTraits,
    damageBonusFromTraits,
    damageDiceFromTraits,
    activeReplaceStats,
    specialEffects,
  }

  // 3. Parcourir toutes les capacités du monstre
  const allSelected = [...monster.talents, ...monster.traits]
  let naturalWeaponRank = 0

  for (const selected of allSelected) {
    const ability = resolveAbility(selected.id)
    if (!ability) continue

    const level = selected.level as 1 | 2 | 3

    if (selected.id === 'arme-naturelle') {
      naturalWeaponRank = Math.max(naturalWeaponRank, level)
    }

    // 3a. Rangs non remplacés (règle "seul le rang le plus élevé compte")
    const ranks = nonReplacedRanks(ability, level)

    // 3b. Appliquer les rangs passive/special non remplacés — mutent les accumulateurs
    // (defenseModifier, armorBonus, damageBonus, damageDice, statModifiers...).
    for (const { rank, effect } of ranks) {
      if (effect.activation === 'passive' || effect.activation === 'special') {
        applyPassiveEffect(effect, ability.name, rank, ctx)
      }
    }

    // 3c. Collecter les rangs non-passifs (free/active/reactive) comme capacités activables
    for (const { rank, effect } of ranks) {
      if (effect.activation === 'passive' || effect.activation === 'special') continue

      activeAbilities.push({
        source: `${ability.name} ${levelLabel(rank)} (${activationLabel(effect.activation)})`,
        talentId: ability.id,
        rank,
        activation: effect.activation,
        customText: effect.customText,
        defenseModifier: effect.defenseModifier,
        damageBonus: effect.damageBonus,
        damageDice: effect.damageDice,
        armorBonus: effect.armorBonus,
        replaceStat: effect.replaceStat,
      })
    }
  }

  // 3d. Fiches de capacités pour l'affichage exhaustif (écran détail monstre, colonne
  // "Capacités & Talents") : TOUS les types d'activation, y compris passif/spécial — contrairement
  // à `activeAbilities` ci-dessus qui n'en garde qu'un sous-ensemble pour le calcul des stats.
  // Ordre [Traits puis Talents] : reproduit l'ordre d'affichage historique de l'écran détail
  // (distinct de l'ordre [Talents puis Traits] utilisé ci-dessus pour les accumulateurs — ne pas
  // unifier : cet ordre influence le texte affiché, ex. la formule de Dégâts).
  const allAbilities: AbilityEntry[] = []
  for (const selected of [...monster.traits, ...monster.talents]) {
    const ability = resolveAbility(selected.id)
    if (!ability) continue

    const level = selected.level as 1 | 2 | 3
    for (const { rank, effect } of nonReplacedRanks(ability, level)) {
      allAbilities.push({
        key: `${ability.id}-${rank}`,
        abilityName: ability.name,
        source: `${ability.name} ${levelLabel(rank)} (${activationLabel(effect.activation)})`,
        talentId: ability.id,
        rank,
        activation: effect.activation,
        customText: effect.customText,
        defenseModifier: effect.defenseModifier,
        damageBonus: effect.damageBonus,
        damageDice: effect.damageDice,
        armorBonus: effect.armorBonus,
        replaceStat: effect.replaceStat,
      })
    }
  }

  const naturalWeaponSides = NATURAL_WEAPON_SIDES[naturalWeaponRank as 0 | 1 | 2 | 3]

  // 4. Dés offensifs Vigoureux — non présents dans les données data/, hardcodés ici
  // (règle du livre : inflige 1d4/1d6/1d8 supplémentaires par rang)
  const VIGOUREUX_OFFENSE: Record<1|2|3, string> = { 1: '1d4', 2: '1d6', 3: '1d8' }
  for (const sel of allSelected) {
    if (sel.id === 'vigoureux') {
      const lvl = sel.level as 1|2|3
      damageDiceFromTraits.push(`${VIGOUREUX_OFFENSE[lvl]} (Vigoureux ${levelLabel(lvl)})`)
    }
  }

  // 5. Protection cutanée (PEAU) — Vigoureux ou Robuste, toujours exprimée en dé
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
        const dice = ability.effects[lvl].damageDice
        const sides = dice ? parseInt(dice.split('d')[1], 10) : 0
        skinProtection = {
          source: `Robuste ${levelLabel(lvl)}`,
          dice,
          average: sides ? (1 + sides) / 2 : 0,
        }
      }
      break
    }
  }

  // 6. Calcul de la Défense (point de vue MJ) : stat de base (Agilité, ou remplacement via
  // un talent passif type Tacticien II) + modificateurs de traits (Robuste, Vigoureux...).
  // Le bonus/malus d'attaque des joueurs contre ce monstre est une valeur dérivée (10 - Défense),
  // affichée séparément (cf. playerModifiers.attackModifier) — jamais stockée sur le monstre.
  const defensePlacement = activeReplaceStats.find(rs => rs.sourceAction === 'defense')
  const defenseStatKey: StatKey = defensePlacement ? defensePlacement.useStat : 'quick'
  const defense = stats[defenseStatKey] + defenseModifierFromTraits.value

  // 7. Modificateurs joueur
  // ATT JOUEUR = 10 - Défense de la créature (pas 10 - Agilité brute)
  // DÉF JOUEUR = 10 - stat d'attaque de la créature (Précision, ou remplacement type Poigne de Fer)
  const meleePlacement = activeReplaceStats.find(rs => rs.sourceAction === 'meleeAttack')
  const defenseBaseStat: StatKey = meleePlacement ? meleePlacement.useStat : 'accurate'
  const playerModifiers: PlayerModifiers = {
    attackModifier:  10 - defense,
    defenseModifier: 10 - stats[defenseBaseStat],
    defenseBaseStat,
  }

  return {
    stats,
    defense,
    defenseStatKey,
    naturalWeaponSides,
    armorBonusFromTraits: armorBonusFromTraits.value,
    damageBonusFromTraits: damageBonusFromTraits.value,
    damageDiceFromTraits,
    activeReplaceStats,
    specialEffects,
    playerModifiers,
    activeAbilities,
    allAbilities,
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

// ─────────────────────────────────────────────────────────────────────────────
// XP dépensée en Talents/Traits
// ─────────────────────────────────────────────────────────────────────────────

// Chaque rang s'achète indépendamment : niveau II = rang I (10) + rang II (30) = 40 XP
export const XP_PER_RANK: Record<1 | 2 | 3, number> = { 1: 10, 2: 30, 3: 60 }

export function xpForLevel(level: 1 | 2 | 3): number {
  let total = 0
  for (let i = 1 as 1 | 2 | 3; i <= level; i++) total += XP_PER_RANK[i as 1 | 2 | 3]
  return total
}
