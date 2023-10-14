import React, { useState } from "react";
import TabLayout from "@/components/drawing/TabLayout";

const MainPage = () => {

  const [selectedTabIndex, _] = useState(0);

  return <>
    <h1>Membership</h1>
    <TabLayout control={
      () => <></>
    } >
      <>
        {selectedTabIndex === 0 && <div>We are preparing service. Thank you!</div>}
      </>
    </TabLayout>
  </>
}

export default MainPage