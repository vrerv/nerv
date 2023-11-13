import React, { useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import {
  Challenge,
  challengesAtom,
  Period,
  periodsAtom,
  Routine
} from "@/mentalcare/states";
import { useAtom } from "jotai";

const MainPage = () => {

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

  const handleChallenge = (challenge: Challenge) => () => {
    setRoutine({
      ...routine,
      challenges: [...routine.challenges, challenge],
    })
  }

  return <>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={() => setSelectedTabIndex(selectedTabIndex + 1) }>시작하기</button></div>
      </>
    } >
      <>
        <h1>Mental Care</h1>
        {selectedTabIndex === 0 && <div>랜딩페이지: 당신의 멘탈을 책임집니다.</div>}
        {selectedTabIndex === 1 && <div>
          <h1>루틴 생성 - 1</h1>
          <main>
            {periods.map((period) => <button onClick={handlePeriod(period)}>{period.name}</button>)}
          </main>
        </div>}
        {selectedTabIndex === 2 && <div>
          <h1>루틴 생성 - 2</h1>
          <main>
            <ul>
            {challenges.map((challenge) => <li><button onClick={handleChallenge(challenge)}>{challenge.name}</button></li>)}
            </ul>
          </main>
        </div>}
      </>
    </TabLayout>
  </>
}

export default MainPage