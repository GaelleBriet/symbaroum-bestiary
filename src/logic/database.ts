// src/logic/database.ts
// Wrappers Dexie purs — sans état réactif, appelés par le store Pinia

import { v4 as uuidv4 } from 'uuid'
import { db } from '@/database/db'
import type { Monster } from '@/types/monster'

export async function createMonster(data: Omit<Monster, 'id' | 'createdAt'>): Promise<string> {
  const monster: Monster = {
    ...data,
    id: uuidv4(),
    createdAt: Date.now(),
  }
  await db.monsters.add(monster)
  return monster.id
}

export async function updateMonster(id: string, changes: Partial<Monster>): Promise<void> {
  await db.monsters.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteMonster(id: string): Promise<void> {
  await db.monsters.delete(id)
}
