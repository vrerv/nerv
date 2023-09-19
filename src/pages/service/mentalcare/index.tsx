import React, { useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import { useRouter } from "next/router";

const MainPage = () => {

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const router = useRouter();

  return <>
    <h1>Mental Care</h1>
    <TabLayout control={
      () => <>
        <button onClick={() => {
          router.push('/service/mentalcare/login')
        } }>로그인</button>
        <button onClick={() => {
          setSelectedTabIndex(selectedTabIndex + 1)
        } }>시작하기</button>
      </>
    } >
      <>
        {selectedTabIndex === 0 && <div>랜딩페이지: 당신의 멘탈을 책임집니다.</div>}
        {selectedTabIndex === 1 && <div>당신의 건강을 위한 도전 목록을 정하세요</div>}
      </>
    </TabLayout>
  </>
}

export default MainPage