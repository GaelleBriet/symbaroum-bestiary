<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMonsterStore } from '@/stores/monsterStore'
import { useAuthStore } from '@/stores/authStore'
import type { Monster } from '@/types/monster'
import MonsterList from '@/components/MonsterList.vue'
import MonsterDetail from '@/components/MonsterDetail.vue'
import MonsterForm from '@/components/MonsterForm.vue'
import LoginForm from '@/components/LoginForm.vue'

const store = useMonsterStore()
const authStore = useAuthStore()

async function bootstrapData() {
  if (authStore.isDemo) {
    await store.seedDemoIfEmpty()
  } else if (authStore.userId) {
    try {
      await store.hydrateFromCloud(authStore.userId)
      authStore.isOffline = false
    } catch (err) {
      console.error(err)
      authStore.isOffline = true
    }
  }
  await store.loadAll()
}

onMounted(async () => {
  await authStore.init()
  if (authStore.isAuthenticated || authStore.isDemo) {
    await bootstrapData()
  }
})

watch(
  () => authStore.isAuthenticated,
  async (isAuthenticated) => {
    if (isAuthenticated) {
      await bootstrapData()
    }
  },
)

async function handleSave(data: Omit<Monster, 'id' | 'createdAt'>) {
  if (store.formMode === 'create') {
    const monster = await store.addMonster(data)
    store.openDetail(monster.id)
  } else {
    await store.updateMonster(store.selectedMonsterId!, data)
  }
  store.closeForm()
}
</script>

<template>
  <div v-if="!authStore.isReady" class="h-screen flex items-center justify-center bg-sym-bg text-sym-text3">
    Chargement…
  </div>

  <LoginForm v-else-if="!authStore.isAuthenticated && !authStore.isDemo" />

  <div v-else class="h-screen overflow-hidden bg-sym-bg font-sans">
    <MonsterList v-if="store.currentView === 'list'" />
    <MonsterDetail v-else-if="store.currentView === 'detail' && store.selectedMonster" />

    <MonsterForm
      v-if="store.isFormOpen"
      :mode="store.formMode"
      :initial-data="store.formMode === 'edit' ? store.selectedMonster ?? undefined : undefined"
      @save="handleSave"
      @cancel="store.closeForm()"
    />
  </div>
</template>
