// src/types/rules.ts

/**
 * Types pour les talents, traits, et équipement.
 * Décrit la STRUCTURE DES RÈGLES officielles de Symbaroum.
 * Les instances réelles sont dans src/data/
 */

export type ActivationType = 'passive' | 'free' | 'reactive' | 'active' | 'special';

export type StatKey =
  | 'accurate'
  | 'cunning'
  | 'discreet'
  | 'persuasive'
  | 'quick'
  | 'resolute'
  | 'strong'
  | 'vigilant';

/**
 * Un talent ou trait modifie les stats effectives selon son niveau.
 * Ex: Trait "Vigoureux" I → Défense = Agilité - 2
 */
export interface TalentEffect {
  // Type d'activation : détermine si l'effet est automatique (passive/special) ou optionnel (free/active/reactive)
  activation: ActivationType;

  // Rang que ce rang remplace — ex: Berserker rang 3 remplace rang 1 (isReplacementFor: 1)
  isReplacementFor?: number;

  // Modificateurs directs sur les stats brutes
  statModifiers?: Partial<Record<StatKey, number>>;

  // Bonus d'armure (protection supplémentaire)
  armorBonus?: number;

  // Modificateur appliqué à la Défense calculée (ex: -2)
  defenseModifier?: number;

  // Bonus fixe aux dégâts
  damageBonus?: number;

  // Bonus en dés aux dégâts (ex: "1d4", "1d6")
  damageDice?: string;

  // Remplacement de stat : ex Poigne de Fer → utilise Force pour attaque CAC
  replaceStat?: {
    sourceAction: string; // "meleeAttack" | "defense" | "rangedAttack" | "initiative" | ...
    useStat: StatKey;
  };

  // Effets textuels complexes (affichage MJ, implémentation future)
  customText?: string;

  healingDice?: string; // ex: "1d6" pour soins
}

/**
 * Interface commune pour Talent et Trait.
 * Les effets varient selon le niveau (1=Novice, 2=Adepte, 3=Maître).
 */
export interface TalentOrTrait {
  id: string;
  name: string;
  description: string;
  type: 'talent' | 'trait';
  effects: {
    1: TalentEffect;
    2: TalentEffect;
    3: TalentEffect;
  };
}

/**
 * Format structuré des dés de dégâts/armure.
 */
export interface DamageDice {
  count: number;  // Nombre de dés (ex: 1)
  sides: number;  // Faces (ex: 8 pour 1d8)
  bonus?: number; // Bonus fixe optionnel (ex: +2)
}

/**
 * Une arme équipée par un monstre.
 */
export interface Weapon {
  id: string;
  name: string;
  damage: DamageDice;
  qualityIds?: string[];
  qualities?: Quality[];
}

/**
 * Une armure équipée par un monstre.
 */
export interface Armor {
  id: string;
  name: string;
  protection: DamageDice;
  quality?: string;
  qualityIds?: string[];
  qualities?: Quality[];
  category: 'light' | 'medium' | 'heavy';
}

/**
 * Une qualité modifie les performances d'une arme ou armure.
 */
export interface Quality {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor';

  effects: {
    defenseBonus?: number;
    attackBonus?: number;
    damageBonus?: number;
    defensePenalty?: number;
    isFlexible?: boolean;
    isLong?: boolean;
    isShort?: boolean;
    isBlunt?: boolean;
    isPractical?: boolean;
    customText?: string;
  };

  // Pour les armures : le malus varie selon la catégorie
  // Encombrant: légère -3, moyenne -4, lourde -5
  categorySpecificPenalty?: {
    light: number;
    medium: number;
    heavy: number;
  };
}
