
import { supabase } from '@/lib/api/base';
import { Routine, UserChallenge } from "@/mentalcare/states";

export const listChallenges = async () =>  {
  return supabase.from('challenges').select()
}

export const listPeriods = async () => {
  return supabase.from('periods').select()
}

export const listRoutines = async () => {
  return supabase.from('routines').select(`
    id,
    name,
    period:periods (id, name, weeks, is_holiday),
    challenges
  `)
    .eq('owner_id', await getUserId())
}

export const createRoutine = async (input: Routine) => {
  const { id, period, ...data} = {...input, period_id: input.period.id}
  // @ts-ignore
  await supabase.from("routines").insert({...data, owner_id: await getUserId()})
}

export const deleteRoutine = async (id: number) => {
  await supabase.from("routines").delete().eq('id', id)
}

export const updateRoutine = async (input: Routine) => {
  const { period, ...data} = {...input, period_id: input.period.id}
  // @ts-ignore
  await supabase.from("routines").update(data).eq('id', data.id)
}

export const listChallengeRecords = async (code: string, date: number) => {

  return supabase.from("challenge_records").select()
    .eq('challenge_code', code)
    .eq('date', date)
    .eq('owner_id', await getUserId())
}

export const updateChallengeRecords = async (input: UserChallenge) => {
  const { challengeCode, ...data } = {...input, challenge_code: input.challengeCode, owner_id: await getUserId()}

  // @ts-ignore
  await supabase.from("challenge_records").upsert(data)
}

const getUserId = async () => {
  const session = await supabase.auth.getSession()
  const id = session.data.session?.user?.id!
  console.log("uuid", id)
  return id
}