<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  try {
    await authStore.login(email.value, password.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-sym-bg px-4">
    <form
      @submit.prevent="handleSubmit"
      class="w-full max-w-sm bg-sym-bg1 border border-sym-border rounded-lg p-6 space-y-4"
    >
      <h1 class="font-cinzel text-lg font-semibold text-sym-text tracking-wide text-center">
        Bestiaire Symbaroum
      </h1>

      <div>
        <label class="block text-xs text-sym-text2 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          autocomplete="username"
          required
          class="w-full bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim"
        />
      </div>

      <div>
        <label class="block text-xs text-sym-text2 mb-1">Mot de passe</label>
        <input
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full bg-sym-bg2 border border-sym-border2 rounded px-3 py-2 text-sm text-sym-text placeholder-sym-text3 focus:outline-none focus:border-sym-adim"
        />
      </div>

      <p v-if="authStore.error" class="text-red-500 text-xs">{{ authStore.error }}</p>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-sym-amber hover:bg-sym-amber2 disabled:opacity-40 text-sym-text px-3 py-2 rounded text-sm font-medium transition-colors"
      >
        {{ isSubmitting ? 'Connexion…' : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>
