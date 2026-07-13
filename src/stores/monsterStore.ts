// src/stores/monsterStore.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/database/db'
import type { Monster } from '@/types/monster'
import { calculateEffectiveStats, type EffectiveStats } from '@/logic/mechanics'
import {
  createMonster as dbCreate,
  updateMonster as dbUpdate,
  deleteMonster as dbDelete,
} from '@/logic/database'
import {
  fetchCustomMonsters,
  upsertMonsterRemote,
  deleteMonsterRemote,
} from '@/logic/supabaseSync'
import { useAuthStore } from '@/stores/authStore'

export const useMonsterStore = defineStore('monsters', () => {
  // ─── État ────────────────────────────────────────────────────────────────
  const monsters = ref<Monster[]>([])
  const selectedMonsterId = ref<string | null>(null)
  const isLoading = ref(false)

  // ─── Navigation (list | detail) ──────────────────────────────────────────
  const currentView = ref<'list' | 'detail'>('list')

  function openDetail(id: string) {
    selectedMonsterId.value = id
    currentView.value = 'detail'
  }

  function backToList() {
    currentView.value = 'list'
  }

  // ─── Tracker d'endurance live (session, non persisté) ────────────────────
  const enduranceCurrent = ref(new Map<string, number>())

  function getEnduranceCurrent(monsterId: string): number {
    const monster = monsters.value.find(m => m.id === monsterId)
    if (!monster) return 0
    return enduranceCurrent.value.get(monsterId) ?? monster.endurance
  }

  function setEnduranceCurrent(monsterId: string, value: number) {
    const monster = monsters.value.find(m => m.id === monsterId)
    if (!monster) return
    enduranceCurrent.value = new Map(enduranceCurrent.value).set(
      monsterId,
      Math.max(0, Math.min(value, monster.endurance)),
    )
  }

  function inflictDamage(monsterId: string, amount: number) {
    setEnduranceCurrent(monsterId, getEnduranceCurrent(monsterId) - amount)
  }

  function resetEndurance(monsterId: string) {
    const monster = monsters.value.find(m => m.id === monsterId)
    if (!monster) return
    enduranceCurrent.value = new Map(enduranceCurrent.value).set(monsterId, monster.endurance)
  }

  // ─── État formulaire ─────────────────────────────────────────────────────
  const isFormOpen = ref(false)
  const formMode = ref<'create' | 'edit'>('create')

  // ─── Sélection courante ───────────────────────────────────────────────────
  const selectedMonster = computed(() =>
    monsters.value.find((m) => m.id === selectedMonsterId.value) ?? null
  )

  const selectedMonsterStats = computed<EffectiveStats | null>(() => {
    if (!selectedMonster.value) return null
    return calculateEffectiveStats(selectedMonster.value)
  })

  const allEffectiveStats = computed<Map<string, EffectiveStats>>(() => {
    const map = new Map<string, EffectiveStats>()
    for (const monster of monsters.value) {
      map.set(monster.id, calculateEffectiveStats(monster))
    }
    return map
  })

  // ─── Chargement depuis IndexedDB ─────────────────────────────────────────
  async function loadAll() {
    isLoading.value = true
    try {
      monsters.value = await db.monsters.orderBy('createdAt').toArray()
    } finally {
      isLoading.value = false
    }
  }

  // ─── Hydratation depuis Supabase (cache Dexie ← cloud) ───────────────────
  async function hydrateFromCloud(userId: string) {
    const remoteMonsters = await fetchCustomMonsters(userId)
    if (remoteMonsters.length > 0) {
      await db.monsters.bulkPut(remoteMonsters)
    }
  }

  // ─── CRUD (via database.ts) ───────────────────────────────────────────────
  async function addMonster(data: Omit<Monster, 'id' | 'createdAt'>): Promise<Monster> {
    const id = await dbCreate(data)
    const monster = await db.monsters.get(id) as Monster
    monsters.value.push(monster)

    if (monster.isCustom) {
      const authStore = useAuthStore()
      if (authStore.userId) {
        upsertMonsterRemote(monster, authStore.userId).catch(console.error)
      }
    }

    return monster
  }

  async function updateMonster(id: string, changes: Partial<Monster>): Promise<void> {
    await dbUpdate(id, changes)
    const idx = monsters.value.findIndex((m) => m.id === id)
    if (idx !== -1) {
      monsters.value[idx] = { ...monsters.value[idx], ...changes, updatedAt: Date.now() }

      if (monsters.value[idx].isCustom) {
        const authStore = useAuthStore()
        if (authStore.userId) {
          upsertMonsterRemote(monsters.value[idx], authStore.userId).catch(console.error)
        }
      }
    }
  }

  async function deleteMonster(id: string): Promise<void> {
    const monster = monsters.value.find((m) => m.id === id)
    await dbDelete(id)
    monsters.value = monsters.value.filter((m) => m.id !== id)
    if (selectedMonsterId.value === id) {
      selectedMonsterId.value = null
      currentView.value = 'list'
    }

    if (monster?.isCustom) {
      deleteMonsterRemote(id).catch(console.error)
    }
  }

  function selectMonster(id: string | null) {
    selectedMonsterId.value = id
  }

  // ─── Actions formulaire ───────────────────────────────────────────────────
  function openCreateForm() {
    selectedMonsterId.value = null
    formMode.value = 'create'
    isFormOpen.value = true
  }

  function openEditForm(id: string) {
    selectedMonsterId.value = id
    formMode.value = 'edit'
    isFormOpen.value = true
  }

  function closeForm() {
    isFormOpen.value = false
  }

  return {
    // État
    monsters,
    selectedMonsterId,
    isLoading,
    isFormOpen,
    formMode,
    currentView,
    // Calculés
    selectedMonster,
    selectedMonsterStats,
    allEffectiveStats,
    // Navigation
    openDetail,
    backToList,
    // Endurance tracker
    getEnduranceCurrent,
    setEnduranceCurrent,
    inflictDamage,
    resetEndurance,
    // Actions
    loadAll,
    hydrateFromCloud,
    addMonster,
    updateMonster,
    deleteMonster,
    selectMonster,
    openCreateForm,
    openEditForm,
    closeForm,
  }
})
