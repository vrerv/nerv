import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// @ts-ignore - plain JS module
import { getAllFilesFrontMatter } from '@/lib/mdx';

export { Home as default } from './hello';

const LATEST_POST_COUNT = 3;

export async function getStaticProps({ locale }: { locale: string }) {
  const allPosts = await getAllFilesFrontMatter('blog', locale);

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'home'])),
      posts: allPosts.slice(0, LATEST_POST_COUNT),
      locale,
    },
  };
}
