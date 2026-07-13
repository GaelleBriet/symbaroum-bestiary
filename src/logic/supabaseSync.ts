// src/logic/supabaseSync.ts
// Wrappers Supabase purs — miroir de logic/database.ts, sans état réactif
// Ne concerne QUE les monstres isCustom: true (les monstres officiels ne sont jamais envoyés ici)

import { supabase } from '@/lib/supabase'
import type { Monster } from '@/types/monster'

interface MonsterRow {
  data: Monster
}

export async function fetchCustomMonsters(userId: string): Promise<Monster[]> {
  const { data, error } = await supabase
    .from('monsters')
    .select('data')
    .eq('user_id', userId)

  if (error) throw error
  return (data as MonsterRow[]).map((row) => row.data)
}

export async function upsertMonsterRemote(monster: Monster, userId: string): Promise<void> {
  const { error } = await supabase.from('monsters').upsert({
    id: monster.id,
    user_id: userId,
    data: monster,
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
}

export async function deleteMonsterRemote(id: string): Promise<void> {
  const { error } = await supabase.from('monsters').delete().eq('id', id)
  if (error) throw error
}
