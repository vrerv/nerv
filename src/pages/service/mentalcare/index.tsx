import TabLayout from "@/components/drawing/TabLayout"
import { Challenge, DEFAULT_CHALLENGES, Routine, userAtom } from "@/mentalcare/states";
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
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CheckedState } from "@radix-ui/react-checkbox";

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
  const [user, setUser] = useAtom(userAtom)
  const [routines, setRoutines] = useState<Routine[]>([])
  const now = useSecondsTimer()

  const handleHome = () => {
    router.push('/membership')
  }
  const handleDelete = () => {
    setUser({
      ...user,
      profile: {
        name: '',
        routines: routines.filter(r => r.id !== routine?.id) || [],
      }
    })
  }

  const handleNewRoutine = () => {
    router.push('/service/mentalcare/first')
  }

  const [editMode, setEditMode] = useState(false)

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleRemoveChallenge = (routineId: number, challengeId: string) => () => {
    const routine = routines.find(r => r.id == routineId)!
    const newChallenges = routine.challenges.filter(ch => ch.id !== challengeId)
    routine.challenges = newChallenges

    setUser({
      ...user
    })
  }

  useEffect(() => {
    // @ts-ignore
    const list: Routine[] = user?.profile?.routines?.filter((it) => it.period.weeks.includes(now.getDay())) || []
    setRoutines(list)
    if (list) {
      setRoutine(list[0])
    }

    if (user.profile?.routines?.length === 0) {
      router.push("./mentalcare/first")
      return
    }
  }, [user.profile]);

  const [routine, setRoutine] = useState<Routine>()
  const handleChallenge = (routineId: number, challenge: Challenge) => (checked: CheckedState) => {
    const routine = routines.find(r => r.id === routineId)
    console.log("routine", routine)
    if (routine) {
      const newList = checked ? [...routine.challenges, challenge] : routine.challenges.filter((it) => it.id !== challenge.id)
      setRoutine({
        ...routine,
        challenges: newList,
      })
      routines.find(r => r.id === routine.id)!.challenges = newList
      setRoutines([
        ...routines
      ])
    }
  }

  const handleSelectRoutine = (id:string) => {
    const routine = routines.find(r => `${r.id}` === id)
    console.log('find', routine)
    setRoutine(routine)
  }

  return <>
    <div className={'flex flex-col items-start p-0'}>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={handleHome}>Home</button></div>
        <div className={"flex-grow"} />
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
                  {DEFAULT_CHALLENGES.filter(ch => !routine?.challenges?.find(c => c.id === ch.id)).map((challenge) => <li key={challenge.id}>
                    <div className="flex items-center space-x-2 p-1">
                      <Checkbox id={challenge.id} onCheckedChange={handleChallenge(routine?.id || 0, challenge)} />
                      <label
                        htmlFor={challenge.id}
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
                <div key={`${routine.id}/${challenge.id}`} className={'flex justify-between text-xl w-full'}>
                  <Link href={`/service/mentalcare/challenge/${challenge.id}`}>{challenge.name}</Link>
                  {editMode && <Button type={'button'} variant={'outline'} size={'sm'} onClick={handleRemoveChallenge(routine.id, challenge.id)}>Remove</Button>}
                </div>)}
              </>
            </div>
          </main>
        </div>
      </>
    </TabLayout>
    </div>
  </>
}

export default IndexPage