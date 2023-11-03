import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
// @ts-ignore
} from "@/components/ui/card"
// @ts-ignore
import { Input } from "@/components/ui/input"
// @ts-ignore
import { Label } from "@/components/ui/label"
import TabLayout from "@/components/drawing/TabLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import { userAtom } from "@/lib/states/states";
import { useAtom } from "jotai";
export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

export default function TabsDemo() {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  const { t } = useTranslation('common')

  const [_user, _setUser ] = useAtom(userAtom)
  const handleLogin = () => {
    _setUser({valid: true, profile: { name: "Soonoh" }, accessToken: "INVALID"})
    router.push("/membership/main")
  }

  return (
    <div className={'flex flex-col items-start p-0'}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={"link"}
                                       onClick={() => router.back()}>{t('back')}</Button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><Button variant={"default"}
                                       onClick={() => handleLogin()}>{t("login")}</Button>
          </div>
        </>
      } >
        <>
          {selectedTabIndex === 0 && <div className={'w-full h-full p-4'}>

            <h1 className="text-2xl">{t('membership')}</h1>
            <div className="inline-flex items-baseline w-full pt-4">
              {t('membershipDescription')}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
            </Card>
          </div>}
        </>
      </TabLayout>
    </div>
  )
}
