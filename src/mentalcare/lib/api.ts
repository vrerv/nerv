
import { supabase } from '@/lib/api/base';
import { Routine, UserChallenge } from "@/mentalcare/states";
import { dateNumber } from "@/mentalcare/lib/date-number";

export const listChallenges = async () => {
  return supabase.from('challenges').select()
}

export const getRoutineDay = async (date: number) => {
  return supabase.from('routine_days').select()
    // @ts-ignore
    .eq('date', date)
    // @ts-ignore
    .eq('owner_id', await getUserId())
    .single()
}

export const createRoutineDays = async (routine: Routine) => {
  const date = dateNumber(new Date())
  // @ts-ignore
  await supabase.from('routine_days').upsert({
    date: date,
    base_routine: routine.id,
    challenges: routine.challenges,
    owner_id: await getUserId()
  })
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
    // @ts-ignore
    .eq('owner_id', await getUserId())
}

export const createRoutine = async (input: Routine) => {
  const { id, period, ...data } = { ...input, period_id: input.period.id }
  // @ts-ignore
  await supabase.from("routines").insert({ ...data, owner_id: await getUserId() })
}

export const deleteRoutine = async (id: number) => {
  // @ts-ignore
  return supabase.from("routines").delete().eq('id', id)
}

export const updateRoutine = async (input: Routine) => {
  const { period, ...data } = { ...input, period_id: input.period.id }
  // @ts-ignore
  await supabase.from("routines").update(data).eq('id', data.id)
}

export const listChallengeRecords = async (code: string, date: number) => {

  return supabase.from("challenge_records").select()
    // @ts-ignore
    .eq('challenge_code', code)
    // @ts-ignore
    .eq('date', date)
    // @ts-ignore
    .eq('owner_id', await getUserId())
}

export const updateChallengeRecords = async (input: UserChallenge) => {
  const data = { ...input, challenge_code: input.challenge_code, owner_id: await getUserId() }

  // @ts-ignore
  await supabase.from("challenge_records").upsert(data)
}

const getUserId = async () => {
  const session = await supabase.auth.getSession()
  const id = session.data.session?.user?.id!
  console.log("uuid", id)
  return id
}