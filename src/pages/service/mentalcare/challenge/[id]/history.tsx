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
    router.push(`/service/mentalcare/challenge/${challenge?.id}`)
  }
  const handleWeeks = () => {

    const now = new Date();
    const r = [0, 1, 2, 3, 4, 5, 6].flatMap(backDay => {
      const date = new Date(now.getTime() - (backDay * 24 * 60 * 60 * 1000))
      const key = recordKey(challenge!.id, date)
      console.log('key', key)
      return recordMap[key] || []
    })
    setRecords(r);
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

  const [recordMap, _setRecordMap] = useAtom(challengeRecordsAtom)
  const [records, setRecords] = useState<ChallengeRecord[]>([])

  useEffect(() => {
    if (challenge) {
      const key = recordKey(challenge?.id!)
      if (recordMap[key]) {
        setRecords(recordMap[key]!)
      }
    }
  }, [challenge, recordMap])


  const [editMode, setEditMode] = useState(false)

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleRemoveRecord = (_recordId: number) => () => {
    // TODO
  }

  return challenge && <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><button onClick={handleList}>Back</button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><button onClick={handleEditMode}>{editMode ? 'Done' : 'Edit'}</button></div>
          <div className="p-2"><button onClick={handleWeeks}>Weeks</button></div>
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
              {records.map(record =>
                <div className={'font-mono'}>
                  <span>{record.action || '기록'} - {new Date(record.recordedAt).toLocaleString(locale)}</span>{' '}
                  {editMode && <Button type={'button'} variant={'outline'} size={'sm'} onClick={handleRemoveRecord(0 /* TODO */)}>Remove</Button>}
                </div>)}
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage