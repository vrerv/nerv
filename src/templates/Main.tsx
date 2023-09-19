import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from 'next-i18next';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {

  const { t } = useTranslation('common')
  const router = useRouter()
  const theme = useTheme()
  const [logoImage, setLogoImage] = useState("/assets/images/vrerv-logo.svg")
  console.log("router.asPath", router.asPath, theme.resolvedTheme)

  const toggleTheme = (_: any) => {
    theme.resolvedTheme === 'dark' ? theme.setTheme('light') : theme.setTheme('dark')
  }

  useEffect(() => {
    const image = theme.resolvedTheme === "dark" ? "/assets/images/vrerv-logo-light-blue.svg" : "/assets/images/vrerv-logo.svg"
    setLogoImage(image)
  }, [theme])


  return (
    <div>
      {props.meta}
      <div className="pt-16" />
      <div className="py-0 text-xl max-w-full">
          <div className="flex justify-center items-center w-full">
            <div className="bg-bg-100 dark:bg-bg-900 w-full md:w-2/3 lg:w-1/2">
              {props.children}
            </div>
          </div>
      </div>
      <div className="pt-16" />
      <div className="py-5 text-lg md:text-xl w-full">
        <div className="text-primary-700 fixed top-0 z-10 w-full">
          <div className="flex justify-center items-center">
            <div className="bg-bg-50 dark:bg-bg-800 flex justify-start w-full md:w-2/3 lg:w-1/2">
              <ul className="flex h-16 items-center sm:space-x-2">
                <li className="flex-grow flex-shrink pl-4">
                  <Image src={logoImage}
                         alt={AppConfig.title} width={24} height={24}
                         className="cursor-pointer"
                         onClick={toggleTheme} />
                </li>
                <li className="flex-grow flex-shrink"><Link href="/hello"
                                                            className="block px-4 py-2 hover:bg-gray-200 no-underline text-decoration-none">{t('hello')}</Link>
                </li>
                <li className="flex-grow flex-shrink"><Link href="/blog"
                                                            className="px-4 py-2 hover:bg-gray-200 no-underline text-decoration-none">{t('blog')}</Link>
                </li>
                <li className="flex-grow flex-shrink"><Link href="/membership"
                                                            className="block px-4 py-2 hover:bg-gray-200 no-underline"><i
                  className="fab fa-github mr-2"></i>{t('membership')}</Link></li>
                {/*
                      <li className="flex-grow flex-shrink"><a href="#services" className="px-4 py-2 hover:bg-gray-800 no-underline text-decoration-none">도전</a></li>
                      <li className="flex-grow flex-shrink"><a href="#contact" className="px-4 py-2 hover:bg-gray-800 no-underline text-decoration-none">문의하기</a></li>
                      */}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-primary-700 fixed bottom-0 z-10 w-full">
          <div className="flex justify-center items-center">
            <div className="bg-bg-50 dark:bg-bg-800 flex justify-center w-full md:w-2/3 lg:w-1/2">
              <footer className="py-2 text-center text-sm">
                © Copyright {new Date().getFullYear()} {AppConfig.title}.{' '}
                <a href="https://github.com/vrerv">Github{' '}</a>
                <a href="https://vrerv.instatus.com/">(s)</a>{' '}
                {router.locales?.filter((locale) => locale !== router.locale).map((locale) => (
                  <span key={locale}><Link href={router.asPath} locale={locale}>({locale.toUpperCase()})</Link>{' '}</span>
                ))}
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Main };
