import Link from 'next/link';
import type { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';
import { useRouter } from "next/router";

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {

  const router = useRouter()
  console.log(router.asPath)

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}

      <div className="mx-auto max-w-screen-md">
        <header className="bg-white text-purple-700 fixed top-0 z-10 w-full">
          <nav className="container mx-auto flex justify-start">
            <ul className="flex h-16 items-center">
              <li className="flex-grow flex-shrink"><Link href="/hello"
                                                       className="block px-4 py-2 hover:bg-gray-200 no-underline text-decoration-none">안녕하세요</Link>
              </li>
              <li className="flex-grow flex-shrink"><Link href="/blog"
                                                       className="px-4 py-2 hover:bg-gray-200 no-underline text-decoration-none">블로그</Link>
              </li>
              <li className="flex-grow flex-shrink"><Link href="https://github.com/vrerv"
                                                       className="block px-4 py-2 hover:bg-gray-200 no-underline"><i
                className="fab fa-github mr-2"></i>GitHub</Link></li>
              {/*
                    <li className="flex-grow flex-shrink"><a href="#services" className="px-4 py-2 hover:bg-gray-800 no-underline text-decoration-none">도전</a></li>
                    <li className="flex-grow flex-shrink"><a href="#contact" className="px-4 py-2 hover:bg-gray-800 no-underline text-decoration-none">문의하기</a></li>
                    */}
            </ul>
          </nav>
        </header>

        <main className="content py-5 text-xl">{props.children}</main>

        <footer className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}. Made with{' '}
          <a href="https://creativedesignsguru.com">CreativeDesignsGuru</a>.
          {/*
         * PLEASE READ THIS SECTION
         * I'm an indie maker with limited resources and funds, I'll really appreciate if you could have a link to my website.
         * The link doesn't need to appear on every pages, one link on one page is enough.
         * For example, in the `About` page. Thank you for your support, it'll mean a lot to me.
         */}
        </footer>
      </div>
    </div>
  );
}

export { Main };
