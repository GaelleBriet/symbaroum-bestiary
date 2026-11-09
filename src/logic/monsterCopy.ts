// src/logic/monsterCopy.ts

import type { Monster } from '@/types/monster'

const COPY_SUFFIX = ' (copie)'

/**
 * Prépare le double d'un monstre : une entité indépendante (nouvel id attribué à la création),
 * toujours personnalisée puisque le MJ la crée pour la modifier.
 */
export function buildMonsterCopy(monster: Monster): Omit<Monster, 'id' | 'createdAt'> {
  // Copie profonde en objet simple : aucune référence partagée avec l'original, et pas de
  // Proxy Vue transmis à Dexie (DataCloneError).
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...rest } =
    JSON.parse(JSON.stringify(monster)) as Monster

  return {
    ...rest,
    name: `${monster.name}${COPY_SUFFIX}`,
    isCustom: true,
  }
}
