import TabLayout from "@/components/drawing/TabLayout"
import { useState } from "react";


const IndexPage = () => {

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return <>
    <h1>Mental Care</h1>

    <TabLayout control={
      () => <>
        <button onClick={() => setSelectedTabIndex(0) }>도전하기</button>
        <button onClick={() => setSelectedTabIndex(1) }>도움받기</button>
        <button onClick={() => setSelectedTabIndex(2) }>도와주기</button>
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