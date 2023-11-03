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
import { userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
import { GetStaticPaths } from "next";
export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

type LoginOrSignup = {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<LoginOrSignup> = async ({}) => {

  return {
    paths: ['login', 'signup'].map((slug) => ({ params: { slug: slug } })),
    fallback: false,
  }
}

export default function TabsDemo() {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  const slug = router.query.slug === 'login' ? 'login' : 'signup'
  const { t } = useTranslation('common')

  const [_user, setUser ] = useAtom(userAtom)
  const handleLogin = () => {
    setUser({valid: true, profile: { name: "Soonoh" }, accessToken: "INVALID"})
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
                                       onClick={() => handleLogin()}>{t(slug)}</Button>
          </div>
        </>
      } >
        <>
          {selectedTabIndex === 0 && <div className={'w-full h-full p-4'}>

            <h1 className="text-2xl">{t('membership')}</h1>
            <div className="inline-flex items-baseline w-full pt-4">
              {t('membershipDescription')}
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t(slug)}</CardTitle>
                <CardDescription>
                  TODO: description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Email</Label>
                  <Input id="name" defaultValue="" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Password</Label>
                  <Input id="username" defaultValue="" />
                </div>
              </CardContent>
            </Card>
          </div>}
        </>
      </TabLayout>
    </div>
  )
}
