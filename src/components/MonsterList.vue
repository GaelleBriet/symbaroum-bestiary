<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMonsterStore } from '@/stores/monsterStore'
import { MONSTERS } from '@/data/monsters'
import { RESISTANCE_OPTIONS, resistanceStyle } from '@/data/resistance'
import type { Monster } from '@/types/monster'
import AuthStatusBar from '@/components/AuthStatusBar.vue'

const store = useMonsterStore()

const search = ref('')
const filterResistance = ref('')
const selectedPreset = ref('')
const addedFeedback = ref(false)

const filtered = computed(() => {
  let list = store.monsters
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(m => m.name.toLowerCase().includes(q) || m.race.toLowerCase().includes(q))
  }
  if (filterResistance.value) {
    list = list.filter(m => m.resistance === filterResistance.value)
  }
  return list
})

// Monstres prédéfinis groupés par race (tri alphabétique)
const groupedPresets = computed(() => {
  const groups: Record<string, Monster[]> = {}
  for (const monster of Object.values(MONSTERS)) {
    if (!groups[monster.race]) groups[monster.race] = []
    groups[monster.race].push(monster)
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'fr'))
})

async function addPresetMonster() {
  if (!selectedPreset.value) return
  const preset = Object.values(MONSTERS).find(m => m.id === selectedPreset.value)
  if (!preset) return
  const { id: _id, createdAt: _ct, ...rest } = preset
  await store.addMonster({ ...rest, isCustom: false })
  selectedPreset.value = ''
  addedFeedback.value = true
  setTimeout(() => { addedFeedback.value = false }, 2000)
}

// Confirmation suppression
const confirmingDeleteId = ref<string | null>(null)
function requestDelete(e: Event, id: string) {
  e.stopPropagation()
  confirmingDeleteId.value = id
}
async function confirmDelete(id: string) {
  await store.deleteMonster(id)
  confirmingDeleteId.value = null
}

function enduranceCurrent(m: Monster): number {
  return store.getEnduranceCurrent(m.id)
}

function enduranceRatio(m: Monster): number {
  return enduranceCurrent(m) / m.endurance
}

function enduranceBarColor(ratio: number): string {
  if (ratio > 0.6) return '#5a8a3a'
  if (ratio > 0.3) return '#c87d2a'
  return '#c84040'
}
</script>

<template>
  <div class="h-screen flex flex-col overflow-hidden bg-sym-bg">

    <!-- TopNav -->
    <nav class="shrink-0 flex items-center justify-between px-5 py-3 bg-sym-bg1 border-b border-sym-border">
      <h1 class="font-cinzel text-lg font-semibold text-sym-text tracking-wide">
        Bestiaire Symbaroum
      </h1>
      <div class="flex items-center gap-3">
        <span class="text-xs text-sym-text3">
          {{ store.monsters.length }} créature{{ store.monsters.length !== 1 ? 's' : '' }}
        </span>
        <AuthStatusBar />
      </div>
    </nav>

    <!-- Barre de contrôle 2 lignes -->
    <div class="shrink-0 px-5 pt-3 pb-2.5 bg-sym-bg1 border-b border-sym-border space-y-2">

      <!-- Ligne 1 : Recherche + Filtre résistance -->
      <div class="flex items-center gap-2.5">
        <input
          v-model="search"
          type="text"
          placeholder="Rechercher…"
          class="flex-1 bg-sym-bg2 border border-sym-border rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim transition-colors"
        />
        <select
          v-model="filterResistance"
          class="bg-sym-bg2 border border-sym-border rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim w-44 transition-colors"
        >
          <option value="">Toutes résistances</option>
          <option v-for="r in RESISTANCE_OPTIONS" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <!-- Ligne 2 : Créer + Monstres prédéfinis -->
      <div class="flex items-center gap-2.5">
        <button
          @click="store.openCreateForm()"
          class="shrink-0 px-4 py-2 rounded text-sm font-semibold transition-colors"
          style="background:#c87d2a; color:#0d0c0a;"
        >+ Créer un monstre</button>
        <select
          v-model="selectedPreset"
          @change="addPresetMonster()"
          class="flex-1 bg-sym-bg2 border border-sym-border rounded px-3 py-2 text-sm text-sym-text focus:outline-none focus:border-sym-adim transition-colors"
        >
          <option value="">Sélectionner un monstre prédéfini…</option>
          <optgroup v-for="[race, monsters] in groupedPresets" :key="race" :label="race">
            <option v-for="m in monsters" :key="m.id" :value="m.id">{{ m.name }}</option>
          </optgroup>
        </select>
        <span
          v-if="addedFeedback"
          class="shrink-0 text-xs font-semibold"
          style="color:#6a9a4a;"
        >Monstre ajouté !</span>
      </div>

    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-2">

      <div v-if="store.isLoading" class="text-sym-text3 text-sm">Chargement…</div>

      <div v-else-if="store.monsters.length === 0" class="text-sym-text3 text-sm italic mt-8 text-center">
        Aucun monstre. Clique sur "+ Créer un monstre" ou sélectionne un monstre prédéfini.
      </div>

      <div v-else-if="filtered.length === 0" class="text-sym-text3 text-sm italic mt-8 text-center">
        Aucun résultat pour cette recherche.
      </div>

      <!-- Confirmation suppression modal -->
      <div
        v-if="confirmingDeleteId"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.75)"
        @click.self="confirmingDeleteId = null"
      >
        <div class="bg-sym-bg2 border border-sym-border rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
          <p class="text-sym-text text-sm mb-1">Supprimer ce monstre ?</p>
          <p class="text-sym-text3 text-xs mb-5">Cette action est irréversible.</p>
          <div class="flex justify-end gap-3">
            <button
              @click="confirmingDeleteId = null"
              class="px-4 py-2 text-sm text-sym-text3 hover:text-sym-text2 transition-colors"
            >Annuler</button>
            <button
              @click="confirmDelete(confirmingDeleteId!)"
              class="px-4 py-2 text-sm rounded font-semibold transition-colors"
              style="background:#3a1212; color:#c84040; border: 1px solid #5a2020;"
            >Supprimer</button>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <div
        v-for="monster in filtered"
        :key="monster.id"
        @click="store.openDetail(monster.id)"
        class="grid items-center rounded-md border cursor-pointer transition-colors"
        style="grid-template-columns: 1fr auto; background:#131109; border-color:#332d21; padding: 14px 18px;"
        @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.background='#1a1712'; (e.currentTarget as HTMLElement).style.borderColor='#3d3628' }"
        @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.background='#131109'; (e.currentTarget as HTMLElement).style.borderColor='#332d21' }"
      >
        <!-- Gauche -->
        <div class="min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-cinzel text-sm font-semibold text-sym-text truncate">{{ monster.name }}</span>
            <span
              class="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded"
              :style="`color:${resistanceStyle(monster.resistance).color}; border: 1px solid ${resistanceStyle(monster.resistance).border}; background:${resistanceStyle(monster.resistance).bg};`"
            >{{ monster.resistance }}</span>
          </div>
          <p class="text-[11px] text-sym-text3 mb-2">{{ monster.race }}</p>

          <div class="flex items-center gap-2">
            <div class="w-20 h-1 rounded-sm overflow-hidden" style="background:#2a251c;">
              <div
                class="h-full rounded-sm transition-all"
                :style="`width: ${enduranceRatio(monster) * 100}%; background: ${enduranceBarColor(enduranceRatio(monster))}`"
              />
            </div>
            <span class="text-[11px] text-sym-text3">
              {{ enduranceCurrent(monster) }}/{{ monster.endurance }}
            </span>
            <span
              v-if="enduranceCurrent(monster) <= monster.painResistance && enduranceCurrent(monster) > 0"
              class="text-[10px] font-semibold"
              style="color:#c84040"
            >⚠ seuil</span>
            <span
              v-if="enduranceCurrent(monster) === 0"
              class="text-[10px] font-semibold"
              style="color:#c84040"
            >✕ KO</span>
          </div>
        </div>

        <!-- Droite -->
        <div class="flex items-center gap-4">
          <!-- Stats preview -->
          <div class="grid grid-cols-3 gap-x-4 text-center">
            <div>
              <p class="text-[9px] uppercase tracking-wide text-sym-text3">ATT</p>
              <p class="text-sm font-semibold" style="color:#c84040">
                {{ store.allEffectiveStats.get(monster.id)?.playerModifiers.attackModifier ?? '—' }}
              </p>
            </div>
            <div>
              <p class="text-[9px] uppercase tracking-wide text-sym-text3">DÉF</p>
              <p class="text-sm font-semibold" style="color:#4a7ab5">
                {{ store.allEffectiveStats.get(monster.id)?.defense ?? '—' }}
              </p>
            </div>
            <div>
              <p class="text-[9px] uppercase tracking-wide text-sym-text3">END</p>
              <p class="text-sm font-semibold" style="color:#c87d2a">{{ monster.endurance }}</p>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex items-center gap-1" @click.stop>
            <button
              @click.stop="store.openEditForm(monster.id)"
              class="text-xs px-2 py-1 rounded border text-sym-text3 hover:text-sym-text2 transition-colors"
              style="border-color:#332d21; background:transparent;"
              @mouseenter="(e) => (e.currentTarget as HTMLElement).style.borderColor='#3d3628'"
              @mouseleave="(e) => (e.currentTarget as HTMLElement).style.borderColor='#332d21'"
            >Éditer</button>
            <button
              @click.stop="requestDelete($event, monster.id)"
              class="text-xs w-7 h-7 flex items-center justify-center rounded transition-colors"
              style="color:#7a3030; background:transparent;"
              @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.color='#c84040'; (e.currentTarget as HTMLElement).style.background='#1a0808' }"
              @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.color='#7a3030'; (e.currentTarget as HTMLElement).style.background='transparent' }"
            >✕</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
