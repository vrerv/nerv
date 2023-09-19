import React, { useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";

const MainPage = () => {

  const [selectedTabIndex, _] = useState(0);

  return <>
    <h1>Mental Care</h1>
    <TabLayout control={
      () => <></>
    } >
      <>
        {selectedTabIndex === 0 && <div>준비중입니다</div>}
      </>
    </TabLayout>
  </>
}

export default MainPage