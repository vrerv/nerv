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
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import { userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
// @ts-ignore
import { login, updatePassword, signout } from "@/lib/api/auth";
export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

export default function TabsDemo({locale}: {locale: string;}) {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  const { t } = useTranslation('common')

  const [_user, setUser ] = useAtom(userAtom)

  const [error, setError] = useState('');
  const [request, setRequest] = useState({
    email: '',
    password: '',
    newPassword: '',
  });

  const handleLogin = async () => {

    const { data, error: errorRes } = await login(request);
    console.log("locale", locale, "data", data, 'errorRes', errorRes);
    if (errorRes) {
      setError(errorRes.message);
      return false;
    }
    setUser({valid: true, profile: { name: "", routines: [] }, accessToken: data.accessToken})
    return true;
  }
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    setError('');

    if (await handleLogin()) {
      const { data, error: errorRes } = await updatePassword(request);
      console.log("data", data, 'errorRes', errorRes);
      if (errorRes) {
        setError(errorRes.message);
        return;
      }
      await signout()
      setUser({valid: false, profile: { name: "", routines: [] }, accessToken: null})
    }

  };

  const handleAccountChange = (event: any) => {
    setRequest({ ...request, email: event.target.value });
  };
  const handlePasswordChange = (event: any) => {
    setRequest({ ...request, password: event.target.value });
  };
  const handleNewPasswordChange = (event: any) => {
    setRequest({ ...request, newPassword: event.target.value });
  };

  return (
    <div className={'flex flex-col items-start p-0'}>
      <form method="POST" onSubmit={handleSubmit}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={'link'}
                                       type="button"
                                       onClick={() => router.back()}>{t('back')}</Button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><Button variant={'default'}
                                       type="submit" >{t('updatePassword')}</Button></div>
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
                <CardTitle>{t('updatePassword')}</CardTitle>
                <CardDescription>
                  {/* TODO: description */}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input id="email"
                           type="email"
                           required
                           autoComplete="email"
                           onChange={handleAccountChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input id="password"
                           type="password"
                           required
                           minLength={8}
                           maxLength={32}
                           autoComplete="current-password"
                           onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-password">{t('newPassword')}</Label>
                    <Input id="new-password"
                           type="password"
                           required
                           minLength={8}
                           maxLength={32}
                           autoComplete="new-password"
                           onChange={handleNewPasswordChange} />
                  </div>
                  <span className="text-red-500">{error}</span>
              </CardContent>
            </Card>
          </div>}
        </>
      </TabLayout>
      </form>
    </div>
  )
}
