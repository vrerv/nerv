import TabLayout from "@/components/drawing/TabLayout"
import { Challenge, DEFAULT_CHALLENGES, userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticPaths } from "next";

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
  const [now, setNow] = useState(new Date())

  const handleList = () => {
    router.push('/service/mentalcare')
  }
  const handleChallenge = () => {

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000);

    return () => {
      window.clearInterval(timer);
    }
  }, [])

  return challenge && <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><button onClick={handleList}>List</button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><button onClick={handleChallenge}>Challenge</button></div>
        </>
      } >
        <>
          <div className={'w-full h-full p-4'}>
            <div className={"flex w-full justify-between items-end"}>
              <h1 className={"text-2xl"}>Mental Care</h1>
              <span className={"h-full align-bottom font-mono"}>{now.toLocaleTimeString(locale)}</span>
            </div>
            <div>
              <span className={"text-xl justify-end"}>{challenge.name}</span>
            </div>
            <main>
              {challenge.description}
            </main>
          </div>
        </>
      </TabLayout>
    </div>
  </>
}

export default IndexPage