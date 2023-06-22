import Link from 'next/link';

import { Meta } from '@/layouts/Meta'
import { Main } from '@/templates/Main'
// @ts-ignore
import { getAllFilesFrontMatter } from '@/lib/mdx'

const Blog = (params: any) => (
  <Main meta={<Meta title="VReRV - Blog" description="Blog site" />}>

    <div className="p-4" >
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


export async function getStaticProps() {
  const allPosts = await getAllFilesFrontMatter('blog')
  return { props: { posts: allPosts } };
}

export default Blog;
