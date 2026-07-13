// src/data/qualities.ts

/**
 * Toutes les qualités officielles de Symbaroum.
 * Source : Livre de base Symbaroum, section "Qualités"
 */

import type { Quality } from '../types/rules';

export const QUALITIES: Record<string, Quality> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Qualités d'ARME
  // ─────────────────────────────────────────────────────────────────────────

  equilibre: {
    id: 'equilibre',
    name: 'Équilibré',
    description:
      'L\'arme est si bien équilibrée qu\'elle est extrêmement efficace en parade.',
    type: 'weapon',
    effects: {
      defenseBonus: 1,
    },
  },

  eventreur: {
    id: 'eventreur',
    name: 'Éventreur',
    description:
      'L\'arme possède des caractéristiques qui la rendent encore plus mortelle.',
    type: 'weapon',
    effects: {
      damageBonus: 1,
    },
  },

  flexible: {
    id: 'flexible',
    name: 'Flexible',
    description:
      'L\'arme est flexible et peut frapper au-delà d\'un bouclier ennemi. Touche même si parade réussie avec résultat impair.',
    type: 'weapon',
    effects: {
      isFlexible: true,
      customText: 'Inflige 1D6 si la parade est réussie mais le dé est impair',
    },
  },

  long: {
    id: 'long',
    name: 'Long',
    description:
      'L\'arme a l\'avantage d\'être plus longue et d\'avoir une meilleure portée.',
    type: 'weapon',
    effects: {
      isLong: true,
      customText: 'Attaque gratuite contre un nouvel adversaire sans arme longue',
    },
  },

  court: {
    id: 'court',
    name: 'Court',
    description:
      'L\'arme est facile à ranger et peut être dégainée sur une Action gratuite.',
    type: 'weapon',
    effects: {
      isShort: true,
      customText: 'Dégainé gratuit, utilisable avec Feinte et Coup en traître',
    },
  },

  contondant: {
    id: 'contondant',
    name: 'Contondant',
    description:
      'L\'arme manque d\'efficacité pour trancher ou percer. Elle utilise un dé inférieur.',
    type: 'weapon',
    effects: {
      isBlunt: true,
      customText: 'Réduit les dés de 1 cran (1D8 -> 1D6, 1D6 -> 1D4)',
    },
  },

  precis: {
    id: 'precis',
    name: 'Précis',
    description:
      'L\'arme est conçue pour être facile à manier et toucher facilement sa cible.',
    type: 'weapon',
    effects: {
      attackBonus: 1,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Qualités d'ARMURE
  // ─────────────────────────────────────────────────────────────────────────

  encombrant: {
    id: 'encombrant',
    name: 'Encombrant',
    description:
      'Il est difficile de se mouvoir dans cette armure. La Défense subit un malus.',
    type: 'armor',
    effects: {
      defensePenalty: -1, // -1 point de base
    },
    categorySpecificPenalty: {
      light: -3,   // Armure légère encombrante
      medium: -4,  // Armure moyenne encombrante
      heavy: -5,   // Armure lourde encombrante
    },
  },

  genante: {
    id: 'genante',
    name: 'Gênant',
    description:
      'L\'armure ralentit les mouvements d\'agilité et inflige un malus à la Défense, Discrétion et Pouvoirs mystiques.',
    type: 'armor',
    effects: {
      defensePenalty: -1, // Variable selon catégorie
      customText: 'Malus sur Défense, Discrétion et Pouvoirs mystiques',
    },
    categorySpecificPenalty: {
      light: -2,   // Armure légère gênante
      medium: -3,  // Armure moyenne gênante
      heavy: -4,   // Armure lourde gênante
    },
  },

  pratique: {
    id: 'pratique',
    name: 'Pratique',
    description:
      'L\'armure est étonnamment pratique et bien moins gênante que sa protection ne le laisse supposer.',
    type: 'armor',
    effects: {
      isPractical: true,
      customText:
        'Réduit les malus Gênants: légère 0, moyenne -1, lourde -2',
    },
  },
};

/**
 * Helper pour récupérer une qualité par ID
 */
export function getQuality(id: string): Quality | undefined {
  return QUALITIES[id];
}

/**
 * Helper pour récupérer les qualités d'arme
 */
export function getWeaponQualities(): Quality[] {
  return Object.values(QUALITIES).filter((q) => q.type === 'weapon');
}

/**
 * Helper pour récupérer les qualités d'armure
 */
export function getArmorQualities(): Quality[] {
  return Object.values(QUALITIES).filter((q) => q.type === 'armor');
}

/**
 * Helper pour appliquer les modificateurs d'une qualité
 */
export function applyQualityEffects(
  quality: Quality,
  baseValue: number,
  armorCategory?: 'light' | 'medium' | 'heavy'
): number {
  let result = baseValue;

  if (quality.effects.defensePenalty && armorCategory) {
    // Utiliser la pénalité spécifique à la catégorie
    if (quality.categorySpecificPenalty) {
      result += quality.categorySpecificPenalty[armorCategory];
    } else {
      result += quality.effects.defensePenalty;
    }
  }

  if (quality.effects.defenseBonus) {
    result += quality.effects.defenseBonus;
  }

  if (quality.effects.damageBonus) {
    result += quality.effects.damageBonus;
  }

  if (quality.effects.attackBonus) {
    result += quality.effects.attackBonus;
  }

  return result;
}
