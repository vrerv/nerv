import React, { useState } from "react";
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

const MainPage = () => {

  const router = useRouter()
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [periods] = useAtom(periodsAtom)
  const [challenges] = useAtom(challengesAtom)

  const [routine, setRoutine] = useState<Routine>({
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
    const newList = checked ? [...routine.challenges, challenge] : routine.challenges.filter((it) => it.id !== challenge.id)
    setRoutine({
      ...routine,
      challenges: newList,
    })
  }

  const handleCancel = () => {
    router.push('/membership')
  }

  const STEP_END = 2;

  const [user, setUser] = useAtom(userAtom)

  const handleNext = () => {
    if (selectedTabIndex === STEP_END) {
      setUser({
        ...user,
        profile: {
          name: '',
          routines: [routine],
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
        <div className={'w-full h-full p-4'}>
        <h1 className={"text-2xl"}>Mental Care</h1>

        {selectedTabIndex === 0 && <div>
          당신의 몸과 마음의 건강을 위해 매일의 루틴을 설정하고 시작해보세요.
        </div>}
        {selectedTabIndex === 1 && <div>
          <h2 className={"pb-2"}>루틴 생성 - 주기 설정</h2>
          <main>
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
          </main>
        </div>}
          {selectedTabIndex === 2 && <div>
            <h2 className={"pb-2"}>루틴 생성 - 도전 설정</h2>
            <main>
              <ul>
                {challenges.map((challenge) => <li key={challenge.id}>
                  <div className="flex items-center space-x-2 p-1">
                    <Checkbox id={challenge.id} onCheckedChange={handleChallenge(challenge)} />
                    <label
                      htmlFor={challenge.id}
                      className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {challenge.name}
                    </label>
                  </div>
                </li>)}
              </ul>
            </main>
          </div>}
          {selectedTabIndex === 3 && <div>
            <h2>루틴 생성 - 이름</h2>
            <main>
              <input name="name" type="text" minLength={1} maxLength={32} />
            </main>
          </div>}
        </div>
      </>
    </TabLayout>
    </div>
  </>
}

export default MainPage