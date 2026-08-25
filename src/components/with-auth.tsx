import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { userAtom } from '@/mentalcare/states';
// @ts-ignore
import { session } from '@/lib/api/auth';

type WithAuthProps = {
  authPath: string;
  children: ReactNode;
  locale?: string;
  requireAuth?: boolean;
};

export const WithAuth = ({
  authPath,
  children,
  locale,
  requireAuth = true,
}: WithAuthProps) => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setAuthenticated(false);

    const verifySession = async () => {
      let userId: string | undefined;

      try {
        // @ts-ignore
        const { data } = await session();
        userId = data?.session?.user?.id;
      } catch {
        // A failed session request is treated as signed out.
      }

      if (cancelled) return;

      if (userId || !requireAuth) {
        setAuthenticated(true);
      } else if (!router.pathname.startsWith(authPath)) {
        await router.replace(authPath, authPath, { locale });
      }
    };

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [authPath, locale, requireAuth, router, router.pathname, user.valid]);

  return authenticated ? <>{children}</> : null;
};
