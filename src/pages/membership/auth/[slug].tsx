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
import { GetStaticPaths } from "next";
// @ts-ignore
import { login, signup } from "@/lib/api/auth";
export async function getStaticProps({ locale }: { locale: any }) {
  return {
    props: {
      locale: locale,
      ...(await serverSideTranslations(locale, ['common',])),
    },
  }
}

type LoginOrSignup = {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<LoginOrSignup> = async ({locales}) => {

  const paths = (locales || []).flatMap((locale) => {

    return ['login', 'signup'].map((slug) => ({ params: { slug: slug }, locale: locale }))
  });

  return {
    paths: paths,
    fallback: false,
  }
}

export default function TabsDemo({locale}: {locale: string;}) {

  const [selectedTabIndex, _] = useState(0);
  const router = useRouter();
  const slug = router.query.slug === 'login' ? 'login' : 'signup'
  const reverseLink = router.query.slug === 'login' ? 'signup' : 'login'
  const { t } = useTranslation('common')

  const [_user, setUser ] = useAtom(userAtom)

  const [error, setError] = useState('');
  const [request, setRequest] = useState({
    email: '',
    password: '',
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    setError('');

    const fn = slug === 'login' ? login : signup;
    const { data, error: errorRes } = await fn(request);
    console.log("data", data, 'errorRes', errorRes);
    if (errorRes) {
      setError(errorRes.message);
      return;
    }

    setUser({valid: true, profile: { name: "", routines: [] }, accessToken: data.accessToken})
    await router.push("/membership/main", '/membership/main', { locale: locale })
  };

  const handleAccountChange = (event: any) => {
    setRequest({ ...request, email: event.target.value });
  };
  const handlePasswordChange = (event: any) => {
    setRequest({ ...request, password: event.target.value });
  };

  return (
    <div className={'flex flex-col items-start p-0'}>
      <form method="POST" onSubmit={handleSubmit}>
      <TabLayout control={
        () => <>
          <div className="p-2"><Button variant={'link'}
                                       type="button"
                                       onClick={() => router.push('/', '/', { locale: locale })}>{t('home')}</Button></div>
          <div className={"flex-grow"} />
          <div className="p-2"><Button variant={'default'}
                                       type="submit" >{t(slug)}</Button></div>
          <div className="p-2"><Button variant={'default'}
                                       type="button"
                                       onClick={() => router.push(`/membership/auth/${reverseLink}`, `/membership/auth/${reverseLink}`, { locale: locale })} >{t(reverseLink)}</Button></div>
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
                  {/* TODO: description */}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email"
                         type="email"
                         required
                         autoComplete="email"
                         onChange={handleAccountChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Input id="password"
                         type="password"
                         required
                         minLength={8}
                         maxLength={32}
                         autoComplete="current-password"
                         onChange={handlePasswordChange} />
                </div>
                <span className="text-red-500">{error}</span>
                <div className="p-2"><Button variant={"link"}
                                             type="button"
                                             onClick={() => router.push(`/membership/auth/reset-password`, `/membership/auth/reset-password`, { locale: locale })}>{t("resetPassword")}</Button>
                </div>
              </CardContent>
            </Card>
          </div>}
        </>
      </TabLayout>
      </form>
    </div>
  )
}
