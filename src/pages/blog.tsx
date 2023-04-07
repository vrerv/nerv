import Link from 'next/link';

import { Meta } from '@/layouts/Meta'
import { Main } from '@/templates/Main'

const Blog = () => (
  <Main meta={<Meta title="VReRV - Blog" description="Blog site" />}>
    <p className="pt-16">
      공사중...
    </p>

    {[...Array(0)].map((_, index) => (
      <div
        className="my-4 w-full rounded-md border-2 border-gray-400 px-2 py-1"
        key={index}
      >
        <Link href={`/blog/blog-${index}`}>{`Blog - ${index}`}</Link>
      </div>
    ))}
  </Main>
);

export default Blog;
