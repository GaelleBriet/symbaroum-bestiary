// src/database/db.ts
// Configuration Dexie.js — Source de vérité locale (IndexedDB)

import Dexie, { type EntityTable } from 'dexie'
import type { Monster } from '@/types/monster'

// On étend Dexie pour typer nos tables
const db = new Dexie('SymbaroumBestiary') as Dexie & {
  monsters: EntityTable<Monster, 'id'>
}

// Schéma v1 — seuls les champs indexés sont listés ici
// La structure complète Monster est stockée telle quelle (IndexedDB est schema-less)
db.version(1).stores({
  monsters: 'id, name, race, isCustom, createdAt',
})

export { db }
