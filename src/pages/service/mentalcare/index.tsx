import TabLayout from "@/components/drawing/TabLayout";
import {
  Challenge,
  challengeRecordsAtom,
  challengesAtom,
  recordKey,
  Routine,
  routinesAtom
} from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { MentalCareHeader } from "@/mentalcare/components/header";
import { useSecondsTimer } from "@/mentalcare/hooks/use-seconds-timer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CalendarIcon } from "lucide-react";
import { deleteRoutine, listRoutines, updateRoutine } from "@/mentalcare/lib/api";

export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

const IndexPage = ({locale}: { locale: string; }) => {

  const router = useRouter();
  const [routines, setRoutines] = useAtom(routinesAtom)
  const [challenges] = useAtom(challengesAtom)
  const now = useSecondsTimer()

  const fetchRoutines = () =>
    listRoutines().then(r => {
      const { data, error } = r;
      if (error) {
        console.log("error on listRoutines", error)
        return
      }
      if (data) {
        const list: Routine[] = (data as unknown as Routine[]).filter((it) => it.period.weeks.includes(now.getDay())) || []
        setRoutines(list)
        if (list) {
          setRoutine(list[0])
        } else {
          router.push("./mentalcare/first")
        }
      }
    });

  const handleHome = () => {
    router.push('/membership')
  }
  const handleDelete = async () => {
    await deleteRoutine(routine!.id)
    setRoutines(routines.filter(r => r.id !== routine?.id) || [])
  }

  const handleNewRoutine = () => {
    router.push('/service/mentalcare/first')
  }

  const [editMode, setEditMode] = useState(false)

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleRemoveChallenge = (routineId: number, challengeId: string) => async () => {
    const routine = routines.find(r => r.id == routineId)!
    routine.challenges = routine.challenges.filter(ch => ch !== challengeId)

    await updateRoutine(routine)
    setRoutines(routines)
    setRoutine(routine)
  }

  useEffect(() => {
    fetchRoutines().then()
  }, []);

  const [routine, setRoutine] = useState<Routine>()
  const handleChallenge = (routineId: number, challenge: Challenge) => async (checked: CheckedState) => {
    const routine = routines.find(r => r.id === routineId)
    if (routine) {
      const newList = checked ? [...routine.challenges, challenge.code] : routine.challenges.filter((it) => it !== challenge.code)
      const newRoutine = { ...routine, challenges: newList, }
      await updateRoutine(newRoutine)
      setRoutine(newRoutine)
      routines.find(r => r.id === routine.id)!.challenges = newList
      setRoutines([
        ...routines
      ])
    }
  }

  const handleSelectRoutine = async (id:string) => {
    const routine = routines.find(r => `${r.id}` === id)
    setRoutine(routine)
  }

  const handleGoCalendar = async () => {
    await router.push("/service/mentalcare/calendar")
  }


  const [recordMap, _setRecordMap] = useAtom(challengeRecordsAtom)
  const isCompleted = (challengeId: string) => {
    const key = recordKey(challengeId, now)
    return recordMap[key]?.completed || false
  }

  return <>
    <div className={'flex flex-col items-start p-0'}>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={handleHome}>Home</button></div>
        <div className={"flex-grow"} />
        <div className="p-2"><button onClick={handleGoCalendar}><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></button></div>
        <div className="p-2"><button onClick={handleNewRoutine}>New</button></div>
        <div className="p-2"><button onClick={handleEditMode}>{editMode ? 'Done' : 'Edit'}</button></div>
        <div className="p-2"><button onClick={handleDelete}>Del</button></div>
      </>
    } >
      <>
        <div className={'w-full h-full'}>
          <MentalCareHeader locale={locale} />
          <main className={'p-4'}>
            {routines.length === 0 && <div>
              오늘의 도전 목록이 없습니다
            </div>}
            {routines.length > 0 &&
            <div className={'w-full mt-2'}>
              <div className={'text-2xl flex mb-2'}>
                <span>오늘의 루틴: &nbsp;</span>
                {(!editMode) && <div className={'text-2xl'}>{`${routine?.name} ${routine?.period.name}`}</div>}
              </div>
              {editMode &&
              <Select onValueChange={handleSelectRoutine} value={`${routine?.id}`}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a routine" />
                </SelectTrigger>
                <SelectContent>
                  {routines.map((routine) =>
                    <SelectItem value={`${routine.id}`}><div className={'text-xl'}>{`${routine.name} ${routine.period.name} - ${routine.id}`}</div></SelectItem>
                  )}
                </SelectContent>
              </Select>}
              {editMode && <>
                <ul className={'mt-2 mb-2'}>
                  {challenges.filter(ch => !routine?.challenges?.find(c => c === ch.code)).map((challenge) => <li key={challenge.code}>
                    <div className="flex items-center space-x-2 p-1">
                      <Checkbox id={challenge.code} onCheckedChange={handleChallenge(routine?.id || 0, challenge)} />
                      <label
                        htmlFor={challenge.code}
                        className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {challenge.name}
                      </label>
                    </div>
                  </li>)}
                </ul>
              </>}
              <>
                {routine?.challenges?.map((challenge) =>
                <div key={`${routine.id}/${challenge}`} className={'flex justify-between text-xl w-full' + `${isCompleted(challenge) ? ' bg-green-500': ''}`}>
                  <Link href={`/service/mentalcare/challenge/${challenge}`}>{challenges.find(it => it.code === challenge)!.name}</Link>
                  {editMode && <Button type={'button'} variant={'outline'} size={'sm'} onClick={handleRemoveChallenge(routine.id, challenge)}>Remove</Button>}
                </div>)}
              </>
            </div>
            }
          </main>
        </div>
      </>
    </TabLayout>
    </div>
  </>
}

export default IndexPage