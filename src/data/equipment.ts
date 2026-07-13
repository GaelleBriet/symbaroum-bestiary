// src/data/equipment.ts

/**
 * Données officielles des armes et armures de Symbaroum.
 * Source : Livre de base Symbaroum
 *
 * Les armes et armures référencent des qualités (qualityIds)
 * qui sont définies dans src/data/qualities.ts
 * Les qualités contiennent les modificateurs mécaniques.
 */

import type { Weapon, Armor } from '../types/rules';

// ============================================================================
// ARMES
// ============================================================================

export const WEAPONS: Record<string, Weapon> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Armes longues (1D8, qualité Long)
  // ─────────────────────────────────────────────────────────────────────────

  hallebarde: {
    id: 'hallebarde',
    name: 'Hallebarde (hache d’armes)',
    damage: { count: 1, sides: 8 },
    qualityIds: ['long', 'eventreur'],
  },

  pique: {
    id: 'pique',
    name: 'Pique',
    damage: { count: 1, sides: 8 },
    qualityIds: ['long', 'precis'],
  },

  batonDeCombat: {
    id: 'baton-de-combat',
    name: 'Bâton de combat',
    damage: { count: 1, sides: 6 }, // Contondant réduit le dé
    qualityIds: ['long', 'contondant'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armes lourdes (1D10, à deux mains)
  // ─────────────────────────────────────────────────────────────────────────

  epeeBatarde: {
    id: 'epee-batarde',
    name: 'Épée bâtarde',
    damage: { count: 1, sides: 10 },
    qualityIds: ['precis'],
  },

  fleauArmeLourd: {
    id: 'fleau-arme-lourd',
    name: 'Fléau d\'armes lourd',
    damage: { count: 1, sides: 10 },
    qualityIds: ['flexible'],
  },

  hacheDouble: {
    id: 'hache-double',
    name: 'Hache double',
    damage: { count: 1, sides: 10 },
    qualityIds: ['eventreur'],
  },

  epeeADeuxMains: {
    id: 'epee-a-deux-mains',
    name: 'Épée à deux mains',
    damage: { count: 1, sides: 10 },
    qualityIds: [],
  },

  hachedArmes: {
    id: 'hache-d-armes',
    name: 'Hache d\'armes',
    damage: { count: 1, sides: 10 },
    qualityIds: [],
  },

  marteauDeGuerre: {
    id: 'marteau-de-guerre',
    name: 'Marteau de guerre',
    damage: { count: 1, sides: 10 },
    qualityIds: [],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armes à une main (1D8)
  // ─────────────────────────────────────────────────────────────────────────

  becDeCorbin: {
    id: 'bec-de-corbin',
    name: 'Bec-de-corbin',
    damage: { count: 1, sides: 8 },
    qualityIds: ['eventreur'],
  },

  fleauArmes: {
    id: 'fleau-armes',
    name: 'Fléau d\'armes',
    damage: { count: 1, sides: 8 },
    qualityIds: ['flexible'],
  },

  fleuret: {
    id: 'fleuret',
    name: 'Fleuret',
    damage: { count: 1, sides: 8 },
    qualityIds: ['precis'],
  },

  hache: {
    id: 'hache',
    name: 'Hache',
    damage: { count: 1, sides: 8 },
    qualityIds: [],
  },

  sabre: {
    id: 'sabre',
    name: 'Sabre',
    damage: { count: 1, sides: 8 },
    qualityIds: [],
  },

  epee: {
    id: 'epee',
    name: 'Épée',
    damage: { count: 1, sides: 8 },
    qualityIds: [],
  },

  marteauDeCombat: {
    id: 'marteau-de-combat',
    name: 'Marteau de combat',
    damage: { count: 1, sides: 8 },
    qualityIds: [],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armes courtes (1D6, qualité Courte)
  // ─────────────────────────────────────────────────────────────────────────

  dagueDeParade: {
    id: 'dague-de-parade',
    name: 'Dague de parade',
    damage: { count: 1, sides: 6 },
    qualityIds: ['court', 'equilibre'],
  },

  stylet: {
    id: 'stylet',
    name: 'Stylet',
    damage: { count: 1, sides: 6 },
    qualityIds: ['court', 'eventreur'],
  },

  dague: {
    id: 'dague',
    name: 'Dague',
    damage: { count: 1, sides: 6 },
    qualityIds: ['court'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armes de jet (1D6)
  // ─────────────────────────────────────────────────────────────────────────

  lanceEpieu: {
    id: 'lance-epieu',
    name: 'Lance-épieu',
    damage: { count: 1, sides: 6 },
    qualityIds: ['eventreur'],
  },

  couteauDeLancer: {
    id: 'couteau-de-lancer',
    name: 'Couteau de lancer',
    damage: { count: 1, sides: 6 },
    qualityIds: [],
  },

  hachedeLancer: {
    id: 'hache-de-lancer',
    name: 'Hache de lancer',
    damage: { count: 1, sides: 6 },
    qualityIds: [],
  },

  javelot: {
    id: 'javelot',
    name: 'Javelot',
    damage: { count: 1, sides: 6 },
    qualityIds: [],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armes de trait (à distance)
  // ─────────────────────────────────────────────────────────────────────────

  arbaletheLourd: {
    id: 'arbalete-lourd',
    name: 'Arbalète lourde',
    damage: { count: 1, sides: 10 },
    qualityIds: ['eventreur'],
  },

  arcLong: {
    id: 'arc-long',
    name: 'Arc long',
    damage: { count: 1, sides: 8 },
    qualityIds: ['precis'],
  },

  fronde: {
    id: 'fronde',
    name: 'Fronde',
    damage: { count: 1, sides: 6 },
    qualityIds: [],
  },

  arbalete: {
    id: 'arbalete',
    name: 'Arbalète',
    damage: { count: 1, sides: 8 },
    qualityIds: [],
  },

  arc: {
    id: 'arc',
    name: 'Arc',
    damage: { count: 1, sides: 6 },
    qualityIds: [],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Attaque sans armes
  // ─────────────────────────────────────────────────────────────────────────

  griffeDecombat: {
    id: 'griffe-de-combat',
    name: 'Griffe de combat',
    damage: { count: 1, sides: 4 },
    qualityIds: ['court', 'eventreur'],
  },

  poing: {
    id: 'poing',
    name: 'Poing',
    damage: { count: 1, sides: 4 },
    qualityIds: ['court'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Boucliers (donnent +1 Défense via qualité Équilibré ou Pratique)
  // ─────────────────────────────────────────────────────────────────────────

  bouclierRond: {
    id: 'bouclier-rond',
    name: 'Bouclier rond',
    damage: { count: 0, sides: 0 },
    qualityIds: ['equilibre'],
  },

  bouclierEnAcier: {
    id: 'bouclier-en-acier',
    name: 'Bouclier en acier',
    damage: { count: 0, sides: 0 },
    qualityIds: ['equilibre'],
  },
};

// ============================================================================
// ARMURES
// ============================================================================

export const ARMORS: Record<string, Armor> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Armures légères (1D4, protection légère)
  // ─────────────────────────────────────────────────────────────────────────

  aubeBenie: {
    id: 'aube-benie',
    name: 'Aube bénie',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: ['pratique'],
    quality:
      'Légère - Les aubes de prêtre portées par les théurges sont bénies',
  },

  capeDeLOrdre: {
    id: 'cape-de-l-ordre',
    name: 'Cape de l\'Ordre',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: [],
    quality:
      'Légère - Cape de protection brodée de runes par l\'Ordo Magica',
  },

  peauDeLoup: {
    id: 'peau-de-loup',
    name: 'Peau de loup',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: ['encombrant'],
    quality: 'Légère - Encombrante (-3) - Peaux de bêtes tannées rudimentairement',
  },

  robeDeSorciere: {
    id: 'robe-de-sorciere',
    name: 'Robe de sorcière',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: [],
    quality:
      'Légère - Vêtements liés à des esprits protecteurs par des sorcières',
  },

  soieTissee: {
    id: 'soie-tissee',
    name: 'Soie tissée',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: ['pratique'],
    quality:
      'Légère - Pratique - Meilleure armure légère disponible, mailles serrées',
  },

  brogne: {
    id: 'brogne',
    name: 'Brogne',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: [],
    quality: 'Légère - Armure simple de linge clouté',
  },

  cuirBouilli: {
    id: 'cuir-bouilli',
    name: 'Cuir bouilli',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: [],
    quality: 'Légère - Cuir durci par la chaleur',
  },

  cuirCloute: {
    id: 'cuir-cloute',
    name: 'Cuir clouté',
    protection: { count: 1, sides: 4 },
    category: 'light',
    qualityIds: [],
    quality: 'Légère - Cuir renforcé de clous de métal',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armures moyennes (1D6, protection moyenne)
  // ─────────────────────────────────────────────────────────────────────────

  armureDuCorbeau: {
    id: 'armure-du-corbeau',
    name: 'Armure du corbeau',
    protection: { count: 1, sides: 6 },
    category: 'medium',
    qualityIds: ['encombrant'],
    quality:
      'Moyenne - Encombrante (-4) - Pièces de fortune assemblées par les guerriers pauvres',
  },

  cuirasseEnSoieLaquee: {
    id: 'cuirasse-en-soie-laquee',
    name: 'Cuirasse en soie laquée',
    protection: { count: 1, sides: 6 },
    category: 'medium',
    qualityIds: ['pratique'],
    quality:
      'Moyenne - Pratique - Soie laquée transmise par les elfes du Pacte de Fer',
  },

  armeeDEcailles: {
    id: 'armee-d-ecailles',
    name: 'Armure d\'écailles',
    protection: { count: 1, sides: 6 },
    category: 'medium',
    qualityIds: [],
    quality: 'Moyenne - Écailles chevauchées cousues sur une base de cuir',
  },

  cotteDeMailles: {
    id: 'cotte-de-mailles',
    name: 'Cotte de mailles',
    protection: { count: 1, sides: 6 },
    category: 'medium',
    qualityIds: [],
    quality: 'Moyenne - Anneaux de métal entrecroisés',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armures lourdes (1D8, protection lourde)
  // ─────────────────────────────────────────────────────────────────────────

  armureDeProtectionComplete: {
    id: 'armure-de-plaques-complete',
    name: 'Armure de plaques complète',
    protection: { count: 1, sides: 8 },
    category: 'heavy',
    qualityIds: ['pratique'],
    quality:
      'Lourde - Pratique - Forgée sur mesure pour les chevaliers, meilleure protection possible',
  },

  cotteDeMaillesRenforce: {
    id: 'cotte-de-mailles-renforcee',
    name: 'Cotte de mailles renforcée',
    protection: { count: 1, sides: 8 },
    category: 'heavy',
    qualityIds: [],
    quality:
      'Lourde - Cotte de mailles renforcée de plaques aux épaules, genoux et coudes',
  },
};

// ============================================================================
// EXPORTS & HELPERS
// ============================================================================

/**
 * Récupère une arme par ID
 */
export function getWeapon(id: string): Weapon | undefined {
  return WEAPONS[id];
}

/**
 * Récupère une armure par ID
 */
export function getArmor(id: string): Armor | undefined {
  return ARMORS[id];
}

/**
 * Récupère toutes les armes avec un dé de dégâts spécifique
 */
export function getWeaponsByDamage(damageSides: number): Weapon[] {
  return Object.values(WEAPONS).filter((w) => w.damage.sides === damageSides);
}

/**
 * Récupère toutes les armures avec une protection spécifique
 */
export function getArmorsByProtection(protectionSides: number): Armor[] {
  return Object.values(ARMORS).filter((a) => a.protection.sides === protectionSides);
}

/**
 * Récupère toutes les armures d'une catégorie
 */
export function getArmorsByCategory(
  category: 'light' | 'medium' | 'heavy'
): Armor[] {
  return Object.values(ARMORS).filter((a) => a.category === category);
}

/**
 * Vérifie si une arme a une qualité spécifique
 */
export function weaponHasQuality(weapon: Weapon, qualityId: string): boolean {
  return weapon.qualityIds?.includes(qualityId) ?? false;
}

/**
 * Vérifie si une armure a une qualité spécifique
 */
export function armorHasQuality(armor: Armor, qualityId: string): boolean {
  return armor.qualityIds?.includes(qualityId) ?? false;
}

/**
 * Récupère toutes les qualités d'une arme (IDs)
 */
export function getWeaponQualityIds(weapon: Weapon): string[] {
  return weapon.qualityIds ?? [];
}

/**
 * Récupère toutes les qualités d'une armure (IDs)
 */
export function getArmorQualityIds(armor: Armor): string[] {
  return armor.qualityIds ?? [];
}

/**
 * Liste tous les IDs d'armes
 */
export function listAllWeaponIds(): string[] {
  return Object.keys(WEAPONS);
}

/**
 * Liste tous les IDs d'armures
 */
export function listAllArmorIds(): string[] {
  return Object.keys(ARMORS);
}

/**
 * Export combiné pour faciliter les imports
 */
export const equipment = {
  weapons: WEAPONS,
  armors: ARMORS,
};
