// src/data/resistance.ts

import type { Monster } from '@/types/monster'

/**
 * Valeurs possibles de résistance d'un monstre, dans l'ordre d'affichage
 * (filtre de la liste, sélecteur du formulaire de création/édition).
 */
export const RESISTANCE_OPTIONS: Monster['resistance'][] = [
  'Faible', 'Ordinaire', 'Éprouvante', 'Forte', 'Colossale',
]

// Styles visuels (couleur / bordure / fond) du badge de résistance,
// affiché dans la liste des monstres et sur la fiche détail.
export const RESISTANCE_STYLES: Record<string, { color: string; border: string; bg: string }> = {
  'Faible':    { color: '#6a9a4a', border: '#3a5a2a', bg: '#0a120a' },
  'Ordinaire': { color: '#b8a87a', border: '#3d3628', bg: '#1a1712' },
  'Éprouvante':{ color: '#c87d2a', border: '#8b5520', bg: '#1f1508' },
  'Forte':     { color: '#7ab5e8', border: '#2a4a6a', bg: '#080f18' },
  'Colossale': { color: '#c870c8', border: '#5a2a5a', bg: '#120a12' },
}

export function resistanceStyle(r: string) {
  return RESISTANCE_STYLES[r] ?? RESISTANCE_STYLES['Ordinaire']
}
