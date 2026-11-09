<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import { parseManualValue, type CombatValue } from '@/logic/manualCombatValues'

const props = defineProps<{
  label: string
  combatValue: CombatValue
  color: string
}>()
const emit = defineEmits<{ save: [value: number | null] }>()

const editing = ref(false)
const draft = ref('')
const invalid = ref(false)
const input = useTemplateRef<HTMLInputElement>('input')

async function startEditing() {
  draft.value = String(props.combatValue.value)
  invalid.value = false
  editing.value = true
  await nextTick()
  input.value?.select()
}

function cancel() {
  editing.value = false
}

function confirm() {
  const value = parseManualValue(draft.value)
  if (value === null) {
    invalid.value = true
    return
  }
  emit('save', value)
  editing.value = false
}

function restoreComputed() {
  emit('save', null)
  editing.value = false
}
</script>

<template>
  <div>
    <p class="text-[9px] uppercase tracking-wide text-sym-text3 mb-1">{{ label }}</p>

    <form v-if="editing" class="flex flex-wrap items-center gap-1.5" @submit.prevent="confirm">
      <input
        ref="input"
        v-model="draft"
        type="text"
        inputmode="decimal"
        :aria-label="`${label} (valeur manuelle)`"
        class="w-20 rounded border px-2 py-1 font-cinzel font-bold text-xl bg-sym-bg text-sym-text"
        :style="`border-color:${invalid ? '#c84040' : '#3d3628'};`"
        @keydown.esc="cancel"
      />
      <button type="submit" class="text-xs px-2.5 py-1.5 rounded border text-sym-text2" style="border-color:#8b5520; background:#1f1508;">Enregistrer</button>
      <button type="button" class="text-xs px-2 py-1.5 rounded text-sym-text3" @click="cancel">Annuler</button>
      <p v-if="invalid" class="w-full text-[10px]" style="color:#c84040;">Entrer un nombre positif (ex. 7,5).</p>
    </form>

    <button
      v-else
      type="button"
      class="flex items-baseline gap-2 text-left"
      :title="`Modifier ${label.toLowerCase()}`"
      @click="startEditing"
    >
      <span class="font-cinzel font-bold text-2xl" :style="`color:${color};`">{{ combatValue.value }}</span>
      <span class="text-[11px] text-sym-text3">✎</span>
    </button>

    <p v-if="combatValue.isManual" class="text-[10px] mt-0.5" style="color:#c87d2a;">
      Valeur manuelle · calcul : {{ combatValue.computed }}
      <button type="button" class="underline text-sym-text3 ml-1" @click="restoreComputed">Rétablir le calcul</button>
    </p>
  </div>
</template>
