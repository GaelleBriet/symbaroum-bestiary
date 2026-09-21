// src/types/monster.ts

// Les 8 attributs bruts
export interface MonsterStats {
  accurate: number;
  cunning: number;
  discreet: number;
  persuasive: number;
  quick: number;
  resolute: number;
  strong: number;
  vigilant: number;
}

// Modificateurs appliqués aux stats brutes (+3, -1, etc.)
export interface MonsterStatModifiers {
  accurate: number;
  cunning: number;
  discreet: number;
  persuasive: number;
  quick: number;
  resolute: number;
  strong: number;
  vigilant: number;
}

// Talent ou trait sélectionné sur un monstre
export interface SelectedReference {
  id: string;
  level: 1 | 2 | 3;
  parameters?: Record<string, string>; // { capacity: "Malédiction" }
}

// Arme portée par un monstre
export interface MonsterWeapon {
  id: string;
  name?: string;
  damage: number;
  qualityIds?: string[];
  notes?: string;
}

// Armure portée par un monstre
export interface MonsterArmor {
  id: string;
  name?: string;
  protection: number;
  qualityIds?: string[];
  notes?: string;
}

// Équipement global
export interface MonsterEquipment {
  weapons?: MonsterWeapon[];
  armor?: MonsterArmor;
  shield?: boolean;
  other?: string[];
}

// Ombre/aura mystique
export interface MonsterShadow {
  description: string;
  corruption: number;
}

export interface Monster {
  // Identification
  id: string;
  name: string;
  race: string;
  description?: string;
  isCustom: boolean;

  // Stats brutes (valeurs du livre / créées par le MJ)
  baseStats: MonsterStats;

  // Modificateurs fixes additionnels (hors talents/traits)
  statModifiers: MonsterStatModifiers;

  // Physique & défense
  resistance: 'Faible' | 'Ordinaire' | 'Éprouvante' | 'Forte' | 'Colossale';
  endurance: number;
  painResistance: number;

  shadow: MonsterShadow;

  // Capacités
  talents: SelectedReference[];
  traits: SelectedReference[];

  // Équipement
  equipment: MonsterEquipment;

  // Roleplay
  tactics?: string;
  notes?: string;

  // Métadonnées
  createdAt: number;
  updatedAt?: number;
}
