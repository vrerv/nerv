import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
// @ts-ignore
import { MDXComponents, MDXLayoutRenderer } from "../../components/MDXComponents";
// @ts-ignore
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from "@/lib/mdx";
// @ts-ignore
import { getOgDescription } from '@/lib/og-helper'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

type IBlogUrl = {
  slug: string[];
  post: any;
  prev: any;
  next: any;
  authorDetails: any[];
  locale: any;
};

export const getStaticPaths: GetStaticPaths<IBlogUrl> = async ({locales}) => {

  const paths = (locales || []).flatMap((locale) => {

    const posts = getFiles('blog', locale)
    return posts.map((p: any) => ({
      params: { slug: formatSlug(p).split('/') }, locale: locale,
    }))
  })

  return {
    paths: paths,
    fallback: false,
  }
};

export const getStaticProps: GetStaticProps<IBlogUrl, IBlogUrl> = async ({
                                                                           params, locale,
                                                                         }) => {

  const allPosts = await getAllFilesFrontMatter('blog', locale)
  const postIndex = allPosts.findIndex((post: any) => formatSlug(post.slug) === params?.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('blog', params?.slug.join('/'), locale)
  const authorList = post.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author: any) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  console.log("post", post)
  return {
    props: {
      ...(await serverSideTranslations(locale!!, ['common',])),
      slug: params!.slug,
      post: post,
      authorDetails: authorDetails,
      prev: prev,
      next: next,
      locale: locale,
    },
  };
};

const Blog = (props: InferGetStaticPropsType<typeof getStaticProps>) => {

  const { mdxSource, toc, frontMatter } = props.post;
  const { authorDetails, prev, next } = props;
  return (
    <Main meta={<Meta title={"VReRV - Blog - " + frontMatter.title} description={getOgDescription(frontMatter.summary, frontMatter.tags)} />}>
      <div className="p-4">

        <MDXLayoutRenderer layout={frontMatter.layout || 'PostSimple'} mdxSource={mdxSource} toc={toc}
                           locale={props.locale}
                           frontMatter={frontMatter}
                           authorDetails={authorDetails}
                           prev={prev}
                           next={next}
        />
      </div>
    </Main>
  );
};

export default Blog;