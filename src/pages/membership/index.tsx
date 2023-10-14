import React, { useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Image from "next/image";
import loveIt from '@/public/assets/images/undraw_love_it_0v4l.svg';

const loginEnabled: boolean = true;

const MainPage = () => {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  // TODO: login 여부 확인후 로그인 되어 있으면 멤버쉽 메인으로 이동

  return <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={'link'} onClick={() => router.back()}>Back</Button></div>
          <div className={'flex-grow'} />
          <div className="p-2"><Button variant={'default'} onClick={() => router.push('/membership/auth')} disabled={!loginEnabled}>Login</Button></div>
          <div className="p-2"><Button variant={'default'} onClick={() => router.push('/membership/auth')} disabled={!loginEnabled}>SignUp</Button></div>
        </>
      } >
        <>
          {selectedTabIndex === 0 && <div className={'w-full h-full p-4'}>
            <h1 className="text-2xl">멤버쉽</h1>
            <div className="inline-flex items-baseline w-full pt-4">
              개발 중인 서비스 사용을 원하면 멤버쉽에 가입하여 미리 참여 할 수 있습니다.
            </div>
            <div className="flex flex-col items-center w-full pt-4">
              <Image src={loveIt} alt={'Join'} />
            </div>
          </div>}
        </>
      </TabLayout>
    </div>
  </>
}

export default MainPage