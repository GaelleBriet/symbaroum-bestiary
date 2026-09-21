<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useMonsterStore } from '@/stores/monsterStore'
import AuthStatusBar from '@/components/AuthStatusBar.vue'
import { calculateEffectiveStats, levelLabel } from '@/logic/mechanics'
import { findWeapon, findArmor } from '@/data/equipment'
import { TALENTS } from '@/data/talents'
import { TRAITS } from '@/data/traits'
import { MONSTROUS_TRAITS } from '@/data/monstrousTraits'
import {  calculateArmorFormula, diceAverage, calculateTotalDamage, resolveWeaponSides } from '@/logic/damageCalculator'
import { STAT_LABELS_FR } from '@/data/stats'
import { resistanceStyle } from '@/data/resistance'
import type { Monster } from '@/types/monster'
import type { TalentOrTrait, ActivationType } from '@/types/rules'

const store = useMonsterStore()

const monster = computed(() => store.selectedMonster!)
const effective = computed(() => calculateEffectiveStats(monster.value))

// ─── Stats ───────────────────────────────────────────────────────────────────
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

// ─── Endurance ───────────────────────────────────────────────────────────────
const current = computed(() => store.getEnduranceCurrent(monster.value.id))
const ratio = computed(() => monster.value.endurance > 0 ? current.value / monster.value.endurance : 0)
const enduranceColor = computed(() => {
  if (ratio.value > 0.6) return '#c87d2a'
  if (ratio.value > 0.3) return '#e8952a'
  return '#c84040'
})

// ─── Équipement ───────────────────────────────────────────────────────────────
const catalogWeapons = computed(() =>
  (monster.value.equipment?.weapons ?? [])
    .map(w => ({
      stored: w,
      catalog: findWeapon(w.id) ?? null,
    }))
)

const catalogArmor = computed(() => {
  const a = monster.value.equipment?.armor
  if (!a) return null
  return findArmor(a.id) ?? null
})

function weaponDiceLabel(w: typeof catalogWeapons.value[0]): string {
  const sides = resolveWeaponSides(w.stored, effective.value.naturalWeaponSides)
  return sides > 0 ? `1d${sides}` : '—'
}

// ─── Combat — dégâts totaux ───────────────────────────────────────────────────
const totalDamage = computed(() => calculateTotalDamage(monster.value, effective.value))

// ─── Combat — ATT CAC / ATT DIST ─────────────────────────────────────────────
const meleePlacements = computed(() =>
  effective.value.activeReplaceStats.filter(r => r.sourceAction === 'meleeAttack')
)
const attCac = computed(() => {
  const rs = meleePlacements.value[0]
  return rs ? effective.value.stats[rs.useStat] : effective.value.stats.accurate
})
const attCacLabel = computed(() => {
  const rs = meleePlacements.value[0]
  return rs ? 'base Force' : 'base Précision'
})
const attDist = computed(() => effective.value.stats.accurate)

// ─── Combat — ABSORPTION ─────────────────────────────────────────────────────
const armorAvg = computed(() => {
  if (!catalogArmor.value) return 0
  return diceAverage(catalogArmor.value.protection.sides)
})
const skinProtection = computed(() => effective.value.skinProtection)
const naturalArmor = computed(() => effective.value.armorBonusFromTraits)
const absorptionTotal = computed(() => {
  const skin = skinProtection.value?.average ?? 0
  return Math.round((armorAvg.value + skin + naturalArmor.value) * 10) / 10
})

// ─── XP total ─────────────────────────────────────────────────────────────────
const XP_PER_RANK: Record<1|2|3, number> = { 1: 10, 2: 30, 3: 60 }
function xpForLevel(level: 1|2|3): number {
  let total = 0
  for (let i = 1; i <= level; i++) total += XP_PER_RANK[i as 1|2|3]
  return total
}
const totalXP = computed(() =>
  [...monster.value.talents, ...monster.value.traits].reduce((s, r) => s + xpForLevel(r.level), 0)
)

// ─── Couleurs attributs ───────────────────────────────────────────────────────
// La stat "bleue" suit la substitution active : accurate par défaut, ou la stat
// de remplacement si un talent type Poigne de fer est actif.
const blueStatKey = computed(() => effective.value.playerModifiers.defenseBaseStat)
// La stat "rouge" suit la stat de défense du monstre (ATT JOUEUR / case DÉFENSE) : quick
// par défaut, ou la stat de remplacement si un talent passif type Tacticien II est actif.
const redStatKey = computed(() => effective.value.defenseStatKey)

// ─── Bonus efficient (10 - stat effective), affiché dans le tableau Attributs ─────────────
function statBonusLabel(value: number): string {
  const bonus = 10 - value
  return bonus >= 0 ? `+${bonus}` : `${bonus}`
}

// ─── DEF JOUEUR label dynamique ───────────────────────────────────────────────
const defJoueurStatLabel = computed(() =>
  STAT_LABELS_FR[effective.value.playerModifiers.defenseBaseStat] ?? effective.value.playerModifiers.defenseBaseStat
)
// Stat sur laquelle est basée la Défense de la créature (Agilité par défaut, ou remplacement
// type Tacticien II) — utilisée pour la légende de la case DÉFENSE.
const defenseStatLabel = computed(() =>
  STAT_LABELS_FR[effective.value.defenseStatKey] ?? effective.value.defenseStatKey
)

// ─── Accordion capacités ──────────────────────────────────────────────────────
interface AbilityCard {
  key: string
  abilityName: string
  rank: 1 | 2 | 3
  activation: ActivationType
  customText?: string
  defenseModifier?: number
  damageBonus?: number
  damageDice?: string
  armorBonus?: number
}

function resolveAbility(id: string): TalentOrTrait | null {
  return (
    Object.values(TALENTS).find(a => a.id === id) ??
    Object.values(TRAITS).find(a => a.id === id) ??
    Object.values(MONSTROUS_TRAITS).find(a => a.id === id) ??
    null
  )
}

const abilityCards = computed((): AbilityCard[] => {
  const m = monster.value
  const cards: AbilityCard[] = []
  for (const ref of [...m.traits, ...m.talents]) {
    const ability = resolveAbility(ref.id)
    if (!ability) continue

    const replacedRanks = new Set<number>()
    for (let i = 1; i <= ref.level; i++) {
      const eff = ability.effects[i as 1|2|3]
      if (eff?.isReplacementFor !== undefined) replacedRanks.add(eff.isReplacementFor)
    }
    for (let i = 1; i <= ref.level; i++) {
      if (replacedRanks.has(i)) continue
      const eff = ability.effects[i as 1|2|3]
      cards.push({
        key: `${ref.id}-${i}`,
        abilityName: ability.name,
        rank: i as 1|2|3,
        activation: eff.activation,
        customText: eff.customText,
        defenseModifier: eff.defenseModifier,
        damageBonus: eff.damageBonus,
        damageDice: eff.damageDice,
        armorBonus: eff.armorBonus,
      })
    }
  }
  return cards
})

const groupedCards = computed(() => ({
  free:     abilityCards.value.filter(c => c.activation === 'free'),
  reactive: abilityCards.value.filter(c => c.activation === 'reactive'),
  active:   abilityCards.value.filter(c => c.activation === 'active'),
  passive:  abilityCards.value.filter(c => c.activation === 'passive' || c.activation === 'special'),
}))

const ACTIVATION_STYLES = {
  free:     { label: 'Gratuit',  color: '#5a8a3a', border: '#2a4a1a', bg: '#0a120a' },
  reactive: { label: 'Réactif', color: '#4a7ab5', border: '#1a2a4a', bg: '#080f1a' },
  active:   { label: 'Actif',   color: '#c87d2a', border: '#8b5520', bg: '#1f1508' },
  passive:  { label: 'Passif',  color: '#7a6e52', border: '#3d3628', bg: '#1a1712' },
}

const openItems = reactive(new Set<string>())
function toggleItem(key: string) {
  if (openItems.has(key)) openItems.delete(key)
  else openItems.add(key)
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-sym-bg">

    <!-- ── BARRE 1 : AppHeader ────────────────────────────────────────────── -->
    <header class="shrink-0 flex items-center gap-3 px-5 bg-sym-bg1 border-b border-sym-border"
            style="height:56px; min-height:56px;">
      <div class="shrink-0">
        <span class="font-cinzel font-semibold text-sym-text" style="font-size:16px;">Bestiaire Symbaroum</span>
        <span class="text-sym-text3 ml-2" style="font-size:11px;">Outil MJ</span>
      </div>
      <div class="flex-1 flex items-center gap-1 overflow-hidden px-2">
        <button
          v-for="m in store.monsters"
          :key="m.id"
          @click="store.openDetail(m.id)"
          class="shrink-0 text-[11px] px-2 py-1 rounded transition-colors whitespace-nowrap"
          :style="m.id === monster.id
            ? 'background:#1f1508; color:#c87d2a; border:1px solid #8b5520;'
            : 'background:transparent; color:#7a6e52; border:1px solid transparent;'"
        >{{ m.name.split(' ')[0] }}</button>
      </div>
      <span class="shrink-0 text-sym-text3" style="font-size:11px;">
        {{ store.monsters.length }} créature{{ store.monsters.length !== 1 ? 's' : '' }}
      </span>
      <AuthStatusBar />
    </header>

    <!-- ── BARRE 2 : header MonsterDetail ────────────────────────────────── -->
    <header class="shrink-0 flex items-center gap-3 px-5 bg-sym-bg1 border-b border-sym-border"
            style="height:56px; min-height:56px;">

      <button
        @click="store.backToList()"
        class="shrink-0 text-sm px-3 py-1.5 rounded border text-sym-text3 hover:text-sym-text2 transition-colors"
        style="border-color:#332d21;"
      >← Liste</button>

      <div class="flex-1 min-w-0 flex flex-col justify-center">
        <div class="flex items-center gap-2 min-w-0">
          <h1 class="font-cinzel font-bold truncate" style="font-size:22px; color:#e8d5a3;">{{ monster.name }}</h1>
          <span
            class="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded"
            :style="`color:${resistanceStyle(monster.resistance).color}; border:1px solid ${resistanceStyle(monster.resistance).border}; background:${resistanceStyle(monster.resistance).bg};`"
          >{{ monster.resistance }}</span>
        </div>
        <p class="truncate">
          <span class="font-semibold" style="font-size:13px; color:#b8a87a;">{{ monster.race }}</span>
          <template v-if="monster.description"><span class="text-[11px]" style="color:#7a6e52;"> · {{ monster.description }}</span></template>
        </p>
      </div>

      <!-- Endurance : label + valeur + barre (sans boutons +/−/↺) -->
      <div class="shrink-0 flex items-center gap-3">
        <div class="text-right">
          <p style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#7a6e52; margin-bottom:2px;">ENDURANCE</p>
          <div class="flex items-baseline gap-1">
            <span class="font-cinzel font-bold transition-colors" style="font-size:26px;" :style="`color:${enduranceColor};`">{{ current }}</span>
            <span class="text-sm" style="color:#7a6e52;">/ {{ monster.endurance }}</span>
          </div>
          <p class="mt-0.5" style="font-size:14px; font-weight:700; color:#c87d2a;">Seuil {{ monster.painResistance }}</p>
        </div>
        <div class="shrink-0 h-2 rounded overflow-hidden" style="width:112px; background:#2a251c;">
          <div
            class="h-full rounded transition-all"
            :style="`width:${ratio * 100}%; background:${enduranceColor};`"
          />
        </div>
      </div>

      <button
        @click="store.openEditForm(monster.id)"
        class="shrink-0 text-sm px-3 py-1.5 rounded border text-sym-text3 hover:text-sym-text2 transition-colors"
        style="border-color:#332d21;"
      >Éditer</button>
    </header>

    <!-- ── Body 3 colonnes ─────────────────────────────────────────────────── -->
    <main class="flex-1 grid-cols-detail grid overflow-hidden">

      <!-- Col 1 : Attributs -->
      <aside class="overflow-y-auto border-r border-sym-border p-4 space-y-4">

        <div>
          <p class="text-[9px] font-bold uppercase tracking-widest text-sym-text3 pb-2 border-b border-sym-border mb-2">Attributs</p>
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="text-[9px] uppercase text-sym-text3">
                <th class="text-left pb-1 font-normal w-16">Stat</th>
                <th class="text-center pb-1 font-normal">Brut</th>
                <th class="text-center pb-1 font-semibold" style="color:#c87d2a;">Bonus</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="s in STATS"
                :key="s.key"
                class="border-b"
                style="border-color:#332d21;"
                :style="s.key === redStatKey
                  ? 'background:#140808;'
                  : s.key === blueStatKey
                  ? 'background:#080f18;'
                  : ''"
              >
                <td class="py-1.5 pr-2">
                  <span
                    class="font-semibold mr-1"
                    :style="s.key === redStatKey ? 'color:#c84040;' : s.key === blueStatKey ? 'color:#4a7ab5;' : 'color:#7a6e52;'"
                  >{{ s.abbr }}</span>
                  <span
                    class="text-[10px]"
                    :style="s.key === redStatKey ? 'color:#c84040;' : s.key === blueStatKey ? 'color:#4a7ab5;' : 'color:#7a6e52;'"
                  >{{ s.label }}</span>
                </td>
                <td class="text-center py-1.5 font-semibold text-sym-text" style="font-size:13px;">
                  {{ monster.baseStats[s.key] }}
                </td>
                <td
                  class="text-center py-1.5 font-bold"
                  style="font-size:14px;"
                  :style="s.key === redStatKey
                    ? 'color:#c84040;'
                    : s.key === blueStatKey
                    ? 'color:#4a7ab5;'
                    : effective.stats[s.key] !== monster.baseStats[s.key]
                    ? 'color:#c87d2a;'
                    : 'color:#e8d5a3;'"
                >
                  {{ statBonusLabel(effective.stats[s.key]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- XP total (lecture seule) -->
        <div>
          <p class="text-[9px] font-bold uppercase tracking-widest text-sym-text3 pb-2 border-b border-sym-border mb-2">Expérience</p>
          <p class="text-xs font-semibold" style="color:#c87d2a;">
            {{ totalXP }} XP
          </p>
        </div>

        <!-- Notes MJ -->
        <div v-if="monster.notes || monster.tactics">
          <p class="text-[9px] font-bold uppercase tracking-widest text-sym-text3 pb-2 border-b border-sym-border mb-2">Notes</p>
          <p class="text-[11px] italic leading-relaxed" style="color:#b8a87a; line-height:1.6;">
            {{ monster.notes ?? monster.tactics }}
          </p>
        </div>
      </aside>

      <!-- Col 2 : Combat -->
      <section class="overflow-y-auto border-r border-sym-border p-4 space-y-3">

        <!-- Ligne 1 : ATT JOUEUR + DEF JOUEUR -->
        <div class="grid grid-cols-2 gap-2.5">
          <div class="rounded-md border text-center p-3" style="background:#140808; border-color:#3a1818;">
            <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color:#c84040;">ATT. JOUEUR</p>
            <p class="font-cinzel font-bold leading-none" style="font-size:42px; color:#c84040;">
              {{ effective.playerModifiers.attackModifier >= 0 ? '+' : '' }}{{ effective.playerModifiers.attackModifier }}
            </p>
            <p class="text-[10px] mt-1" style="color:#7a6e52;">
              10 − Défense ({{ effective.defense }})
            </p>
          </div>
          <div class="rounded-md border text-center p-3" style="background:#080f18; border-color:#1a2a3a;">
            <p class="text-[9px] font-bold uppercase tracking-widest mb-1" style="color:#4a7ab5;">DÉF. JOUEUR</p>
            <p class="font-cinzel font-bold leading-none" style="font-size:42px; color:#4a7ab5;">
              {{ effective.playerModifiers.defenseModifier >= 0 ? '+' : '' }}{{ effective.playerModifiers.defenseModifier }}
            </p>
            <p class="text-[10px] mt-1" style="color:#7a6e52;">
              10 − {{ defJoueurStatLabel }} ({{ effective.stats[effective.playerModifiers.defenseBaseStat] }})
            </p>
          </div>
        </div>

        <!-- Ligne 2 : DEF + ATT CAC + ATT DIST -->
        <div class="grid grid-cols-3 gap-2.5">
          <div class="rounded-md border p-3 text-center" style="background:#1a1712; border-color:#332d21;">
            <p class="text-[9px] uppercase tracking-wide text-sym-text3 mb-1">Défense</p>
            <p class="font-cinzel font-bold text-2xl text-sym-text">{{ effective.defense }}</p>
            <p class="text-[10px] text-sym-text3 mt-0.5">base {{ defenseStatLabel }}</p>
            <p class="text-[11px] font-semibold mt-1" style="color:#c84040;">
              {{ effective.playerModifiers.attackModifier >= 0 ? '+' : '' }}{{ effective.playerModifiers.attackModifier }} ATT joueurs
            </p>
          </div>
          <div class="rounded-md border p-3 text-center" style="background:#1a1712; border-color:#332d21;">
            <p class="text-[9px] uppercase tracking-wide text-sym-text3 mb-1">ATT CAC</p>
            <p class="font-cinzel font-bold text-2xl text-sym-text">{{ attCac }}</p>
            <p class="text-[10px] text-sym-text3 mt-0.5">{{ attCacLabel }}</p>
          </div>
          <div class="rounded-md border p-3 text-center" style="background:#1a1712; border-color:#332d21;">
            <p class="text-[9px] uppercase tracking-wide text-sym-text3 mb-1">ATT DIST</p>
            <p class="font-cinzel font-bold text-2xl text-sym-text">{{ attDist }}</p>
            <p class="text-[10px] text-sym-text3 mt-0.5">base Précision</p>
          </div>
        </div>

        <!-- Ligne 3 : DÉGÂTS + ABSORPTION -->
        <div class="grid grid-cols-2 gap-2.5">
          <!-- DÉGÂTS -->
          <div class="rounded-md border p-3" style="background:#1a1712; border-color:#332d21;">
            <p class="text-[9px] uppercase tracking-wide text-sym-text3 mb-1">Dégâts</p>
            <p class="font-cinzel font-bold text-2xl" style="color:#c87d2a;">{{ totalDamage.average }}</p>
            <p class="text-[10px] text-sym-text3 mt-0.5 break-all">{{ totalDamage.formula }}</p>
          </div>
          <!-- ABSORPTION -->
          <div class="rounded-md border p-3" style="background:#1a1712; border-color:#332d21;">
            <p class="text-[9px] uppercase tracking-wide text-sym-text3 mb-1">Absorption</p>
            <p class="font-cinzel font-bold text-2xl" style="color:#7ab5e8;">{{ absorptionTotal }}</p>
            <div class="flex gap-3 mt-1">
              <div>
                <p class="text-[9px] uppercase text-sym-text3">Armure</p>
                <p class="text-xs font-semibold text-sym-text2">{{ armorAvg > 0 ? armorAvg : '—' }}</p>
              </div>
              <div v-if="naturalArmor > 0">
                <p class="text-[9px] uppercase text-sym-text3">Naturelle</p>
                <p class="text-xs font-semibold text-sym-text2">+{{ naturalArmor }}</p>
              </div>
              <div v-if="skinProtection">
                <p class="text-[9px] uppercase text-sym-text3">Peau</p>
                <p class="text-xs font-semibold text-sym-text2">
                  {{ skinProtection.dice }}
                  <span class="text-sym-text3">({{ skinProtection.average }})</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Équipement -->
        <div v-if="catalogWeapons.length > 0 || monster.equipment?.other?.length">
          <p class="text-[9px] font-bold uppercase tracking-widest text-sym-text3 pb-2 border-b border-sym-border mb-2">Armes</p>
          <div class="space-y-1.5">
            <div v-for="w in catalogWeapons" :key="w.stored.id" class="flex items-center gap-2">
              <span class="text-xs text-sym-text2">{{ w.catalog?.name ?? w.stored.name ?? w.stored.id }}</span>
              <span class="font-semibold text-xs" style="color:#c87d2a;">{{ weaponDiceLabel(w) }}</span>
              <div class="flex gap-1 flex-wrap">
                <span
                  v-for="qid in (w.catalog?.qualityIds ?? w.stored.qualityIds ?? [])"
                  :key="qid"
                  class="text-[9px] px-1.5 py-0.5 rounded"
                  style="background:#221e17; color:#7a6e52; border:1px solid #332d21;"
                >{{ qid }}</span>
              </div>
            </div>
            <div v-if="catalogArmor" class="flex items-center gap-2">
              <span class="text-xs text-sym-text2">{{ catalogArmor.name }}</span>
              <span class="font-semibold text-xs" style="color:#7ab5e8;">{{ calculateArmorFormula(catalogArmor) }}</span>
            </div>
            <div v-if="monster.equipment?.other?.length" class="text-[11px] text-sym-text3 italic mt-1">
              {{ monster.equipment.other.join(' · ') }}
            </div>
          </div>
        </div>

        <!-- Substitutions actives -->
        <div v-if="effective.activeReplaceStats.length > 0">
          <p class="text-[9px] font-bold uppercase tracking-widest text-sym-text3 pb-2 border-b border-sym-border mb-2">Substitutions actives</p>
          <div v-for="rs in effective.activeReplaceStats" :key="rs.source" class="text-[11px] text-sym-text3">
            {{ rs.source }} → utilise <span class="font-semibold text-sym-text2">{{ rs.useStat }}</span>
          </div>
        </div>
      </section>

      <!-- Col 3 : Capacités -->
      <aside class="overflow-y-auto p-4 space-y-3">
        <p class="text-[9px] font-bold uppercase tracking-widest text-sym-text3 pb-2 border-b border-sym-border">Capacités & Talents</p>

        <template v-for="(group, type) in groupedCards" :key="type">
          <div v-if="group.length > 0" class="space-y-1.5">
            <p
              class="text-[9px] font-bold uppercase tracking-widest px-1"
              :style="`color:${ACTIVATION_STYLES[type as keyof typeof ACTIVATION_STYLES].color};`"
            >{{ ACTIVATION_STYLES[type as keyof typeof ACTIVATION_STYLES].label }}</p>

            <div
              v-for="card in group"
              :key="card.key"
              class="rounded overflow-hidden border"
              style="border-color:#332d21; background:#1a1712;"
            >
              <button
                @click="toggleItem(card.key)"
                class="w-full flex items-center justify-between px-3 py-2 text-left transition-colors"
                :style="openItems.has(card.key) ? 'background:#221e17;' : ''"
                @mouseenter="(e) => (e.currentTarget as HTMLElement).style.background = '#221e17'"
                @mouseleave="(e) => (e.currentTarget as HTMLElement).style.background = openItems.has(card.key) ? '#221e17' : ''"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-[13px] font-semibold text-sym-text truncate">{{ card.abilityName }}</span>
                  <span class="text-[10px] text-sym-text3 shrink-0">{{ levelLabel(card.rank) }}</span>
                  <span v-if="card.defenseModifier !== undefined" class="text-[10px] text-sym-red shrink-0">DÉF {{ card.defenseModifier }}</span>
                  <span v-if="card.damageBonus" class="text-[10px] text-sym-amber shrink-0">+{{ card.damageBonus }} DGT</span>
                  <span v-if="card.damageDice" class="text-[10px] text-sym-amber shrink-0">+{{ card.damageDice }}</span>
                  <span v-if="card.armorBonus" class="text-[10px] text-sym-amber shrink-0">+{{ card.armorBonus }} ARM</span>
                </div>
                <span
                  class="shrink-0 text-sym-text3 text-xs ml-2 transition-transform duration-200"
                  :style="openItems.has(card.key) ? 'transform:rotate(180deg);display:inline-block;' : 'display:inline-block;'"
                >▼</span>
              </button>
              <div
                v-if="openItems.has(card.key)"
                class="px-3 py-2 border-t"
                style="background:#131109; border-color:#332d21;"
              >
                <p
                  v-if="card.customText"
                  class="text-[11px] leading-relaxed whitespace-pre-line"
                  style="color:#b8a87a; line-height:1.55;"
                >{{ card.customText }}</p>
                <p v-else class="text-[11px] text-sym-text3 italic">Pas de description disponible.</p>
              </div>
            </div>
          </div>
        </template>

        <p v-if="abilityCards.length === 0" class="text-[11px] text-sym-text3 italic">Aucune capacité.</p>
      </aside>
    </main>
  </div>
</template>
