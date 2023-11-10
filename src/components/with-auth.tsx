import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { userAtom } from '@/mentalcare/states';
// @ts-ignore
import { session } from '@/lib/api/auth';

type WithAuthProps = {
  whiteList: string[];
  authPath: string;
  children: JSX.IntrinsicAttributes;
  locale: string;
};

export const WithAuth = ({ whiteList, authPath, children, locale }: WithAuthProps) => {
  const router = useRouter();
  const [user] = useAtom(userAtom);

  const [authenticated, setAuthenticated] = useState(false);

  useEffect( () => {
    const pathName = router.pathname;

    console.log("locale", locale)
    // @ts-ignore
    session().then(({ data, error }) => {

      console.log("session: data", data, !!data?.session?.user?.id, "error", error)
      const newAuthenticated = whiteList.includes(pathName) || !!data?.session?.user?.id;
      // eslint-disable-next-line no-console
      console.log(
        'authenticated',
        newAuthenticated,
        'pathName',
        pathName,
        router.pathname,
        router.asPath,
        user.valid,
        'whiteList',
        whiteList,
        'locale', locale
      );
      setAuthenticated(newAuthenticated);
      if (!newAuthenticated && !pathName.startsWith(authPath)) {
        router.push(authPath, authPath, { locale: locale }).then((r) => r);
      }
    })
  }, [user, router]);
  return <>{authenticated && children}</>;
};
