// src/database/db.ts
// Configuration Dexie.js — Source de vérité locale (IndexedDB)

import Dexie, { type EntityTable } from 'dexie'
import type { Monster } from '@/types/monster'
import { isDemoMode } from '@/lib/demo'

// On étend Dexie pour typer nos tables.
// En mode démo, base séparée : la démo ne voit ni ne modifie jamais les monstres du compte réel.
const db = new Dexie(isDemoMode ? 'SymbaroumBestiaryDemo' : 'SymbaroumBestiary') as Dexie & {
  monsters: EntityTable<Monster, 'id'>
}

// Schéma v1 — seuls les champs indexés sont listés ici
// La structure complète Monster est stockée telle quelle (IndexedDB est schema-less)
db.version(1).stores({
  monsters: 'id, name, race, isCustom, createdAt',
})

export { db }
