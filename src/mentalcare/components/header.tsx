import { useSecondsTimer } from "@/mentalcare/hooks/use-seconds-timer";

export const MentalCareHeader = ({locale}: { locale: string; }) => {
  const now = useSecondsTimer()
  return <div className={"flex w-full justify-between p-4"}>
    <h1 className={"text-2xl"}>Mental Care</h1>
    <div className={'text-base'}>
      <span>{now.toLocaleDateString(locale, {year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short'})}</span><br/>
      <span className={"h-full align-bottom font-mono"}>{now.toLocaleTimeString(locale)}</span>
    </div>
  </div>
}