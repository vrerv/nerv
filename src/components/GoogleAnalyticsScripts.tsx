import React from "react"
import Script from "next/script"

export interface GoogleAnalyticsScriptsProps {
  gaId: string | undefined;
}

export const GoogleAnalyticsScripts = ({ gaId }: GoogleAnalyticsScriptsProps) => {

  return <>
    {/* Following nextjs doc - https://nextjs.org/docs/messages/next-script-for-ga */}
    { gaId &&
      <div>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></Script>
        <Script id="google-analytics">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${gaId}');
        `}
        </Script>
      </div>}
  </>
}

export default GoogleAnalyticsScripts