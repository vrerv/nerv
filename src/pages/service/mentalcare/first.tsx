import React, { useEffect, useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import {
  Challenge,
  challengesAtom,
  Period,
  periodsAtom,
  Routine, userAtom
} from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MentalCareHeader } from "@/mentalcare/components/header";
import { Input } from "@/components/ui/input";
import { createRoutine, listChallenges, listPeriods } from "@/mentalcare/lib/api";

const MainPage = ({locale}: { locale: string; }) => {

  const router = useRouter()
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [periods, setPeriods] = useAtom(periodsAtom)
  const [challenges, setChallenges] = useAtom(challengesAtom)

  useEffect(() => {
    listPeriods().then(r => {
      const { data, error } = r;
      if (error) throw error
      setPeriods(data?.map(it => it as Period) || [])
    })
    listChallenges().then(r => {
      const { data, error } = r;
      if (error) throw error
      setChallenges(data?.map(it => it as Challenge) || [])
    })
  }, []);

  const [routine, setRoutine] = useState<Routine>({
    id: new Date().getTime(),
    name: '',
    period: periods[0]!,
    challenges: [],
  })

  const handlePeriod = (period: Period) => () => {
    setRoutine({
      ...routine,
      period: period,
    })
  }

  const handleChallenge = (challenge: Challenge) => (checked: CheckedState) => {
    const newList = checked ? [...routine.challenges, challenge.code] : routine.challenges.filter((it) => it !== challenge.code)
    setRoutine({
      ...routine,
      challenges: newList,
    })
  }

  const handleNameChange = (event:any) => {
    setRoutine({
      ...routine,
      name: event.target.value
    })
  }

  const handleCancel = () => {
    router.push('/membership')
  }

  const STEP_END = 2;

  const [user, setUser] = useAtom(userAtom)

  const handleNext = async () => {
    if (selectedTabIndex === STEP_END) {
      await createRoutine(routine)
      setUser({
        ...user,
        profile: {
          name: '',
          routines: [...(user.profile?.routines || []), routine],
        }
      })
      router.push('/service/mentalcare/')
    } else {
      setSelectedTabIndex(selectedTabIndex + 1)
    }
  }

  return <>
    <div className={'flex flex-col items-start p-0'}>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={handleCancel}>Cancel</button></div>
        <div className="p-2"><button onClick={() => setSelectedTabIndex(selectedTabIndex - 1) }>이전</button></div>
        <div className="p-2"><button onClick={handleNext}>{selectedTabIndex === STEP_END ? '시작' : '다음'}</button></div>
      </>
    } >
      <>
        <div className={'w-full h-full'}>
          <MentalCareHeader locale={locale} />
          <main className={'p-4'}>

        {selectedTabIndex === 0 && <div>
          당신의 몸과 마음의 건강을 위해 매일의 루틴을 설정하고 시작해보세요.
        </div>}
        {selectedTabIndex === 1 && <div>

          <h2 className={"pb-2"}>루틴 생성 - 주기 설정</h2>
          <label
            htmlFor={'name'}
            className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Name
          </label>
          <Input id={'name'} value={routine.name} onChange={handleNameChange} />
            <RadioGroup>
              <ul>
            {periods.map((period) => <li key={period.name}>
              <div className="flex items-center space-x-2 p-1">
                <RadioGroupItem id={period.name} value={period.name} onClick={handlePeriod(period)} />
                <label
                  htmlFor={period.name}
                  className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {period.name}
                </label>
              </div>
            </li>)}
              </ul>
            </RadioGroup>
        </div>}
          {selectedTabIndex === 2 && <div>
            <h2 className={"pb-2"}>루틴 생성 - 도전 설정</h2>
              <ul>
                {challenges.map((challenge) => <li key={challenge.code}>
                  <div className="flex items-center space-x-2 p-1">
                    <Checkbox id={challenge.code} onCheckedChange={handleChallenge(challenge)} />
                    <label
                      htmlFor={challenge.code}
                      className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {challenge.name}
                    </label>
                  </div>
                </li>)}
              </ul>
          </div>}
          {selectedTabIndex === 3 && <div>
            <h2>루틴 생성 - 이름</h2>
              <input name="name" type="text" minLength={1} maxLength={32} />
          </div>}
          </main>
        </div>
      </>
    </TabLayout>
    </div>
  </>
}

export default MainPage