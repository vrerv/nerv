import Link from 'next/link';

import { Meta } from '@/layouts/Meta'
import { Main } from '@/templates/Main'
// @ts-ignore
import { getAllFilesFrontMatter } from '@/lib/mdx'
// @ts-ignore
import { getOgDescription } from '@/lib/og-helper'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Blog = (params: any) => (
  <Main meta={<Meta title="VReRV - Blog" description={getOgDescription("기술 블로그", params.posts.map((post: any) => post.tags))} />}>

    <div className="p-4 pl-8" >
      {params.posts.map((post: any) => (
        <li
          className="my-4 w-full px-2 py-1"
          key={post.slug}
        >
          <Link className="text-2xl" href={`/blog/${post.slug}`}>{`${post.title}`}</Link>
        </li>
      ))}
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
