import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import ogImage from '../../public/assets/images/vrerv-1600x900.png'

import { AppConfig } from '@/utils/AppConfig';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  /** schema.org payload rendered as JSON-LD. */
  jsonLd?: Record<string, unknown>;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
        {props.jsonLd && (
          <script
            type="application/ld+json"
            key="jsonld"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(props.jsonLd) }}
          />
        )}
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: router.locale || AppConfig.locale,
          site_name: AppConfig.site_name,
          images: [
            {
              url: ogImage.src
            }
          ]
        }}
      />
    </>
  );
};

export { Meta };
