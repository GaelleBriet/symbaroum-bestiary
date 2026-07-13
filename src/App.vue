<script setup lang="ts">
import { onMounted } from 'vue'
import { useMonsterStore } from '@/stores/monsterStore'
import type { Monster } from '@/types/monster'
import MonsterList from '@/components/MonsterList.vue'
import MonsterDetail from '@/components/MonsterDetail.vue'
import MonsterForm from '@/components/MonsterForm.vue'

const store = useMonsterStore()
onMounted(() => store.loadAll())

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
  <div class="h-screen overflow-hidden bg-sym-bg font-sans">
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
