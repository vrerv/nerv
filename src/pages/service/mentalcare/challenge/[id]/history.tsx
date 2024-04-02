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
import { Button } from "@/components/ui/button";
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
  const [challenges] = useAtom(challengesAtom)
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [weeks, setWeeks] = useState<boolean>(false)

  useEffect(() => {
    const { id } = router.query
    const challenge = challenges.find(ch => ch.code === id)!
    setChallenge(challenge)

    if (user.profile?.routines?.length === 0) {
      router.push("/service/mentalcare/first")
      return
    }
  }, [challenges]);

  const [recordMap, setRecordMap] = useAtom(challengeRecordsAtom)
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
          const uc = data!.find(_ => true) as UserChallenge
          console.log('records', code, data)
          setRecordMap({...recordMap, [key]: uc})
          setRecords(uc?.records || [])
        }
      })
    }
  }, [challenge])


  const handleList = () => {
    router.push(`/service/mentalcare/challenge/${challenge?.code}`)
  }
  const handleWeeks = async () => {

    setWeeks(true)
    const now = new Date();
    const r = [0, 1, 2, 3, 4, 5, 6].flatMap(async (backDay) => {
      const date = new Date(now.getTime() - (backDay * 24 * 60 * 60 * 1000))
      const key = recordKey(challenge!.code, date)
      if (!recordMap[key]) {
        return await listChallengeRecords(challenge!.code, dateNumber(date)).then(r => {
          const { data, error } = r;
          if (error) {
            console.error("failed  to get challenge records", error)
          }
          if (data) {
            // @ts-ignore
            const uc = data!.find(_ => true) as UserChallenge
            setRecordMap({...recordMap, [key]: uc})
            return uc
          }
          return undefined
        })
      }
      return recordMap[key]
    })
    Promise.all(r).then(r => {
      setRecords(r.flatMap(ur => ur?.records || []));
    });
  }

  const [editMode, setEditMode] = useState(false)

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleRemoveRecord = (index: number) => async () => {
    // TODO
    const uc = recordMap[recordKey(challenge!.code)]!
    uc.records.splice(index, 1)
    // push to remote
    console.log("uc", uc)
    console.log("completed", getVerificationFn(challenge!.verification)(uc.records))
    await updateChallengeRecords({
      ...uc, completed: getVerificationFn(challenge!.verification)(uc.records)
    })

    setRecords([...uc.records])
  }

  return challenge && <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><button onClick={handleList}>Back</button></div>
          <div className={"flex-grow"} />
          {!weeks && <div className="p-2"><button onClick={handleEditMode}>{editMode ? 'Done' : 'Edit'}</button></div> }
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
              {records?.map((record, i) =>
                <div key={i} className={'font-mono'}>
                  <span>{record.action || '기록'} - {new Date(record.recordedAt).toLocaleString(locale)}</span>{' '}
                  {editMode && <Button type={'button'} variant={'outline'} size={'sm'} onClick={handleRemoveRecord(i)}>Remove</Button>}
                </div>)}
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage