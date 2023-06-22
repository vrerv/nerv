import Link from 'next/link';

import { Meta } from '@/layouts/Meta'
import { Main } from '@/templates/Main'
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx'

const Blog = ({ posts }) => (
  <Main meta={<Meta title="VReRV - Blog" description="Blog site" />}>
    <div className="pt-16" />

    {posts.map((post, index) => (
      <div
        className="my-4 w-full px-2 py-1"
        key={post.slug}
      >
        <Link href={`/blog/${post.slug}`}>{`${post.title}`}</Link>
      </div>
    ))}
  </Main>
);


export async function getStaticProps({ params }) {
  const allPosts = await getAllFilesFrontMatter('blog')
  return { props: { posts: allPosts } };
}

export default Blog;
