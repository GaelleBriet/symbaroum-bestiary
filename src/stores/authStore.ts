// src/stores/authStore.ts
// Auth minimaliste — un seul compte (Paul), créé manuellement dans Supabase

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const isReady = ref(false)
  const isOffline = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!session.value)
  const userId = computed(() => session.value?.user.id ?? null)

  async function init() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
    })

    isReady.value = true
  }

  async function login(email: string, password: string): Promise<boolean> {
    error.value = null
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      error.value = signInError.message
      return false
    }

    session.value = data.session
    return true
  }

  async function logout() {
    await supabase.auth.signOut()
    session.value = null
  }

  return {
    session,
    isReady,
    isOffline,
    error,
    isAuthenticated,
    userId,
    init,
    login,
    logout,
  }
})
