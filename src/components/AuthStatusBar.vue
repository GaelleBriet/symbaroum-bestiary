<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="flex items-center gap-2.5">
    <span
      v-if="authStore.isOffline"
      class="text-xs px-2 py-1 rounded bg-sym-bg2 border border-sym-border2 text-sym-text3"
    >
      Mode hors ligne
    </span>
    <button
      type="button"
      title="Déconnexion"
      @click="authStore.logout()"
      class="text-sym-text3 hover:text-sym-text transition-colors"
    >
      <LogOut :size="16" />
    </button>
  </div>
</template>
