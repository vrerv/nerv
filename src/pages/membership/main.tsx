import React, { useEffect, useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { userAtom } from "@/mentalcare/states";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
// @ts-ignore
import { signout } from "@/lib/api/auth";
// @ts-ignore
import { listServices } from "@/lib/api/services";

type Service = {
  name: string;
  url: string;
}

export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}
const MainPage = ({locale}: { locale: string; }) => {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  const { t } = useTranslation('common')
  console.log("locale", locale)
  // TODO: login 여부 확인후 로그인 되어 있으면 멤버쉽 메인으로 이동
  const [user, _setUser ] = useAtom(userAtom)
  const [services, setServices] = useState<Service[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user.valid) {
      router.push("/membership/", '/membership', { locale: locale }).then()
      return
    }
    const fn = async () => {
      const { data, error } = await listServices();
      if (data) {
        console.log('data', data)
        setServices(data)
      }
      if (error) {
        setError(error.message)
      }
    }
    fn().then();
  }, []);
  const handleSignout = async () => {
    _setUser({ ...user, valid: false })
    await signout()
    await router.push("/membership/", '/membership', { locale: locale })
  }

  const handleHome = async () => {
    await router.push('/', '/', { locale: locale })
  }

  return <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={'link'} onClick={handleHome}>{t('home')}</Button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><Button variant={"default"}
                                       onClick={() => router.push("/membership/auth/update-password")}>{t("updatePassword")}</Button>
          </div>
          <div className="p-2"><Button variant={"default"}
                                       onClick={() => handleSignout()}>{t("logout")}</Button>
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
              <ul>
                {services.map((service) => <li><Link href={service.url}>{service.name}</Link></li>)}
              </ul>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </div>}
        </>
      </TabLayout>
    </div>
}

export default MainPage

