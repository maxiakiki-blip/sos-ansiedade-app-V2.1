import { supabase } from './supabase'
import type { Buyer, GamificationState } from '../types'

export async function fetchBuyers(): Promise<Buyer[]> {
  const { data } = await supabase.from('buyers').select('*')
  if (!data) return []
  return data.map(b => ({
    email: b.email,
    name: b.name || 'Comprador',
    password: b.password,
    registrationDate: b.registration_date || new Date().toLocaleDateString('pt-BR')
  }))
}

export async function upsertBuyer(buyer: Buyer): Promise<void> {
  await supabase.from('buyers').upsert({
    email: buyer.email,
    name: buyer.name,
    password: buyer.password,
    registration_date: buyer.registrationDate
  }, { onConflict: 'email' })
}

export async function deleteBuyer(email: string): Promise<void> {
  await supabase.from('buyers').delete().eq('email', email)
}

export async function fetchUserLogs(userEmail: string): Promise<Record<string, string[]>> {
  const { data } = await supabase
    .from('activity_logs')
    .select('activity_name, log_date')
    .eq('user_email', userEmail)
  if (!data) return {}
  const result: Record<string, string[]> = {}
  for (const row of data) {
    if (!result[row.log_date]) result[row.log_date] = []
    if (!result[row.log_date].includes(row.activity_name))
      result[row.log_date].push(row.activity_name)
  }
  return result
}

export async function insertActivityLog(userEmail: string, activityName: string, date: string): Promise<void> {
  const { data: existing } = await supabase
    .from('activity_logs')
    .select('id')
    .eq('user_email', userEmail)
    .eq('activity_name', activityName)
    .eq('log_date', date)
    .maybeSingle()
  if (existing) return
  await supabase.from('activity_logs').insert({
    user_email: userEmail,
    activity_name: activityName,
    log_date: date
  })
}

export async function fetchUserMoods(userEmail: string): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('moods')
    .select('mood_id, mood_date')
    .eq('user_email', userEmail)
  if (!data) return {}
  const result: Record<string, string> = {}
  for (const row of data) result[row.mood_date] = row.mood_id
  return result
}

export async function upsertMood(userEmail: string, moodId: string, date: string): Promise<void> {
  await supabase.from('moods').upsert({
    user_email: userEmail,
    mood_id: moodId,
    mood_date: date
  }, { onConflict: 'user_email,mood_date' })
}

export async function fetchGamification(userEmail: string): Promise<GamificationState | null> {
  const { data } = await supabase
    .from('gamification')
    .select('*')
    .eq('user_email', userEmail)
    .maybeSingle()
  if (!data) return null
  return {
    xp: data.xp,
    streak: data.streak,
    lastActivityDate: data.last_activity_date,
    unlockedBadgeIds: data.unlocked_badge_ids || []
  }
}

export async function upsertGamification(userEmail: string, state: GamificationState): Promise<void> {
  await supabase.from('gamification').upsert({
    user_email: userEmail,
    xp: state.xp,
    streak: state.streak,
    last_activity_date: state.lastActivityDate,
    unlocked_badge_ids: state.unlockedBadgeIds,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_email' })
}
