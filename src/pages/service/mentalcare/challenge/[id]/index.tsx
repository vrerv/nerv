import TabLayout from "@/components/drawing/TabLayout"
import {
  Challenge, ChallengeRecord,
  challengeRecordsAtom, challengesAtom,
  recordKey,
  userAtom, UserChallenge, getVerificationFn
} from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// @ts-ignore
import { AskPicture } from '@/components/openai/ask-picture';
import { MentalCareHeader } from "@/mentalcare/components/header";
import { TodoList } from "@/mentalcare/components/todo";
import { DrinkWater } from "@/mentalcare/components/drink-water";
import { listChallengeRecords, updateChallengeRecords } from "@/mentalcare/lib/api";
import { dateNumber } from "@/mentalcare/lib/date-number";

export async function getServerSideProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

const IndexPage = ({locale}: { locale: string; }) => {

  const router = useRouter();
  const [user] = useAtom(userAtom)
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const handleList = () => {
    router.push('/service/mentalcare')
  }
  const handleMoveToHistory = () => {
    router.push(`/service/mentalcare/challenge/${challenge?.code}/history`)
  }


  const [recordMap, setRecordMap] = useAtom(challengeRecordsAtom)
  const handleRecord = (value: any) => async () => {

    const challengeCode = challenge!.code
    const key = recordKey(challengeCode)

    const userData = recordMap[key]!
    const records = userData?.records || []
    const newRecords = [...records, {
      action: 'Record',
      recordedAt: new Date().toString(),
      value: value
    }]
    console.log("newRecords", newRecords, getVerificationFn(challenge?.verification)(newRecords));
    await updateChallengeRecords({
      ...userData,
      challenge_code: challengeCode,
      date: dateNumber(new Date()),
      records: newRecords,
      completed: getVerificationFn(challenge?.verification)(newRecords) || false
    })
    // @ts-ignore
    setRecordMap({
      ...recordMap,
      [key]: {
        ...userData,
        records: newRecords,
        completed: getVerificationFn(challenge?.verification)(newRecords) || false
      }
    })
    setRecords(newRecords)
  }

  const [challenges] = useAtom(challengesAtom)

  useEffect(() => {
    const { id } = router.query
    const challenge = challenges.find(ch => ch.code === id)!
    setChallenge(challenge)

    if (user.profile?.routines?.length === 0) {
      router.push("/service/mentalcare/first")
      return
    }
  }, [challenges]);

  const [records, setRecords] = useState<ChallengeRecord[]>([])

  useEffect(() => {
    if (challenge) {
      const code = challenge!.code
      const key = recordKey(code)
      if (recordMap[key]) {
        setRecords(recordMap[key]!.records)
      }
      listChallengeRecords(code, dateNumber(new Date())).then(r => {
        const { data, error } = r;
        if (error) {
          console.error("failed  to get challenge records", error)
        }
        if (data) {
          // @ts-ignore
          const firstRow = data!.find(_ => true) as UserChallenge
          setRecords(firstRow?.records || [])
          setRecordMap({...recordMap, [key]: { completed: firstRow?.completed, records: firstRow?.records || []} as UserChallenge})
        }
      })
    }
  }, [challenge])

  return challenge && <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><button onClick={handleList}>List</button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><button onClick={handleRecord('')}>Record</button></div>
          <div className="p-2"><button onClick={handleMoveToHistory}>History</button></div>
        </>
      } >
        <>
          <div className={'w-full h-full'}>
            <MentalCareHeader locale={locale} />
            <main className={'p-4'}>
              <div>
                <span className={"text-xl justify-end"}>{challenge.name}</span>
              </div>
              <br/>
              <p style={{whiteSpace: 'pre-line'}}>{challenge.description}</p>
              <br/>
              {challenge.prompt && <>
                <br/>
                <span>도전 과제를 카메라로 촬영해주세요</span>
                <br/>
                <br/>
                <AskPicture submitName={'도전 확인'}
                  query={`사진을 찍은 사람은 어떤 도전을 하고 있으며 그 도전의 설명은 다음과 같다, 사진에서 사용자가 해당 도전을 하고 있는지 "YES" 또는 "NO" 로만 대답 하시오. 도전 설명: ${challenge.prompt}`} />
                </>
              }
              {challenge.code === 'remind-todo-1' && <TodoList record={handleRecord} />}
              {challenge.code === 'drink-water-1' && <DrinkWater record={handleRecord} records={records} />}
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage

