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
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";
import { userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
// @ts-ignore
import { sendResetPasswordEmail, updatePassword, signout } from "@/lib/api/auth";
import { useToast } from "@/components/ui/use-toast";
export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

export default function TabsDemo({locale}: {locale: string;}) {

  const { toast } = useToast()
  const router = useRouter();
  const { t } = useTranslation('common')

  const [_user, setUser ] = useAtom(userAtom)

  const [error, setError] = useState('');
  const [reset, setReset] = useState(false);
  const [request, setRequest] = useState({
    email: '',
    redirectTo: `http://localhost:3000/${locale}/membership/auth/reset-password/?reset=true`,
    password: '',
    newPassword: '',
  });

  const handleSendResetPasswordEmail = async () => {

    try {
      await sendResetPasswordEmail(request);
      toast({
        title: t('resetPassword'),
        description: t('msgEmailSentForResetPassword')
      })
    } catch (e) {
      console.log("error", e);
      setError(e?.toString() || '')
    }
  }

  const handleUpdatePassword = async () => {
    const { data, error: errorRes } = await updatePassword(request);
    console.log("locale", locale, "data", data, 'errorRes', errorRes);
    if (errorRes) {
      setError(errorRes.message);
      return;
    }
    await signout()
    setUser({valid: false, profile: { name: "", routines: [] }, accessToken: null})
    await router.push('/membership/auth/login/')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    setError('');
    if (request.password !== request.newPassword) {
      setError(t('passwordConfirmFailed'))
      return;
    }
    if (reset) {
      await handleUpdatePassword()
    } else {
      await handleSendResetPasswordEmail()
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

  useEffect(() => {
    const { reset } = router.query
    console.log('reset', reset, router.query)
    if (reset) {
      setReset(true);
    }
  }, [router]);

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
          <div className={'w-full h-full p-4'}>

            <h1 className="text-2xl">{t('membership')}</h1>
            <div className="inline-flex items-baseline w-full pt-4">
              {t('membershipDescription')}
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t('resetPassword')}</CardTitle>
                <CardDescription>
                  {/* TODO: description */}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                { !reset &&
                  <div className="space-y-1">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input id="email"
                           type="email"
                           required
                           autoComplete="email"
                           onChange={handleAccountChange} />
                  </div>}
                {reset && <><div className="space-y-1">
                    <Label htmlFor="new-password">{t('newPassword')}</Label>
                    <Input id="new-password"
                           type="password"
                           required
                           minLength={8}
                           maxLength={32}
                           autoComplete="new-password"
                           onChange={handlePasswordChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                    <Input id="confirm-password"
                           type="password"
                           required
                           minLength={8}
                           maxLength={32}
                           autoComplete="confirm-password"
                           onChange={handleNewPasswordChange} />
                  </div>
                </>}
                  <span className="text-red-500">{error}</span>
              </CardContent>
            </Card>
          </div>
        </>
      </TabLayout>
      </form>
    </div>
  )
}
