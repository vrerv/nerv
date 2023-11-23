import React from "react";
import { Button } from "@/components/ui/button";
import waterCup from "@/mentalcare/components/water-cup-260x260.svg";

export const DrinkWater = ({record, records}: {record: (value: string) => () => void; records: any[]}) => {

  return <>
    <div className="grid grid-cols-4 gap-2 p-4">
      {[1,2,3,4,5,6,7,8].map(it =>
        <Button variant={"link"}
                onClick={record('200')}
                className={`h-full pt-4 pb-4 bg-blue-400`}
                disabled={records.length >= it}><img src={waterCup.src} /></Button>)}
    </div>
  </>
}