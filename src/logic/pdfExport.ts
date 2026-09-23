// src/logic/pdfExport.ts
// Export PDF d'une fiche de monstre — génération 100% client (pas de backend), via jsPDF.
//
// Ce module ne fait AUCUN calcul de règles Symbaroum : il appelle exactement les mêmes
// fonctions que src/components/MonsterDetail.vue (calculateEffectiveStats, calculateTotalDamage,
// calculateArmorFormula, resolveWeaponSides, xpForLevel...) et se contente de mettre en page
// leur résultat. Toute la logique métier reste dans logic/mechanics.ts et logic/damageCalculator.ts.
//
// jsPDF est importé dynamiquement (voir exportMonsterPdf) pour que cette fonctionnalité —
// utilisée sur une seule fiche à la fois, pas à chaque chargement — parte dans son propre
// chunk au build, et n'alourdisse pas le bundle principal.

import type { jsPDF as PdfDoc } from 'jspdf'
import type { Monster } from '@/types/monster'
import type { AbilityEntry, EffectiveStats } from '@/logic/mechanics'
import { calculateEffectiveStats, xpForLevel, levelLabel } from '@/logic/mechanics'
import {
  calculateArmorFormula,
  calculateTotalDamage,
  diceAverage,
  resolveWeaponSides,
} from '@/logic/damageCalculator'
import { findArmor, findWeapon } from '@/data/equipment'
import { STAT_LABELS_FR } from '@/data/stats'
import { resistanceStyle } from '@/data/resistance'

// ─────────────────────────────────────────────────────────────────────────────
// Palette d'impression — adaptation "papier parchemin" de la charte sombre de l'app
// (voir tailwind.config.js, tokens `sym`/`parchment`) : fond clair + mêmes teintes
// d'accent (ambre/rouge/bleu/vert), assombries pour rester lisibles sur fond clair.
// ─────────────────────────────────────────────────────────────────────────────

type RGB = [number, number, number]

const COLORS = {
  paper:       [250, 243, 227] as RGB, // fond de page (crème parchemin)
  paperDeep:   [237, 221, 180] as RGB, // bandeau d'en-tête, cases neutres
  ink:         [43, 32, 19] as RGB,    // texte principal
  inkMuted:    [92, 79, 55] as RGB,    // texte secondaire / labels
  border:      [139, 85, 32] as RGB,   // bordures structurelles (≈ sym.adim)
  borderLight: [201, 177, 131] as RGB, // liserés discrets
  amber:       [154, 82, 22] as RGB,   // ≈ sym.amber assombri pour fond clair
  amberBg:     [246, 231, 199] as RGB,
  red:         [163, 48, 48] as RGB,   // ≈ sym.red assombri
  redBg:       [248, 227, 221] as RGB,
  blue:        [53, 92, 138] as RGB,   // ≈ sym.blue assombri
  blueBg:      [222, 232, 244] as RGB,
  green:       [74, 106, 42] as RGB,   // ≈ sym.green assombri
  greenBg:     [228, 238, 214] as RGB,
  grey:        [107, 97, 78] as RGB,
  greyBg:      [233, 225, 202] as RGB,
} as const

const ACTIVATION_PRINT_STYLES: Record<string, { label: string; color: RGB; bg: RGB }> = {
  free:     { label: 'Gratuit',  color: COLORS.green, bg: COLORS.greenBg },
  reactive: { label: 'Réactif',  color: COLORS.blue,  bg: COLORS.blueBg },
  active:   { label: 'Actif',    color: COLORS.amber, bg: COLORS.amberBg },
  passive:  { label: 'Passif',   color: COLORS.grey,  bg: COLORS.greyBg },
}

// Les 8 attributs : abréviation + libellé complet (miroir de la table locale STATS de
// MonsterDetail.vue — présentation uniquement, aucun calcul).
const STATS: { key: keyof Monster['baseStats']; abbr: string; label: string }[] = [
  { key: 'accurate',   abbr: 'PRC', label: 'Précision'  },
  { key: 'cunning',    abbr: 'AST', label: 'Astuce'     },
  { key: 'discreet',   abbr: 'DIS', label: 'Discrétion' },
  { key: 'persuasive', abbr: 'PRS', label: 'Persuasion' },
  { key: 'quick',      abbr: 'AGI', label: 'Agilité'    },
  { key: 'resolute',   abbr: 'VOL', label: 'Volonté'    },
  { key: 'strong',     abbr: 'FOR', label: 'Force'      },
  { key: 'vigilant',   abbr: 'VIG', label: 'Vigilance'  },
]

function statBonusLabel(value: number): string {
  const bonus = 10 - value
  return bonus >= 0 ? `+${bonus}` : `${bonus}`
}

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

// Éclaircit une couleur vers le blanc (0 = couleur d'origine, 1 = blanc) — utilisé pour
// dériver un fond pastel imprimable à partir d'un accent conçu pour l'UI sombre.
function tintTowardWhite(rgb: RGB, amount: number): RGB {
  return [
    Math.round(rgb[0] + (255 - rgb[0]) * amount),
    Math.round(rgb[1] + (255 - rgb[1]) * amount),
    Math.round(rgb[2] + (255 - rgb[2]) * amount),
  ]
}

function slugify(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
  return slug || 'monstre'
}

// ─────────────────────────────────────────────────────────────────────────────
// Mise en page — géométrie A4 portrait, en mm
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 14
const CONTENT_W = PAGE_W - MARGIN * 2
const CONTENT_BOTTOM = PAGE_H - 16

interface RenderCtx {
  doc: PdfDoc
  cursor: { y: number }
}

function fill(doc: PdfDoc, c: RGB): void { doc.setFillColor(c[0], c[1], c[2]) }
function stroke(doc: PdfDoc, c: RGB): void { doc.setDrawColor(c[0], c[1], c[2]) }
function ink(doc: PdfDoc, c: RGB): void { doc.setTextColor(c[0], c[1], c[2]) }

function paintPageBackground(doc: PdfDoc): void {
  fill(doc, COLORS.paper)
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F')
  // Filet ambre décoratif en tête de page (identité visuelle constante d'une page à l'autre).
  fill(doc, COLORS.amber)
  doc.rect(0, 0, PAGE_W, 2.2, 'F')
}

function newPage(ctx: RenderCtx, pageState: { page: number }): void {
  ctx.doc.addPage()
  pageState.page += 1
  paintPageBackground(ctx.doc)
  ctx.cursor.y = MARGIN + 4
}

function ensureSpace(ctx: RenderCtx, pageState: { page: number }, needed: number): void {
  if (ctx.cursor.y + needed > CONTENT_BOTTOM) {
    newPage(ctx, pageState)
  }
}

function sectionLabel(ctx: RenderCtx, text: string, width = CONTENT_W, x = MARGIN): void {
  const { doc, cursor } = ctx
  doc.setFont('Cinzel', 'normal')
  doc.setFontSize(8.5)
  ink(doc, COLORS.amber)
  doc.text(text.toUpperCase(), x, cursor.y)
  stroke(doc, COLORS.borderLight)
  doc.setLineWidth(0.25)
  doc.line(x, cursor.y + 1.4, x + width, cursor.y + 1.4)
  cursor.y += 5.5
}

// ─────────────────────────────────────────────────────────────────────────────
// En-tête : nom, race, description, résistance, endurance/seuil, XP
// ─────────────────────────────────────────────────────────────────────────────

function drawHeader(ctx: RenderCtx, monster: Monster, totalXP: number): void {
  const { doc, cursor } = ctx
  const headerH = 30
  const y0 = cursor.y

  stroke(doc, COLORS.border)
  fill(doc, COLORS.paperDeep)
  doc.setLineWidth(0.5)
  doc.roundedRect(MARGIN, y0, CONTENT_W, headerH, 2, 2, 'FD')

  const padX = MARGIN + 5

  // Nom + badge de résistance
  doc.setFont('Cinzel', 'bold')
  doc.setFontSize(19)
  ink(doc, COLORS.ink)
  doc.text(monster.name, padX, y0 + 11)

  const nameWidth = doc.getTextWidth(monster.name)
  const rs = resistanceStyle(monster.resistance)
  const badgeColor = hexToRgb(rs.color)
  const badgeBg = tintTowardWhite(badgeColor, 0.82)
  const badgeText = monster.resistance
  doc.setFont('Inter', 'bold')
  doc.setFontSize(8)
  const badgeTextW = doc.getTextWidth(badgeText.toUpperCase())
  const badgeW = badgeTextW + 6
  const badgeX = padX + nameWidth + 5
  fill(doc, badgeBg)
  stroke(doc, badgeColor)
  doc.setLineWidth(0.3)
  doc.roundedRect(badgeX, y0 + 5, badgeW, 6, 1.2, 1.2, 'FD')
  ink(doc, badgeColor)
  doc.text(badgeText.toUpperCase(), badgeX + badgeW / 2, y0 + 9, { align: 'center' })

  // Race + description
  doc.setFont('Inter', 'bold')
  doc.setFontSize(10.5)
  ink(doc, COLORS.inkMuted)
  doc.text(monster.race, padX, y0 + 18)
  if (monster.description) {
    const raceW = doc.getTextWidth(monster.race)
    doc.setFont('Inter', 'normal')
    doc.setFontSize(9)
    const maxDescW = CONTENT_W - 78 - (padX - MARGIN) - raceW - 3
    const descLines: string[] = doc.splitTextToSize(monster.description, Math.max(maxDescW, 40))
    const shown = descLines.length > 1 ? `${descLines[0]}…` : descLines[0]
    doc.text(` · ${shown}`, padX + raceW + 1.5, y0 + 18)
  }

  // Bloc droit : endurance / seuil / XP
  const rightX = MARGIN + CONTENT_W - 4
  doc.setFont('Cinzel', 'normal')
  doc.setFontSize(7.5)
  ink(doc, COLORS.inkMuted)
  doc.text('ENDURANCE', rightX, y0 + 8, { align: 'right' })
  doc.setFont('Inter', 'bold')
  doc.setFontSize(11)
  ink(doc, COLORS.ink)
  doc.text(`____ / ${monster.endurance}`, rightX, y0 + 13.5, { align: 'right' })

  doc.setFont('Cinzel', 'normal')
  doc.setFontSize(7.5)
  ink(doc, COLORS.inkMuted)
  doc.text('SEUIL DE DOULEUR', rightX, y0 + 19.5, { align: 'right' })
  doc.setFont('Inter', 'bold')
  doc.setFontSize(11)
  ink(doc, COLORS.amber)
  doc.text(String(monster.painResistance), rightX, y0 + 25, { align: 'right' })

  doc.setFont('Inter', 'normal')
  doc.setFontSize(8)
  ink(doc, COLORS.inkMuted)
  doc.text(`${totalXP} XP`, rightX, y0 + headerH - 2, { align: 'right' })

  cursor.y = y0 + headerH + 5
}

// ─────────────────────────────────────────────────────────────────────────────
// Colonne Attributs
// ─────────────────────────────────────────────────────────────────────────────

function drawAttributes(
  ctx: RenderCtx,
  monster: Monster,
  effective: EffectiveStats,
  x: number,
  width: number,
): number {
  const { doc, cursor } = ctx
  const startY = cursor.y
  const redStatKey = effective.defenseStatKey
  const blueStatKey = effective.playerModifiers.defenseBaseStat

  sectionLabel(ctx, 'Attributs', width, x)

  const rowH = 5.4
  const col2 = x + width - 30
  const col3 = x + width - 8

  doc.setFont('Inter', 'normal')
  doc.setFontSize(7)
  ink(doc, COLORS.inkMuted)
  doc.text('BRUT', col2, cursor.y, { align: 'center' })
  doc.text('BONUS', col3, cursor.y, { align: 'right' })
  cursor.y += 3.5

  for (const s of STATS) {
    const isRed = s.key === redStatKey
    const isBlue = !isRed && s.key === blueStatKey
    const rowColor = isRed ? COLORS.red : isBlue ? COLORS.blue : COLORS.ink

    if (isRed || isBlue) {
      fill(doc, isRed ? COLORS.redBg : COLORS.blueBg)
      doc.rect(x, cursor.y - 3.7, width, rowH, 'F')
    }

    doc.setFont('Inter', 'bold')
    doc.setFontSize(8)
    ink(doc, isRed || isBlue ? rowColor : COLORS.inkMuted)
    doc.text(s.abbr, x + 1, cursor.y)
    doc.setFont('Inter', 'normal')
    doc.setFontSize(7.5)
    doc.text(s.label, x + 10, cursor.y)

    doc.setFont('Inter', 'normal')
    doc.setFontSize(8.5)
    ink(doc, COLORS.ink)
    doc.text(String(monster.baseStats[s.key]), col2, cursor.y, { align: 'center' })

    doc.setFont('Inter', 'bold')
    doc.setFontSize(9)
    ink(doc, rowColor)
    doc.text(statBonusLabel(effective.stats[s.key]), col3, cursor.y, { align: 'right' })

    cursor.y += rowH
  }

  stroke(doc, COLORS.borderLight)
  doc.setLineWidth(0.2)
  doc.rect(x, startY + 5.5, width, cursor.y - (startY + 5.5))

  cursor.y += 4
  return cursor.y - startY
}

// ─────────────────────────────────────────────────────────────────────────────
// Colonne Combat
// ─────────────────────────────────────────────────────────────────────────────

// Pré-calcule le texte replié du sous-libellé d'une case stat, pour pouvoir dimensionner
// la case (et aligner sa hauteur avec ses voisines sur la même ligne) AVANT de dessiner —
// évite que le gros chiffre central chevauche un sous-libellé qui se replie sur 2 lignes
// (ex: la formule de Dégâts d'une créature avec plusieurs traits).
function measureStatSub(doc: PdfDoc, sub: string, w: number): string[] {
  if (!sub) return []
  doc.setFont('Inter', 'normal')
  doc.setFontSize(6.2)
  return doc.splitTextToSize(sub, w - 4)
}

// Hauteur minimale nécessaire pour une case donnée son nombre de lignes de sous-libellé.
function statBoxHeight(subLineCount: number): number {
  return 15.5 + (subLineCount > 0 ? subLineCount * 3.1 + 1.3 : 0)
}

function statBox(
  doc: PdfDoc,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  subLines: string[],
  valueColor: RGB,
  boxBg: RGB,
  boxBorder: RGB,
): void {
  fill(doc, boxBg)
  stroke(doc, boxBorder)
  doc.setLineWidth(0.3)
  doc.roundedRect(x, y, w, h, 1.5, 1.5, 'FD')

  doc.setFont('Cinzel', 'normal')
  doc.setFontSize(6.6)
  ink(doc, COLORS.inkMuted)
  doc.text(label.toUpperCase(), x + w / 2, y + 4.5, { align: 'center' })

  // Le chiffre central est ancré à une position fixe depuis le haut (pas centré sur h) :
  // ainsi il ne bouge jamais, même quand la case grandit pour loger un sous-libellé long.
  doc.setFont('Cinzel', 'bold')
  doc.setFontSize(16)
  ink(doc, valueColor)
  doc.text(value, x + w / 2, y + 12, { align: 'center' })

  if (subLines.length > 0) {
    doc.setFont('Inter', 'normal')
    doc.setFontSize(6.2)
    ink(doc, COLORS.inkMuted)
    doc.text(subLines, x + w / 2, y + 16.3, { align: 'center' })
  }
}

function drawCombat(
  ctx: RenderCtx,
  monster: Monster,
  effective: EffectiveStats,
  totalDamage: { formula: string; average: number },
  x: number,
  width: number,
): number {
  const { doc, cursor } = ctx
  const startY = cursor.y
  sectionLabel(ctx, 'Combat', width, x)

  const gap = 3
  const y0 = cursor.y

  // Ligne 1 : ATT JOUEUR / DÉF JOUEUR
  const w2 = (width - gap) / 2
  const defJoueurLabel = STAT_LABELS_FR[effective.playerModifiers.defenseBaseStat] ?? effective.playerModifiers.defenseBaseStat
  const attJoueurSub = measureStatSub(doc, `10 - Défense (${effective.defense})`, w2)
  const defJoueurSub = measureStatSub(doc, `10 - ${defJoueurLabel} (${effective.stats[effective.playerModifiers.defenseBaseStat]})`, w2)
  const h0 = Math.max(statBoxHeight(attJoueurSub.length), statBoxHeight(defJoueurSub.length))
  statBox(
    doc, x, y0, w2, h0,
    'Att. joueur',
    `${effective.playerModifiers.attackModifier >= 0 ? '+' : ''}${effective.playerModifiers.attackModifier}`,
    attJoueurSub,
    COLORS.red, COLORS.redBg, COLORS.red,
  )
  statBox(
    doc, x + w2 + gap, y0, w2, h0,
    'Déf. joueur',
    `${effective.playerModifiers.defenseModifier >= 0 ? '+' : ''}${effective.playerModifiers.defenseModifier}`,
    defJoueurSub,
    COLORS.blue, COLORS.blueBg, COLORS.blue,
  )

  // Ligne 2 : DÉFENSE / ATT CAC / ATT DIST
  const y1 = y0 + h0 + gap
  const w3 = (width - gap * 2) / 3
  const meleePlacements = effective.activeReplaceStats.filter(r => r.sourceAction === 'meleeAttack')
  const attCac = meleePlacements[0] ? effective.stats[meleePlacements[0].useStat] : effective.stats.accurate
  const attCacLabel = meleePlacements[0] ? 'base Force' : 'base Précision'
  const defenseStatLabel = STAT_LABELS_FR[effective.defenseStatKey] ?? effective.defenseStatKey
  const defenseSub = measureStatSub(doc, `base ${defenseStatLabel}`, w3)
  const attCacSub = measureStatSub(doc, attCacLabel, w3)
  const attDistSub = measureStatSub(doc, 'base Précision', w3)
  const h1 = Math.max(statBoxHeight(defenseSub.length), statBoxHeight(attCacSub.length), statBoxHeight(attDistSub.length))

  statBox(doc, x, y1, w3, h1, 'Défense', String(effective.defense), defenseSub, COLORS.ink, COLORS.paperDeep, COLORS.borderLight)
  statBox(doc, x + w3 + gap, y1, w3, h1, 'Att. CAC', String(attCac), attCacSub, COLORS.ink, COLORS.paperDeep, COLORS.borderLight)
  statBox(doc, x + (w3 + gap) * 2, y1, w3, h1, 'Att. dist', String(effective.stats.accurate), attDistSub, COLORS.ink, COLORS.paperDeep, COLORS.borderLight)

  // Ligne 3 : DÉGÂTS / ABSORPTION
  const y2 = y1 + h1 + gap
  const catalogArmor = monster.equipment?.armor ? findArmor(monster.equipment.armor.id) : undefined
  const armorAvg = catalogArmor ? diceAverage(catalogArmor.protection.sides) : 0
  const skin = effective.skinProtection
  const naturalArmor = effective.armorBonusFromTraits
  const absorptionTotal = Math.round((armorAvg + (skin?.average ?? 0) + naturalArmor) * 10) / 10

  const absSubText = [
    `Armure ${armorAvg > 0 ? armorAvg : '—'}`,
    naturalArmor > 0 ? `Naturelle +${naturalArmor}` : '',
    skin ? `Peau ${skin.dice} (${skin.average})` : '',
  ].filter(Boolean).join(' · ')
  const dmgSub = measureStatSub(doc, totalDamage.formula || '—', w2)
  const absSub = measureStatSub(doc, absSubText, w2)
  const h2 = Math.max(statBoxHeight(dmgSub.length), statBoxHeight(absSub.length))

  statBox(doc, x, y2, w2, h2, 'Dégâts', String(totalDamage.average), dmgSub, COLORS.amber, COLORS.amberBg, COLORS.amber)
  statBox(doc, x + w2 + gap, y2, w2, h2, 'Absorption', String(absorptionTotal), absSub, COLORS.blue, COLORS.blueBg, COLORS.blue)

  cursor.y = y2 + h2 + 4
  return cursor.y - startY
}

// ─────────────────────────────────────────────────────────────────────────────
// Équipement
// ─────────────────────────────────────────────────────────────────────────────

function drawEquipment(ctx: RenderCtx, pageState: { page: number }, monster: Monster, effective: EffectiveStats): void {
  const weapons = monster.equipment?.weapons ?? []
  const armorRef = monster.equipment?.armor
  const other = monster.equipment?.other ?? []
  if (weapons.length === 0 && !armorRef && other.length === 0) return

  const { doc, cursor } = ctx
  ensureSpace(ctx, pageState, 16)
  sectionLabel(ctx, 'Équipement')

  doc.setFont('Inter', 'normal')
  doc.setFontSize(8.5)

  for (const w of weapons) {
    const catalog = findWeapon(w.id)
    const name = catalog?.name ?? w.name ?? w.id
    const sides = resolveWeaponSides(w, effective.naturalWeaponSides)
    const diceLabel = sides > 0 ? `1d${sides}` : '—'
    const qualityIds = catalog?.qualityIds ?? w.qualityIds ?? []

    ink(doc, COLORS.ink)
    doc.setFont('Inter', 'normal')
    doc.text(name, MARGIN + 1, cursor.y)
    const nameW = doc.getTextWidth(name)
    doc.setFont('Inter', 'bold')
    ink(doc, COLORS.amber)
    doc.text(diceLabel, MARGIN + 1 + nameW + 3, cursor.y)
    if (qualityIds.length > 0) {
      doc.setFont('Inter', 'normal')
      ink(doc, COLORS.inkMuted)
      doc.setFontSize(7.5)
      doc.text(qualityIds.join(', '), MARGIN + 1 + nameW + 3 + doc.getTextWidth(diceLabel) + 3, cursor.y)
      doc.setFontSize(8.5)
    }
    cursor.y += 4.6
  }

  if (armorRef) {
    const catalog = findArmor(armorRef.id)
    const name = catalog?.name ?? armorRef.name ?? armorRef.id
    ink(doc, COLORS.ink)
    doc.setFont('Inter', 'normal')
    doc.text(name, MARGIN + 1, cursor.y)
    if (catalog) {
      const nameW = doc.getTextWidth(name)
      doc.setFont('Inter', 'bold')
      ink(doc, COLORS.blue)
      doc.text(calculateArmorFormula(catalog), MARGIN + 1 + nameW + 3, cursor.y)
    }
    cursor.y += 4.6
  }

  if (other.length > 0) {
    doc.setFont('Inter', 'normal')
    doc.setFontSize(8)
    ink(doc, COLORS.inkMuted)
    const lines: string[] = doc.splitTextToSize(other.join(' · '), CONTENT_W - 2)
    doc.text(lines, MARGIN + 1, cursor.y)
    cursor.y += lines.length * 3.8
  }

  cursor.y += 3
}

// ─────────────────────────────────────────────────────────────────────────────
// Ombre, tactiques, notes
// ─────────────────────────────────────────────────────────────────────────────

function drawParagraphSection(ctx: RenderCtx, pageState: { page: number }, title: string, text: string): void {
  if (!text) return
  const { doc, cursor } = ctx
  doc.setFont('Inter', 'normal')
  doc.setFontSize(9)
  const lines: string[] = doc.splitTextToSize(text, CONTENT_W - 2)
  ensureSpace(ctx, pageState, 8 + lines.length * 4.2)
  sectionLabel(ctx, title)
  ink(doc, COLORS.inkMuted)
  doc.text(lines, MARGIN + 1, cursor.y)
  cursor.y += lines.length * 4.2 + 3
}

function drawShadowAndNotes(ctx: RenderCtx, pageState: { page: number }, monster: Monster): void {
  const shadowText = monster.shadow?.description
    ? `${monster.shadow.description} (Corruption ${monster.shadow.corruption})`
    : `(Corruption ${monster.shadow?.corruption ?? 0})`
  drawParagraphSection(ctx, pageState, 'Ombre', shadowText)
  if (monster.tactics) drawParagraphSection(ctx, pageState, 'Tactiques', monster.tactics)
  if (monster.notes) drawParagraphSection(ctx, pageState, 'Notes', monster.notes)
}

// ─────────────────────────────────────────────────────────────────────────────
// Capacités & Talents
// ─────────────────────────────────────────────────────────────────────────────

function abilityInlineBadges(doc: PdfDoc, a: AbilityEntry, startX: number, y: number): void {
  let x = startX
  doc.setFont('Inter', 'bold')
  doc.setFontSize(7.5)
  if (a.defenseModifier !== undefined) {
    ink(doc, COLORS.red)
    const t = `DÉF ${a.defenseModifier}`
    doc.text(t, x, y)
    x += doc.getTextWidth(t) + 3
  }
  if (a.damageBonus) {
    ink(doc, COLORS.amber)
    const t = `+${a.damageBonus} DGT`
    doc.text(t, x, y)
    x += doc.getTextWidth(t) + 3
  }
  if (a.damageDice) {
    ink(doc, COLORS.amber)
    const t = `+${a.damageDice}`
    doc.text(t, x, y)
    x += doc.getTextWidth(t) + 3
  }
  if (a.armorBonus) {
    ink(doc, COLORS.amber)
    const t = `+${a.armorBonus} ARM`
    doc.text(t, x, y)
  }
}

// Hauteur qu'occupera la carte d'une capacité — utilisé à la fois pour la dessiner et pour
// réserver, en amont, assez de place afin qu'un en-tête de groupe (Gratuit/Réactif/Actif/
// Passif) ne se retrouve jamais seul en bas de page avec sa première carte page suivante.
function measureAbilityCardHeight(doc: PdfDoc, a: AbilityEntry): number {
  doc.setFont('Inter', 'normal')
  doc.setFontSize(8.5)
  const bodyText = a.customText ?? 'Pas de description disponible.'
  const bodyLines: string[] = doc.splitTextToSize(bodyText, CONTENT_W - 8)
  return 8 + bodyLines.length * 3.9 + 3
}

function drawAbilityCard(ctx: RenderCtx, pageState: { page: number }, a: AbilityEntry): void {
  const { doc, cursor } = ctx
  const cardH = measureAbilityCardHeight(doc, a)

  ensureSpace(ctx, pageState, cardH)
  const y0 = cursor.y

  fill(doc, COLORS.paperDeep)
  stroke(doc, COLORS.borderLight)
  doc.setLineWidth(0.25)
  doc.roundedRect(MARGIN, y0, CONTENT_W, cardH, 1, 1, 'FD')

  doc.setFont('Inter', 'bold')
  doc.setFontSize(9.5)
  ink(doc, COLORS.ink)
  doc.text(a.abilityName, MARGIN + 3, y0 + 5)
  const nameW = doc.getTextWidth(a.abilityName)

  doc.setFont('Inter', 'normal')
  doc.setFontSize(7.5)
  ink(doc, COLORS.inkMuted)
  const rankLabel = levelLabel(a.rank as 1 | 2 | 3)
  doc.text(rankLabel, MARGIN + 3 + nameW + 2, y0 + 5)
  const rankW = doc.getTextWidth(rankLabel)

  abilityInlineBadges(doc, a, MARGIN + 3 + nameW + 2 + rankW + 3, y0 + 5)

  doc.setFont('Inter', 'normal')
  doc.setFontSize(8.5)
  ink(doc, COLORS.inkMuted)
  const bodyText = a.customText ?? 'Pas de description disponible.'
  const bodyLines: string[] = doc.splitTextToSize(bodyText, CONTENT_W - 8)
  doc.text(bodyLines, MARGIN + 3, y0 + 9.5)

  cursor.y = y0 + cardH + 2.5
}

function drawAbilities(ctx: RenderCtx, pageState: { page: number }, effective: EffectiveStats): void {
  const { doc, cursor } = ctx
  const groups: { type: keyof typeof ACTIVATION_PRINT_STYLES; abilities: AbilityEntry[] }[] = [
    { type: 'free', abilities: effective.allAbilities.filter(a => a.activation === 'free') },
    { type: 'reactive', abilities: effective.allAbilities.filter(a => a.activation === 'reactive') },
    { type: 'active', abilities: effective.allAbilities.filter(a => a.activation === 'active') },
    { type: 'passive', abilities: effective.allAbilities.filter(a => a.activation === 'passive' || a.activation === 'special') },
  ]

  const nonEmptyGroups = groups.filter(g => g.abilities.length > 0)
  if (nonEmptyGroups.length === 0) return

  // Réserve la place du titre de section ET de l'en-tête + première carte du premier
  // groupe, pour ne jamais laisser le titre seul en bas de page avec tout son contenu
  // reporté à la page suivante.
  const firstGroupFirstCardH = measureAbilityCardHeight(doc, nonEmptyGroups[0].abilities[0])
  ensureSpace(ctx, pageState, 10 + 7 + firstGroupFirstCardH)
  sectionLabel(ctx, 'Capacités & Talents')

  for (const group of nonEmptyGroups) {
    const style = ACTIVATION_PRINT_STYLES[group.type]

    // Même principe à l'échelle du groupe : l'en-tête (ex. "PASSIF") ne doit jamais se
    // retrouver seul en bas de page pendant que sa première carte part page suivante.
    const firstCardH = measureAbilityCardHeight(doc, group.abilities[0])
    ensureSpace(ctx, pageState, 7 + firstCardH)

    doc.setFont('Cinzel', 'normal')
    doc.setFontSize(7.5)
    ink(doc, style.color)
    doc.text(style.label.toUpperCase(), MARGIN, cursor.y)
    cursor.y += 4.5

    for (const a of group.abilities) {
      drawAbilityCard(ctx, pageState, a)
    }
    cursor.y += 1.5
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pied de page
// ─────────────────────────────────────────────────────────────────────────────

function drawFooters(doc: PdfDoc, totalPages: number): void {
  const today = new Date().toLocaleDateString('fr-FR')
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('Inter', 'normal')
    doc.setFontSize(7)
    ink(doc, COLORS.inkMuted)
    doc.text(`Bestiaire Symbaroum — fiche générée le ${today}`, MARGIN, PAGE_H - 8)
    doc.text(`Page ${i} / ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Enregistrement des polices embarquées
// ─────────────────────────────────────────────────────────────────────────────

async function registerFonts(doc: PdfDoc): Promise<void> {
  const {
    INTER_REGULAR_BASE64,
    INTER_SEMIBOLD_BASE64,
    CINZEL_SEMIBOLD_BASE64,
    CINZEL_BOLD_BASE64,
  } = await import('@/assets/fonts/pdfFonts')

  doc.addFileToVFS('Inter-Regular.ttf', INTER_REGULAR_BASE64)
  doc.addFont('Inter-Regular.ttf', 'Inter', 'normal')
  doc.addFileToVFS('Inter-SemiBold.ttf', INTER_SEMIBOLD_BASE64)
  doc.addFont('Inter-SemiBold.ttf', 'Inter', 'bold')

  doc.addFileToVFS('Cinzel-SemiBold.ttf', CINZEL_SEMIBOLD_BASE64)
  doc.addFont('Cinzel-SemiBold.ttf', 'Cinzel', 'normal')
  doc.addFileToVFS('Cinzel-Bold.ttf', CINZEL_BOLD_BASE64)
  doc.addFont('Cinzel-Bold.ttf', 'Cinzel', 'bold')
}

// ─────────────────────────────────────────────────────────────────────────────
// Point d'entrée
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère et télécharge la fiche PDF d'un monstre (officiel ou personnalisé — les deux sont
 * un même type `Monster`, aucun cas particulier ici). Génération 100% côté client, aucun
 * appel réseau/serveur.
 */
export async function exportMonsterPdf(monster: Monster): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  await registerFonts(doc)

  doc.setProperties({
    title: monster.name,
    subject: 'Fiche de monstre — Bestiaire Symbaroum',
    creator: 'Bestiaire Symbaroum',
  })

  const effective = calculateEffectiveStats(monster)
  const totalDamage = calculateTotalDamage(monster, effective)
  const totalXP = [...monster.talents, ...monster.traits].reduce((sum, r) => sum + xpForLevel(r.level), 0)

  const pageState = { page: 1 }
  paintPageBackground(doc)
  const ctx: RenderCtx = { doc, cursor: { y: MARGIN + 4 } }

  drawHeader(ctx, monster, totalXP)

  const colGap = 6
  const leftW = 62
  const rightW = CONTENT_W - leftW - colGap
  const blockStartY = ctx.cursor.y

  const leftH = drawAttributes(ctx, monster, effective, MARGIN, leftW)
  ctx.cursor.y = blockStartY
  const rightH = drawCombat(ctx, monster, effective, totalDamage, MARGIN + leftW + colGap, rightW)

  ctx.cursor.y = blockStartY + Math.max(leftH, rightH)

  drawEquipment(ctx, pageState, monster, effective)
  drawShadowAndNotes(ctx, pageState, monster)
  drawAbilities(ctx, pageState, effective)

  drawFooters(doc, pageState.page)

  await doc.save(`${slugify(monster.name)}.pdf`, { returnPromise: true })
}
