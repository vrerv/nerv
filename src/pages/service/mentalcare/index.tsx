import TabLayout from "@/components/drawing/TabLayout"
import { Challenge, userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [now, setNow] = useState(new Date())

  const handleHome = () => {
    router.push('/membership')
  }
  const handleReset = () => {
    setUser({
      ...user,
      profile: {
        name: '',
        routines: []
      }
    })
  }

  useEffect(() => {
    // @ts-ignore
    const challenges: Challenge[] = user?.profile?.routines?.filter((it) => it.period.weeks.includes(now.getDay()))
      .flatMap((routine) => routine.challenges) || []
    setChallenges(challenges)

    if (user.profile?.routines?.length === 0) {
      router.push("./mentalcare/first")
      return
    }
  }, [user.profile]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000);

    return () => {
      window.clearInterval(timer);
    }
  }, [])

  return <>
    <div className={'flex flex-col items-start p-0'}>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={handleHome}>Home</button></div>
        <div className={"flex-grow"} />
        <div className="p-2"><button onClick={handleReset}>Reset</button></div>
      </>
    } >
      <>
        <div className={'w-full h-full p-4'}>
          <div className={"flex w-full justify-between items-end"}>
            <h1 className={"text-2xl"}>Mental Care</h1>
            <span className={"h-full align-bottom font-mono"}>{now.toLocaleTimeString(locale)}</span>
          </div>
          <div>
            <span className={"text-xl justify-end"}>오늘({now.toLocaleDateString(locale)})의 도전 목록</span>
          </div>
          <main>
            {challenges.length === 0 && <div>
              오늘의 도전 목록이 없습니다
            </div>}
            <ul>
              {challenges.map((challenge) => <li><button>{challenge.name}</button></li>)}
            </ul>
          </main>
        </div>
      </>
    </TabLayout>
    </div>
  </>
}

export default IndexPage