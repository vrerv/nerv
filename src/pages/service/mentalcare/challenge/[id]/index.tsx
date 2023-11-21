import TabLayout from "@/components/drawing/TabLayout"
import {
  Challenge, ChallengeRecord,
  challengeRecordsAtom,
  DEFAULT_CHALLENGES, recordKey,
  userAtom
} from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";
// @ts-ignore
import { AskPicture } from '@/components/openai/ask-picture';
import { MentalCareHeader } from "@/mentalcare/components/header";
import { TodoList } from "@/mentalcare/components/todo";
import { Button } from "@/components/ui/button";

export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

export const getStaticPaths: GetStaticPaths<any> = async ({locales}) => {

  const paths = (locales || []).flatMap((locale) => {

    const pages = DEFAULT_CHALLENGES;
    return pages.map((p: any) => ({
      params: { id: p.id }, locale: locale,
    }))
  })

  return {
    paths: paths,
    fallback: false,
  }
};

const IndexPage = ({locale}: { locale: string; }) => {

  const router = useRouter();
  const [user] = useAtom(userAtom)
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const handleList = () => {
    router.push('/service/mentalcare')
  }
  const handleMoveToHistory = () => {
    router.push(`/service/mentalcare/challenge/${challenge?.id}/history`)
  }


  const [recordMap, setRecordMap] = useAtom(challengeRecordsAtom)
  const handleRecord = (value: any) => () => {
    const key = recordKey(challenge?.id!)

    const userData = recordMap[key]!
    const records = userData?.records || []
    const newRecords = [...records, {
      challengeId: challenge!.id,
      action: 'Record',
      recordedAt: new Date().toString(),
      value: value
    }]
    const fn: (records: ChallengeRecord[]) => boolean = eval(challenge?.complete || '(records) => false')
    console.log("newRecords", newRecords, fn(newRecords));
    // @ts-ignore
    setRecordMap({
      ...recordMap,
      [key]: {
        ...userData,
        records: newRecords,
        completed: fn(newRecords) || false
      }
    })
  }

  useEffect(() => {
    const { id } = router.query
    const challenge = user.profile?.routines?.flatMap(routine => routine.challenges)
      .find(ch => ch.id === id)!
    setChallenge(challenge)

    if (user.profile?.routines?.length === 0) {
      router.push("/service/mentalcare/first")
      return
    }
  }, [user.profile]);

  const [records, setRecords] = useState<ChallengeRecord[]>([])

  useEffect(() => {
    if (challenge) {
      const key = recordKey(challenge?.id!)
      if (recordMap[key]) {
        setRecords(recordMap[key]!.records)
      }
    }
  }, [challenge, recordMap])

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
              {challenge.description}
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
              {challenge.id === 'remind-todo-1' && <TodoList record={handleRecord} />}
              {challenge.id === 'drink-water-1' && <>
                <div className="grid grid-cols-4 gap-4 p-4">
                  {[1,2,3,4,5,6,7,8].map(it =>
                    <Button variant={"link"}
                            onClick={handleRecord('200')}
                            className={`h-full p-4 bg-blue-400`}
                            disabled={records.length >= it}>{it}</Button>)}
                </div>
              </>}
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage

