import TabLayout from "@/components/drawing/TabLayout"
import {
  Challenge,
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
  const handleRecord = () => {
    const key = recordKey(challenge?.id!)

    const records = recordMap[key] || []
    const newRecords = [...records, {
      challengeId: challenge!.id,
      action: 'Record',
      recordedAt: new Date(),
      value: ''
    }]
    // @ts-ignore
    setRecordMap({
      ...recordMap,
      [key]: newRecords
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

  return challenge && <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><button onClick={handleList}>List</button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><button onClick={handleRecord}>Record</button></div>
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
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage