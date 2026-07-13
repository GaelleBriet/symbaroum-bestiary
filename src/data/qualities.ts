// src/data/qualities.ts

import type { Quality } from '../types/rules'

export const QUALITIES: Record<string, Quality> = {
  precis: {
    id: 'precis',
    name: 'Précis',
    description: 'Arme précise qui facilite les attaques.',
    type: 'weapon',
    effects: { attackBonus: 1 },
  },
  eventreur: {
    id: 'eventreur',
    name: 'Éventreur',
    description: 'Arme qui inflige des blessures plus profondes.',
    type: 'weapon',
    effects: { damageBonus: 1 },
  },
  equilibre: {
    id: 'equilibre',
    name: 'Équilibré',
    description: 'Arme ou bouclier qui améliore la défense.',
    type: 'weapon',
    effects: { defenseBonus: 1 },
  },
  long: {
    id: 'long',
    name: 'Long',
    description: 'Arme longue permettant de garder l\'ennemi à distance.',
    type: 'weapon',
    effects: { isLong: true },
  },
  court: {
    id: 'court',
    name: 'Court',
    description: 'Arme courte facile à manier en espace réduit.',
    type: 'weapon',
    effects: { isShort: true },
  },
  flexible: {
    id: 'flexible',
    name: 'Flexible',
    description: 'Arme flexible qui contourne les boucliers.',
    type: 'weapon',
    effects: { isFlexible: true },
  },
  contondant: {
    id: 'contondant',
    name: 'Contondant',
    description: 'Arme contondante qui assomme plutôt que de trancher.',
    type: 'weapon',
    effects: { isBlunt: true },
  },
  pratique: {
    id: 'pratique',
    name: 'Pratique',
    description: 'Équipement pratique sans malus de défense.',
    type: 'armor',
    effects: { isPractical: true },
  },
  encombrant: {
    id: 'encombrant',
    name: 'Encombrant',
    description: 'Armure encombrante qui réduit la défense selon sa catégorie.',
    type: 'armor',
    effects: {},
    categorySpecificPenalty: { light: -3, medium: -4, heavy: -5 },
  },
  genante: {
    id: 'genante',
    name: 'Gênante',
    description: 'Armure gênante qui réduit légèrement la défense selon sa catégorie.',
    type: 'armor',
    effects: {},
    categorySpecificPenalty: { light: -2, medium: -3, heavy: -4 },
  },
}

export function getQuality(id: string): Quality | undefined {
  return QUALITIES[id]
}
