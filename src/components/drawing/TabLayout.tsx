import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from "react";

import LayeredContainer from "@/components/drawing/LayeredContainer";

const TabLayout = ({ children, control }: { children: ReactElement[] | ReactElement, control: FunctionComponent<any> }) => {

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    handleResize();

    function handleResize() {
      const landscape = window.innerWidth > window.innerHeight;
      setDimensions({
        width: document.documentElement.clientWidth - (landscape ? 100 : 5),
        height: document.documentElement.clientHeight - (landscape ? 5 : 100)
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>
    <style jsx>{`
        .tab-layout {
          display: flex;
          flex-direction: row;  /* Default to row (controls on the right) */
          justify-content: space-between;
          gap: 20px;
        }

        .controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          padding: 10px;
        }

        /* Media query for screen orientation */
        @media (orientation: portrait) {
          .tab-layout {
            flex-direction: column;  /* Change to column (controls on the top) */
            align-items: center;  /* Center the canvas and controls */
          }

          .controls {
            flex-direction: row;  /* Change to row */
            width: 100%;
          }
        }
      `}</style>

    <div className="tab-layout">
      <LayeredContainer
        width={dimensions.width}
        height={dimensions.height}>
        {children}
      </LayeredContainer>
      <div className="controls">
        { // @ts-ignore
          control().props.children }
      </div>
    </div>
  </>
}

export default TabLayout