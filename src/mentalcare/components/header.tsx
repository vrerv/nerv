import { useEffect, useState } from "react";

export const MentalCareHeader = ({locale}: { locale: string; }) => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000);

    return () => {
      window.clearInterval(timer);
    }
  }, [])
  return <div className={"flex w-full justify-between items-end"}>
    <h1 className={"text-2xl"}>Mental Care</h1>
    <span className={"h-full align-bottom font-mono"}>{now.toLocaleTimeString(locale)}</span>
  </div>
}