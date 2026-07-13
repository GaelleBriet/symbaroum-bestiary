<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { Monster, MonsterStats, MonsterStatModifiers, SelectedReference } from '@/types/monster'
import { MONSTROUS_TRAITS } from '@/data/monstrousTraits'
import { TALENTS } from '@/data/talents'
import { WEAPONS, ARMORS } from '@/data/equipment'

const props = defineProps<{
  mode: 'create' | 'edit'
  initialData?: Monster
}>()

const emit = defineEmits<{
  (e: 'save', data: Omit<Monster, 'id' | 'createdAt'>): void
  (e: 'cancel'): void
}>()

// ─── Valeurs par défaut ───────────────────────────────────────────────────────
const ZERO_MODS: MonsterStatModifiers = {
  accurate: 0, cunning: 0, discreet: 0, persuasive: 0,
  quick: 0, resolute: 0, strong: 0, vigilant: 0,
}

const DEFAULT_STATS: MonsterStats = {
  accurate: 10, cunning: 10, discreet: 10, persuasive: 10,
  quick: 10, resolute: 10, strong: 10, vigilant: 10,
}

const STAT_LABELS: [keyof MonsterStats, string][] = [
  ['accurate',   'Précision'],
  ['cunning',    'Astuce'],
  ['discreet',   'Discrétion'],
  ['persuasive', 'Persuasion'],
  ['quick',      'Agilité'],
  ['resolute',   'Volonté'],
  ['strong',     'Force'],
  ['vigilant',   'Vigilance'],
]

const RESISTANCE_OPTIONS: Monster['resistance'][] = [
  'Faible', 'Ordinaire', 'Éprouvante', 'Forte', 'Colossale',
]

const LEVEL_LABELS: Record<1|2|3, string> = { 1: 'I', 2: 'II', 3: 'III' }

// ─── État du formulaire ───────────────────────────────────────────────────────
const form = reactive({
  name:          props.initialData?.name ?? '',
  race:          props.initialData?.race ?? '',
  description:   props.initialData?.description ?? '',
  resistance:    props.initialData?.resistance ?? ('Ordinaire' as Monster['resistance']),
  endurance:     props.initialData?.endurance ?? 10,
  painResistance: props.initialData?.painResistance ?? 5,
  defenseBonus:  props.initialData?.defenseBonus ?? 0,
  baseStats: { ...(props.initialData?.baseStats ?? DEFAULT_STATS) },
  statModifiers: { ...(props.initialData?.statModifiers ?? ZERO_MODS) },
  shadow: {
    description: props.initialData?.shadow?.description ?? '',
    corruption:  props.initialData?.shadow?.corruption  ?? 0,
  },
  traits:  [...(props.initialData?.traits  ?? [])] as SelectedReference[],
  talents: [...(props.initialData?.talents ?? [])] as SelectedReference[],
  equipment: {
    weapons: (props.initialData?.equipment?.weapons ?? []).map(w => ({ ...w })),
    armor: props.initialData?.equipment?.armor
      ? { ...props.initialData.equipment.armor }
      : null as { id: string; name?: string; protection: number; qualityIds?: string[] } | null,
  },
  notes: props.initialData?.notes ?? '',
})

// ─── Validation ───────────────────────────────────────────────────────────────
const errors = reactive<Record<string, string>>({})

function validate(): boolean {
  Object.keys(errors).forEach(k => delete errors[k])

  if (!form.name.trim())  errors.name = 'Requis'
  if (!form.race.trim())  errors.race = 'Requis'

  for (const [key] of STAT_LABELS) {
    const val = form.baseStats[key]
    if (!Number.isInteger(val) || val < 5 || val > 15) {
      errors[`stat_${key}`] = '5–15'
    }
  }

  if (form.endurance < 1)      errors.endurance = '≥ 1'
  if (form.painResistance < 1) errors.painResistance = '≥ 1'

  return Object.keys(errors).length === 0
}

// ─── Traits monstrueux ────────────────────────────────────────────────────────
const pendingTrait = reactive({ id: '', level: 1 as 1|2|3 })

const traitOptions = computed(() =>
  Object.values(MONSTROUS_TRAITS).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
)

function traitName(id: string): string {
  return MONSTROUS_TRAITS[Object.keys(MONSTROUS_TRAITS).find(k => MONSTROUS_TRAITS[k].id === id) ?? '']?.name ?? id
}

function addTrait() {
  if (!pendingTrait.id) return
  const idx = form.traits.findIndex(t => t.id === pendingTrait.id)
  if (idx !== -1) form.traits.splice(idx, 1)
  form.traits.push({ id: pendingTrait.id, level: pendingTrait.level })
  pendingTrait.id = ''
  pendingTrait.level = 1
}

function removeTrait(id: string) {
  const idx = form.traits.findIndex(t => t.id === id)
  if (idx !== -1) form.traits.splice(idx, 1)
}

// ─── Talents ──────────────────────────────────────────────────────────────────
const pendingTalent = reactive({ id: '', level: 1 as 1|2|3 })

const talentOptions = computed(() =>
  Object.values(TALENTS).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
)

function talentName(id: string): string {
  return TALENTS[Object.keys(TALENTS).find(k => TALENTS[k].id === id) ?? '']?.name ?? id
}

function addTalent() {
  if (!pendingTalent.id) return
  const idx = form.talents.findIndex(t => t.id === pendingTalent.id)
  if (idx !== -1) form.talents.splice(idx, 1)
  form.talents.push({ id: pendingTalent.id, level: pendingTalent.level })
  pendingTalent.id = ''
  pendingTalent.level = 1
}

function removeTalent(id: string) {
  const idx = form.talents.findIndex(t => t.id === id)
  if (idx !== -1) form.talents.splice(idx, 1)
}

// ─── Compteur XP ─────────────────────────────────────────────────────────────
// Chaque rang s'achète indépendamment : niveau II = rang I (10) + rang II (30) = 40 XP
const XP_PER_RANK: Record<1|2|3, number> = { 1: 10, 2: 30, 3: 60 }
function xpForLevel(level: 1|2|3): number {
  let total = 0
  for (let i = 1 as 1|2|3; i <= level; i++) total += XP_PER_RANK[i as 1|2|3]
  return total
}
const totalXP = computed(() =>
  [...form.traits, ...form.talents].reduce((sum, sel) => sum + xpForLevel(sel.level), 0)
)

// ─── Qualités — noms affichés ─────────────────────────────────────────────────
const QUALITY_NAMES: Record<string, string> = {
  equilibre:  'Équilibré',
  eventreur:  'Éventreur',
  flexible:   'Flexible',
  long:       'Long',
  court:      'Court',
  contondant: 'Contondant',
  precis:     'Précis',
  encombrant: 'Encombrant',
  genante:    'Gênant',
  pratique:   'Pratique',
}

function qualityLabel(id: string): string {
  return QUALITY_NAMES[id] ?? id
}

// ─── Équipement — armes (catalogue) ──────────────────────────────────────────
const weaponOptions = computed(() =>
  Object.values(WEAPONS).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
)

const pendingWeaponId = reactive({ id: '' })

const selectedWeaponPreview = computed(() =>
  pendingWeaponId.id
    ? Object.values(WEAPONS).find(w => w.id === pendingWeaponId.id) ?? null
    : null
)

function weaponDamageLabel(sides: number): string {
  return sides > 0 ? `1d${sides}` : '—'
}

// Retrouve les infos catalogue d'une arme déjà ajoutée (pour afficher les qualités)
function catalogWeapon(id: string) {
  return Object.values(WEAPONS).find(w => w.id === id) ?? null
}

function addWeapon() {
  if (!pendingWeaponId.id) return
  const w = Object.values(WEAPONS).find(w => w.id === pendingWeaponId.id)
  if (!w) return
  // Remplace si déjà présent
  const idx = form.equipment.weapons.findIndex(ew => ew.id === w.id)
  if (idx !== -1) form.equipment.weapons.splice(idx, 1)
  form.equipment.weapons.push({
    id: w.id,
    name: w.name,
    damage: w.damage.sides,
    qualityIds: w.qualityIds ? [...w.qualityIds] : [],
  })
  pendingWeaponId.id = ''
}

function removeWeapon(idx: number) {
  form.equipment.weapons.splice(idx, 1)
}

// ─── Équipement — armure (catalogue) ─────────────────────────────────────────
const armorOptions = computed(() =>
  Object.values(ARMORS).sort((a, b) => a.name.localeCompare(b.name, 'fr'))
)

const pendingArmorId = reactive({ id: '' })

const selectedArmorPreview = computed(() =>
  pendingArmorId.id
    ? Object.values(ARMORS).find(a => a.id === pendingArmorId.id) ?? null
    : null
)

const CATEGORY_LABELS: Record<string, string> = {
  light: 'Légère', medium: 'Moyenne', heavy: 'Lourde',
}

function catalogArmor(id: string) {
  return Object.values(ARMORS).find(a => a.id === id) ?? null
}

function addArmor() {
  if (!pendingArmorId.id) return
  const a = Object.values(ARMORS).find(a => a.id === pendingArmorId.id)
  if (!a) return
  form.equipment.armor = {
    id: a.id,
    name: a.name,
    protection: a.protection.sides,
    qualityIds: a.qualityIds ? [...a.qualityIds] : [],
  }
  pendingArmorId.id = ''
}

function removeArmor() {
  form.equipment.armor = null
}

// ─── Soumission ───────────────────────────────────────────────────────────────
function submit() {
  if (!validate()) return

  const data: Omit<Monster, 'id' | 'createdAt'> = {
    name:          form.name.trim(),
    race:          form.race.trim(),
    description:   form.description.trim() || undefined,
    isCustom:      true,
    baseStats:     { ...form.baseStats },
    statModifiers: { ...form.statModifiers },
    resistance:    form.resistance,
    endurance:     form.endurance,
    painResistance: form.painResistance,
    defenseBonus:  form.defenseBonus,
    shadow:        { ...form.shadow },
    traits:        form.traits.map(t => ({ ...t })),
    talents:       form.talents.map(t => ({ ...t })),
    equipment: {
      weapons: form.equipment.weapons.length > 0
        ? form.equipment.weapons.map(w => ({ ...w }))
        : undefined,
      armor: form.equipment.armor
        ? { ...form.equipment.armor }
        : undefined,
    },
    notes: form.notes.trim() || undefined,
  }

  // Sérialise en plain object pour détruire les Proxies Vue avant passage à Dexie
  emit('save', JSON.parse(JSON.stringify(data)))
}
</script>

<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 overflow-y-auto">
    <div class="w-full max-w-3xl bg-sym-bg1 border border-sym-border rounded-lg my-4 shadow-xl">

      <!-- En-tête -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-sym-border">
        <h2 class="text-lg font-bold text-sym-text">
          {{ mode === 'create' ? 'Nouveau monstre' : 'Modifier le monstre' }}
        </h2>
        <button
          @click="emit('cancel')"
          class="text-sym-text3 hover:text-sym-text text-xl leading-none"
          aria-label="Fermer"
        >×</button>
      </div>

      <!-- Corps du formulaire -->
      <form @submit.prevent="submit" class="p-5 space-y-6">

        <!-- ── Identité ────────────────────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">Identité</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-sym-text2 mb-1">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Ex: Gobelin des marais"
                class="w-full bg-sym-bg2 border rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim"
                :class="errors.name ? 'border-red-600' : 'border-sym-border2'"
              />
              <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="block text-xs text-sym-text2 mb-1">
                Type / Race <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.race"
                type="text"
                placeholder="Ex: Gobelin, Troll, Humain…"
                class="w-full bg-sym-bg2 border rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim"
                :class="errors.race ? 'border-red-600' : 'border-sym-border2'"
              />
              <p v-if="errors.race" class="text-red-500 text-xs mt-1">{{ errors.race }}</p>
            </div>
          </div>
          <div>
            <label class="block text-xs text-sym-text2 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="2"
              placeholder="Description optionnelle…"
              class="w-full bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim resize-none"
            />
          </div>
        </section>

        <!-- ── Résistance & Endurance ──────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">Résistance & Endurance</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-xs text-sym-text2 mb-1">Résistance</label>
              <select
                v-model="form.resistance"
                class="w-full bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
              >
                <option v-for="opt in RESISTANCE_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-sym-text2 mb-1">Endurance</label>
              <input
                v-model.number="form.endurance"
                type="number" min="1" max="999"
                class="w-full bg-sym-bg2 border rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
                :class="errors.endurance ? 'border-red-600' : 'border-sym-border2'"
              />
              <p v-if="errors.endurance" class="text-red-500 text-xs mt-1">{{ errors.endurance }}</p>
            </div>
            <div>
              <label class="block text-xs text-sym-text2 mb-1">Seuil douleur</label>
              <input
                v-model.number="form.painResistance"
                type="number" min="1" max="999"
                class="w-full bg-sym-bg2 border rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
                :class="errors.painResistance ? 'border-red-600' : 'border-sym-border2'"
              />
              <p v-if="errors.painResistance" class="text-red-500 text-xs mt-1">{{ errors.painResistance }}</p>
            </div>
          </div>
        </section>

        <!-- ── 8 Stats ─────────────────────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">
            Attributs <span class="text-sym-text3 normal-case font-normal">(5–15)</span>
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="[key, label] in STAT_LABELS" :key="key">
              <label class="block text-xs text-sym-text2 mb-1">{{ label }}</label>
              <input
                v-model.number="form.baseStats[key]"
                type="number" min="5" max="15"
                class="w-full bg-sym-bg2 border rounded px-3 py-2 text-sm text-sym-text font-mono text-center focus:outline-none focus:border-sym-adim"
                :class="errors[`stat_${key}`] ? 'border-red-600' : 'border-sym-border2'"
              />
              <p v-if="errors[`stat_${key}`]" class="text-red-500 text-xs mt-0.5 text-center">
                {{ errors[`stat_${key}`] }}
              </p>
            </div>
          </div>
        </section>

        <!-- ── Traits monstrueux ───────────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">Traits monstrueux</h3>

          <!-- Badges sélectionnés -->
          <div v-if="form.traits.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="t in form.traits"
              :key="t.id"
              class="inline-flex items-center gap-1 bg-sym-bg2 border border-sym-border2 text-sym-text text-xs px-2 py-1 rounded"
            >
              {{ traitName(t.id) }} {{ LEVEL_LABELS[t.level] }}
              <button
                type="button"
                @click="removeTrait(t.id)"
                class="text-sym-text3 hover:text-red-400 ml-1 leading-none"
              >×</button>
            </span>
          </div>

          <!-- Ajout -->
          <div class="flex gap-2">
            <select
              v-model="pendingTrait.id"
              class="flex-1 bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
            >
              <option value="">— Choisir un trait —</option>
              <option v-for="t in traitOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
            <select
              v-model.number="pendingTrait.level"
              class="bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
            >
              <option :value="1">I</option>
              <option :value="2">II</option>
              <option :value="3">III</option>
            </select>
            <button
              type="button"
              @click="addTrait"
              :disabled="!pendingTrait.id"
              class="bg-sym-amber hover:bg-sym-amber2 disabled:opacity-40 text-sym-text px-3 py-2 rounded text-sm font-medium transition-colors"
            >Ajouter</button>
          </div>
        </section>

        <!-- ── Talents ─────────────────────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">Talents</h3>

          <div v-if="form.talents.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="t in form.talents"
              :key="t.id"
              class="inline-flex items-center gap-1 bg-sym-bg2 border border-sym-border2 text-sym-text text-xs px-2 py-1 rounded"
            >
              {{ talentName(t.id) }} {{ LEVEL_LABELS[t.level] }}
              <button
                type="button"
                @click="removeTalent(t.id)"
                class="text-sym-text3 hover:text-red-400 ml-1 leading-none"
              >×</button>
            </span>
          </div>

          <div class="flex gap-2">
            <select
              v-model="pendingTalent.id"
              class="flex-1 bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
            >
              <option value="">— Choisir un talent —</option>
              <option v-for="t in talentOptions" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
            <select
              v-model.number="pendingTalent.level"
              class="bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
            >
              <option :value="1">I</option>
              <option :value="2">II</option>
              <option :value="3">III</option>
            </select>
            <button
              type="button"
              @click="addTalent"
              :disabled="!pendingTalent.id"
              class="bg-sym-amber hover:bg-sym-amber2 disabled:opacity-40 text-sym-text px-3 py-2 rounded text-sm font-medium transition-colors"
            >Ajouter</button>
          </div>
        </section>

        <!-- ── Équipement — Armes ─────────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">Armes</h3>

          <!-- Armes ajoutées -->
          <div v-if="form.equipment.weapons.length > 0" class="flex flex-wrap gap-2">
            <span
              v-for="(w, idx) in form.equipment.weapons"
              :key="w.id"
              class="inline-flex items-center gap-1.5 bg-sym-bg2 border border-sym-border2 text-sym-text text-xs px-2 py-1 rounded"
            >
              <span class="font-medium">{{ w.name }}</span>
              <span class="text-sym-text3 font-mono">{{ weaponDamageLabel(w.damage) }}</span>
              <template v-if="catalogWeapon(w.id)?.qualityIds?.length">
                <span
                  v-for="qid in catalogWeapon(w.id)!.qualityIds"
                  :key="qid"
                  class="text-amber-500"
                >· {{ qualityLabel(qid) }}</span>
              </template>
              <button
                type="button"
                @click="removeWeapon(idx)"
                class="text-sym-text3 hover:text-red-400 ml-0.5 leading-none"
              >×</button>
            </span>
          </div>

          <!-- Sélecteur arme -->
          <div class="space-y-2">
            <div class="flex gap-2">
              <select
                v-model="pendingWeaponId.id"
                class="flex-1 bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
              >
                <option value="">— Sélectionner une arme —</option>
                <option v-for="w in weaponOptions" :key="w.id" :value="w.id">{{ w.name }}</option>
              </select>
              <button
                type="button"
                @click="addWeapon"
                :disabled="!pendingWeaponId.id"
                class="bg-sym-amber hover:bg-sym-amber2 disabled:opacity-40 text-sym-text px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >+ Ajouter</button>
            </div>

            <!-- Aperçu arme sélectionnée -->
            <div
              v-if="selectedWeaponPreview"
              class="flex flex-wrap items-center gap-2 bg-sym-bg2 border border-sym-border rounded px-3 py-2 text-xs"
            >
              <span class="text-sym-text2">Dégâts :</span>
              <span class="font-mono text-sym-text">
                {{ weaponDamageLabel(selectedWeaponPreview.damage.sides) }}
              </span>
              <template v-if="selectedWeaponPreview.qualityIds?.length">
                <span class="text-sym-text3">|</span>
                <span
                  v-for="qid in selectedWeaponPreview.qualityIds"
                  :key="qid"
                  class="bg-sym-bg3 text-amber-400 px-1.5 py-0.5 rounded"
                >{{ qualityLabel(qid) }}</span>
              </template>
            </div>
          </div>
        </section>

        <!-- ── Équipement — Armure ─────────────────────────────────────── -->
        <section class="space-y-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-sym-text3">Armure</h3>

          <!-- Armure ajoutée -->
          <div v-if="form.equipment.armor" class="flex flex-wrap gap-2">
            <span
              class="inline-flex items-center gap-1.5 bg-sym-bg2 border border-sym-border2 text-sym-text text-xs px-2 py-1 rounded"
            >
              <span class="font-medium">{{ form.equipment.armor.name }}</span>
              <span class="text-sym-text3 font-mono">1d{{ form.equipment.armor.protection }}</span>
              <span v-if="catalogArmor(form.equipment.armor.id)" class="text-sym-text3">
                · {{ CATEGORY_LABELS[catalogArmor(form.equipment.armor.id)!.category] }}
              </span>
              <template v-if="catalogArmor(form.equipment.armor.id)?.qualityIds?.length">
                <span
                  v-for="qid in catalogArmor(form.equipment.armor.id)!.qualityIds"
                  :key="qid"
                  class="text-amber-500"
                >· {{ qualityLabel(qid) }}</span>
              </template>
              <button
                type="button"
                @click="removeArmor"
                class="text-sym-text3 hover:text-red-400 ml-0.5 leading-none"
              >×</button>
            </span>
          </div>

          <!-- Sélecteur armure (masqué si armure déjà présente) -->
          <div v-if="!form.equipment.armor" class="space-y-2">
            <div class="flex gap-2">
              <select
                v-model="pendingArmorId.id"
                class="flex-1 bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim"
              >
                <option value="">— Sélectionner une armure —</option>
                <option v-for="a in armorOptions" :key="a.id" :value="a.id">
                  {{ a.name }} ({{ CATEGORY_LABELS[a.category] }})
                </option>
              </select>
              <button
                type="button"
                @click="addArmor"
                :disabled="!pendingArmorId.id"
                class="bg-sym-amber hover:bg-sym-amber2 disabled:opacity-40 text-sym-text px-3 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
              >+ Ajouter</button>
            </div>

            <!-- Aperçu armure sélectionnée -->
            <div
              v-if="selectedArmorPreview"
              class="flex flex-wrap items-center gap-2 bg-sym-bg2 border border-sym-border rounded px-3 py-2 text-xs"
            >
              <span class="text-sym-text2">Protection :</span>
              <span class="font-mono text-sym-text">1d{{ selectedArmorPreview.protection.sides }}</span>
              <span class="text-sym-text3">|</span>
              <span class="text-sym-text2">{{ CATEGORY_LABELS[selectedArmorPreview.category] }}</span>
              <template v-if="selectedArmorPreview.qualityIds?.length">
                <span class="text-sym-text3">|</span>
                <span
                  v-for="qid in selectedArmorPreview.qualityIds"
                  :key="qid"
                  class="bg-sym-bg3 text-amber-400 px-1.5 py-0.5 rounded"
                >{{ qualityLabel(qid) }}</span>
              </template>
            </div>
          </div>
        </section>

        <!-- ── Notes ──────────────────────────────────────────────────── -->
        <section>
          <label class="block text-xs text-sym-text2 mb-1">Notes (tactiques, comportement…)</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Notes de combat, tactiques…"
            class="w-full bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim resize-none"
          />
        </section>

        <!-- ── Compteur XP ─────────────────────────────────────────────── -->
        <div class="flex items-center gap-2 text-xs text-sym-text3">
          <span class="uppercase tracking-widest">Total XP :</span>
          <span class="font-semibold" style="color:#c87d2a;">{{ totalXP }} XP</span>
          <span style="color:#7a6e52;">(niv. I = 10 · II = 30 · III = 60)</span>
        </div>

        <!-- ── Boutons ─────────────────────────────────────────────────── -->
        <div class="flex justify-end gap-3 pt-2 border-t border-sym-border">
          <button
            type="button"
            @click="emit('cancel')"
            class="px-4 py-2 text-sm text-sym-text2 hover:text-sym-text transition-colors"
          >Annuler</button>
          <button
            type="submit"
            class="px-5 py-2 bg-sym-amber hover:bg-sym-amber2 text-sym-text rounded font-semibold text-sm transition-colors"
          >Sauvegarder</button>
        </div>

      </form>
    </div>
  </div>
</template>
