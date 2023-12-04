import TabLayout from "@/components/drawing/TabLayout"
import {
  Challenge,
  challengeRecordsAtom,
  DEFAULT_CHALLENGES, recordKey,
  Routine,
  userAtom
} from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { MentalCareHeader } from "@/mentalcare/components/header";
import { useSecondsTimer } from "@/mentalcare/hooks/use-seconds-timer";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import * as allLocales from 'date-fns/locale';

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
    const newChallenges = routine.challenges.filter(ch => ch.code !== challengeId)
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

  const handleList = () => {
    router.push('/service/mentalcare')
  }

  const [recordMap, _setRecordMap] = useAtom(challengeRecordsAtom)

  return <>
    <div className={'flex flex-col items-start p-0'}>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={handleList}>List</button></div>
        <div className={"flex-grow"} />
        <div className="p-2"><button><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></button></div>
        <div className="p-2"><button onClick={handleNewRoutine}>New</button></div>
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
                <span>루틴: &nbsp;</span>
                {(!editMode) && <div className={'text-2xl'}>{`${routine?.name} ${routine?.period.name}`}</div>}
              </div>
              <>
                <Calendar
                  locale={allLocales[locale]}
                  mode="single"
                  className="rounded-md border"
                />
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