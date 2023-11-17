import { useSecondsTimer } from "@/mentalcare/hooks/use-seconds-timer";

export const MentalCareHeader = ({locale}: { locale: string; }) => {
  const now = useSecondsTimer()
  return <div className={"flex w-full justify-between items-end"}>
    <h1 className={"text-2xl"}>Mental Care</h1>
    <span className={"h-full align-bottom font-mono"}>{now.toLocaleTimeString(locale)}</span>
  </div>
}