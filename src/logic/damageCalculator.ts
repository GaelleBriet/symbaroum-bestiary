// src/logic/damageCalculator.ts

import { getQuality } from '@/data/qualities'
import { findWeapon } from '@/data/equipment'
import type { Weapon, Armor } from '@/types/rules'
import type { Monster, MonsterWeapon } from '@/types/monster'
import type { EffectiveStats } from '@/logic/mechanics'

// Moyenne d'un dé à N faces. Ne jamais arrondir ici — arrondir uniquement le total final.
export function diceAverage(sides: number): number {
  return (1 + sides) / 2
}

// Taille de dé effective d'une arme de monstre : celle du catalogue si l'arme y figure
// (arme manufacturée), sinon celle de l'arme naturelle/mains nues du monstre (dépend du
// rang du trait Arme Naturelle — voir naturalWeaponSides dans mechanics.ts). Le champ brut
// `damage` stocké sur les armes non cataloguées (griffes, morsure, défenses...) n'est PAS
// un nombre de faces de dé et ne doit jamais être utilisé comme tel.
export function resolveWeaponSides(w: MonsterWeapon, naturalWeaponSides: number): number {
  const catalog = findWeapon(w.id)
  return catalog ? catalog.damage.sides : naturalWeaponSides
}

export function calculateWeaponFormula(weapon: Weapon): string {
  const isShield = weapon.damage.sides === 0
  const base = isShield ? '—' : `${weapon.damage.count}d${weapon.damage.sides}`
  const bonuses: string[] = []
  const badges: string[] = []

  for (const qid of (weapon.qualityIds ?? [])) {
    const q = getQuality(qid)
    if (!q) continue
    if (!isShield && q.type !== 'weapon') continue

    if (q.effects.attackBonus)  bonuses.push(`+${q.effects.attackBonus} ATT`)
    if (q.effects.damageBonus)  bonuses.push(`+${q.effects.damageBonus} DGT`)
    if (q.effects.defenseBonus) bonuses.push(`+${q.effects.defenseBonus} DEF`)
    if (q.effects.isLong)       badges.push('Long')
    if (q.effects.isShort)      badges.push('Court')
    if (q.effects.isFlexible)   badges.push('Flexible')
    if (q.effects.isBlunt)      badges.push('Contondant')
  }

  const parts = [base]
  if (bonuses.length) parts.push(`(${bonuses.join(', ')})`)
  if (badges.length)  parts.push(badges.map(b => `[${b}]`).join(' '))

  return parts.join(' ')
}

export function calculateArmorFormula(armor: Armor): string {
  const base = `${armor.protection.count}d${armor.protection.sides}`
  const penalties: string[] = []
  const badges: string[] = []

  for (const qid of (armor.qualityIds ?? [])) {
    const q = getQuality(qid)
    if (!q || q.type !== 'armor') continue

    if (q.categorySpecificPenalty && armor.category) {
      const penalty = q.categorySpecificPenalty[armor.category]
      if (penalty) penalties.push(`${penalty} DEF`)
    } else if (q.effects.defensePenalty) {
      penalties.push(`${q.effects.defensePenalty} DEF`)
    }

    if (q.effects.isPractical) badges.push('Pratique')
  }

  const parts = [base]
  if (penalties.length) parts.push(`(${penalties.join(', ')})`)
  if (badges.length)    parts.push(badges.map(b => `[${b}]`).join(' '))

  return parts.join(' ')
}

// Calcule la formule et la moyenne de dégâts totaux (arme + traits).
// Règle : pas d'arrondi intermédiaire, arrondi sur le total final uniquement.
export function calculateTotalDamage(
  monster: Monster,
  effectiveStats: EffectiveStats,
): { formula: string; average: number } {
  const diceParts: string[] = []
  let sum = 0
  let fixedBonus = 0

  // 1. Dés de l'arme équipée + bonus qualités
  for (const w of monster.equipment?.weapons ?? []) {
    const catalog = findWeapon(w.id)
    const sides = resolveWeaponSides(w, effectiveStats.naturalWeaponSides)
    const weaponName = catalog?.name ?? w.name ?? w.id
    if (sides > 0) {
      diceParts.push(`1d${sides} (${weaponName})`)
      sum += diceAverage(sides)
    }
    for (const qid of (catalog?.qualityIds ?? w.qualityIds ?? [])) {
      const q = getQuality(qid)
      if (q?.effects.damageBonus) {
        diceParts.push(`${q.effects.damageBonus} (${q.name})`)
        sum += q.effects.damageBonus
      }
    }
  }

  // 2. Dés bonus des traits/talents — déjà labelisés "1d4 (Poigne de fer II)"
  for (const entry of effectiveStats.damageDiceFromTraits) {
    const dice = entry.split(' (')[0]
    const match = dice.match(/^(\d+)d(\d+)$/)
    if (match) {
      const count = parseInt(match[1])
      const sides = parseInt(match[2])
      diceParts.push(entry)
      sum += count * diceAverage(sides)
    }
  }

  // 3. Bonus fixe des traits (ex: Robuste +2)
  if (effectiveStats.damageBonusFromTraits > 0) {
    fixedBonus += effectiveStats.damageBonusFromTraits
    sum += effectiveStats.damageBonusFromTraits
  }

  if (diceParts.length === 0 && fixedBonus === 0) return { formula: '—', average: 0 }

  const formulaParts = [...diceParts]
  // if (fixedBonus > 0) formulaParts.push(String(fixedBonus))

  return {
    formula: formulaParts.join(' + '),
    average: Math.round(sum * 10) / 10,
  }
}
