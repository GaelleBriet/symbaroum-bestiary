// src/data/traits.ts

/**
 * Traits optionnels qui modifient les statistiques.
 * Source : Livre de base Symbaroum, traits des races
 *
 * Traits sans modificateur (art de survie, contacts, paria, etc.)
 * ne sont pas inclus ici.
 */

import type { TalentOrTrait } from '../types/rules';

export const TRAITS: Record<string, TalentOrTrait> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Instinct de Survie
  // ─────────────────────────────────────────────────────────────────────────

  instinctSurvie: {
    id: 'instinct-survie',
    name: 'Instinct de Survie',
    description:
      'La force de vie vivace du personnage se manifeste par instinct de survie autrement utile.',
    type: 'trait',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: Grâce à son instinct de survie\n' +
            'vivace, le personnage peut effectuer une\n' +
            'Action de mouvement supplémentaire une\n' +
            'fois par scène.',
      },
      2: {
        activation: 'reactive',
        armorBonus: 1,
        customText:
          'Réactif: Le personnage se fie à son\n' +
            'instinct et a appris que, bien souvent, savoir\n' +
            'encaisser les coups peut sauver la vie.\n' +
            'L’instinct de survie accru du personnage lui\n' +
            'octroie +1D4 de protection en permanence.',
      },
      3: {
        activation: 'free',
        customText:
          'Gratuit: Les représentants de cette race ont\n' +
            'en eux un extraordinaire esprit de combativité\n' +
            'qui peut se manifester lorsque le personnage\n' +
            'est poussé dans ses derniers retranchements.\n' +
            'Le personnage a su cultiver et canaliser cette\n' +
            'colère, si bien qu’il peut sacrifier une Action de\n' +
            'mouvement une fois par scène afin d’effectuer\n' +
            'une Action de combat supplémentaire.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Vigoureux
  // ─────────────────────────────────────────────────────────────────────────

  vigoureux: {
    id: 'vigoureux',
    name: 'Vigoureux',
    description:
      'Le personnage appartient à une race de créatures naturellement grandes et imposantes.',
    type: 'trait',
    effects: {
      1: {
        activation: 'special',
        defenseModifier: -2,
        armorBonus: 0,
        customText:
          'Spéciale: Le personnage mesure presque 2\n' +
            'mètres de haut et possède une grande force.\n' +
            'Un corps aussi imposant devient plus facile à\n' +
            'toucher en combat, ce qui est compensé par une plus grande résistance naturelle. La Dé-fense du personnage est basée sur [Agilité -2]\n' +
            'et il ne peut utiliser que des armures légères,\n' +
            'qui doivent être fabriquées sur mesure et\n' +
            'coûtent, par conséquent, deux fois plus cher\n' +
            'qu’une armure normale. En retour, le person-\n' +
            'nage ignore 1D4 dégâts à chaque coup qui\n' +
            'le touche, en plus de la protection apportée\n' +
            'par l’armure qu’il porte. Par ailleurs, il peut\n' +
            'infliger 1D4 dégâts supplémentaires avec une\n' +
            'attaque au corps à corps à chaque tour.',
      },
      2: {
        activation: 'special',
        defenseModifier: -3,
        isReplacementFor: 1,
        customText:
          'Spéciale: Le personnage mesure plus de\n' +
            '2,5 mètres de haut, pèse environ 230 kg,\n' +
            'et sa peau est aussi épaisse qu’une écorce.\n' +
            'Une telle créature peut encaisser des coups\n' +
            'importants, mais est également plus facile à\n' +
            'toucher. La Défense du personnage est basée\n' +
            'sur [Agilité -3] et il ne peut utiliser que des ar-\n' +
            'mures légères, qui doivent être fabriquées sur\n' +
            'mesure et coûtent, par conséquent, trois fois\n' +
            'plus cher qu’une armure normale. En retour, le\n' +
            'personnage ignore 1D6 dégâts à chaque coup\n' +
            'qui le touche, en plus de la protection apportée\n' +
            'par l’armure qu’il porte. Par ailleurs, il peut\n' +
            'infliger 1D6 dégâts supplémentaires avec une\n' +
            'attaque au corps à corps à chaque tour.',
      },
      3: {
        activation: 'special',
        defenseModifier: -4,
        isReplacementFor: 2,
        customText:
          'Spéciale: Le personnage mesure presque 3\n' +
            'mètres de haut, pèse environ une demi-tonne\n' +
            'et écrase littéralement les créatures plus pe-\n' +
            'tites tandis que les armes ennemies peinent à\n' +
            'pénétrer sa peau de pierre. Il est très facile de\n' +
            'toucher une créature de cette taille, mais très\n' +
            'difficile de la blesser grièvement. La Défense\n' +
            'du personnage est basée sur [Agilité -4] et\n' +
            'il ne peut utiliser que des armures légères,\n' +
            'qui doivent être fabriquées sur mesure et\n' +
            'coûtent, par conséquent, quatre fois plus\n' +
            'cher qu’une armure normale. En retour, le\n' +
            'personnage ignore 1D8 dégâts à chaque coup\n' +
            'qui le touche en plus de la protection appor-\n' +
            'tée par l’armure qu’il porte. Par ailleurs, il peut\n' +
            'infliger 1D8 dégâts supplémentaires avec une\n' +
            'attaque au corps à corps à chaque tour.',
      },
    },
  },
};
