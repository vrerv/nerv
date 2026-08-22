import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { AppConfig } from "@/utils/AppConfig";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/hello")
  })

  return (
    <Main meta={<Meta title={AppConfig.title} description={AppConfig.description} />}>
    </Main>
  );
};

export default Index;

export async function getServerSideProps({locale}: {locale: string;}) {
  // make "HTTP/1.1 307 Temporary Redirect"
  return {
    redirect: {
      destination: `/${locale}/hello`,
      permanent: false,
    },
  }
}