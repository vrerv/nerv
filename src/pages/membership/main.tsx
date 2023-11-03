import React, { useEffect, useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { userAtom } from "@/lib/states/states";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from "next/link";
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

  useEffect(() => {
    if (!user.valid) {
      router.push("/membership/")
      return
    }
  }, []);
  const handleSignout = () => {
    _setUser({valid: false, profile: { name: "" }, accessToken: ""})
    router.push("/membership/")
  }

  return <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={"link"}
                                       onClick={() => router.back()}>{t('back')}</Button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><Button variant={"default"}
                                       onClick={() => router.push("/membership/profile")}>{t("showProfile")}</Button>
          </div>
          <div className="p-2"><Button variant={"default"}
                                       onClick={() => handleSignout()}>{t("signout")}</Button>
          </div>
        </>
      } >
        <>
          {selectedTabIndex === 0 && <div className={'w-full h-full p-4'}>
            <h1 className="text-2xl">{t('services')}</h1>
            <div className="inline-flex items-baseline w-full pt-4">
              {t('servicesDescription')}
            </div>
            <div className="flex flex-col items-center w-full pt-4">
              Service
              <ul>
                <li><Link href={'/service/drawing'}>Simple Drawing</Link></li>
                <li>Mental Care</li>
              </ul>
            </div>
          </div>}
        </>
      </TabLayout>
    </div>
}

export default MainPage

