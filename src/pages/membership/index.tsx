import React, { useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import Image from "next/image";
import loveIt from '@/public/assets/images/undraw_love_it_0v4l.svg';

const loginEnabled: boolean = true;

import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { userAtom } from "@/mentalcare/states";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}
const MainPage = () => {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  const { t } = useTranslation('common')
  // TODO: login 여부 확인후 로그인 되어 있으면 멤버쉽 메인으로 이동
  const [user, _setUser ] = useAtom(userAtom)
  if (user.valid) {
    router.push("/membership/main")
    return
  }

  return <>
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={'link'} onClick={() => router.push('/')}>{t('home')}</Button></div>
          <div className={'flex-grow'} />
          <div className="p-2"><Button variant={'default'} onClick={() => router.push('/membership/auth/login')} disabled={!loginEnabled}>{t("login")}</Button></div>
          <div className="p-2"><Button variant={'default'} onClick={() => router.push('/membership/auth/signup')} disabled={!loginEnabled}>{t("signup")}</Button></div>
        </>
      } >
        <>
          {selectedTabIndex === 0 && <div className={'w-full h-full p-4'}>
            <h1 className="text-2xl">{t('membership')}</h1>
            <div className="inline-flex items-baseline w-full pt-4">
              {t('membershipDescription')}
            </div>
            <div className="flex flex-col items-center w-full pt-4">
              <Image src={loveIt} alt={'Join'} height={400} />
            </div>
          </div>}
        </>
      </TabLayout>
    </div>
  </>
}

export default MainPage

