import Link from 'next/link';

import { Meta } from '@/layouts/Meta'
import { Main } from '@/templates/Main'
// @ts-ignore
import { getAllFilesFrontMatter } from '@/lib/mdx'
// @ts-ignore
import { getOgDescription } from '@/lib/og-helper'
// @ts-ignore
import formatDate from '@/lib/utils/formatDate'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Blog = (params: any) => (
  <Main meta={<Meta title="VReRV - Blog" description={getOgDescription("기술 블로그", params.posts.map((post: any) => post.tags))} />}>

    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-[32px] font-bold tracking-tighter2 md:text-[38px]">Blog</h1>
      <ul className="mt-10 divide-y divide-ink-200 dark:divide-ink-800">
        {params.posts.map((post: any) => (
          <li className="group py-8 first:pt-0" key={post.slug}>
            <div className="text-[12px] uppercase tracking-widest text-ink-500">
              {post.date ? formatDate(post.date, params.locale) : ''}
              {post.tags?.[0] ? ` · ${post.tags[0]}` : ''}
            </div>
            <h2 className="mt-2 text-[21px] font-semibold leading-snug tracking-tighter2">
              <Link className="no-underline group-hover:text-primary-600" href={`/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            {post.summary && (
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-400">
                {post.summary}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  </Main>
);


export async function getStaticProps({ locale }: { locale: any }) {

  const allPosts = await getAllFilesFrontMatter('blog', '/' + locale)

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common',])),
      posts: allPosts, locale: locale
    }
  };
}

export default Blog;
