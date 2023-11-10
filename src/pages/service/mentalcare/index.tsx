import TabLayout from "@/components/drawing/TabLayout"
import { useState } from "react";
import { userAtom } from "@/mentalcare/states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";


const IndexPage = () => {

  const router = useRouter();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [user] = useAtom(userAtom)
  if (user.profile?.routines?.length === 0) {
    router.push("./mentalcare/first")
    return
  }

  return <>
    <h1>Mental Care</h1>
    <TabLayout control={
      () => <>
        <div className="p-2"><button onClick={() => setSelectedTabIndex(0) }>도전하기</button></div>
        <div className={"flex-grow"} />
        <div className="p-2"><button onClick={() => setSelectedTabIndex(1) }>도움받기</button></div>
        <div className="p-2"><button onClick={() => setSelectedTabIndex(2) }>도와주기</button></div>
      </>
    } >
      <>
        {selectedTabIndex === 0 && <div>tab1</div>}
        {selectedTabIndex === 1 && <div>tab2</div>}
        {selectedTabIndex === 2 && <div>tab3</div>}
      </>
    </TabLayout>
  </>
}

export default IndexPage