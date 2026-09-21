// src/data/stats.ts

import type { MonsterStats } from '@/types/monster'

/**
 * Libellés français des 8 attributs, source canonique.
 * Tableau ordonné de tuples : utilisé pour l'affichage ordonné (ex: v-for du formulaire).
 */
export const STAT_LABELS: [keyof MonsterStats, string][] = [
  ['accurate',   'Précision'],
  ['cunning',    'Astuce'],
  ['discreet',   'Discrétion'],
  ['persuasive', 'Persuasion'],
  ['quick',      'Agilité'],
  ['resolute',   'Volonté'],
  ['strong',     'Force'],
  ['vigilant',   'Vigilance'],
]

// Version indexée par clé, dérivée de STAT_LABELS : pratique pour une recherche
// ponctuelle (ex: libellé d'une stat de remplacement calculée dynamiquement).
export const STAT_LABELS_FR: Record<string, string> = Object.fromEntries(STAT_LABELS)
