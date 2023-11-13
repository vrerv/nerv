import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState
} from "react";

// @ts-ignore
import LayeredContainer from '@/components/drawing/LayeredContainer';

interface TabLayoutControlProps {
  tabHeight: number;
  contentDimensions: {
    width: number;
    height: number;
  };
}

export type TabLayoutProps = {
  children: ReactElement[] | ReactElement,
  control: FunctionComponent<TabLayoutControlProps>,
  actionHeight?: number;
}

const TabLayout = ({ children, control, actionHeight = 120 }: TabLayoutProps) => {

  const TAB_HEIGHT = actionHeight;
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    handleResize();

    function handleResize() {
      const landscape = window.innerWidth >= window.innerHeight;
      setDimensions({
        width: document.documentElement.clientWidth - (landscape ? TAB_HEIGHT : 5),
        height: document.documentElement.clientHeight - (landscape ? 5 : TAB_HEIGHT)
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
          /*justify-content: space-between;*/
          justify-content: flex-end;
          width: 100%;
          height: 100%;
        }

        .controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          min-height: 100px;
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
            height: 100%;
          }
        }
      `}</style>

    <div className="tab-layout">
      <LayeredContainer
        width={dimensions.width}
        height={dimensions.height}>
        {dimensions.width > 0 && children}
      </LayeredContainer>
      <div className="controls">
        { // @ts-ignore
          dimensions.width > 0 && control({ tabHeight: TAB_HEIGHT, contentDimensions: dimensions }).props.children
        }
      </div>
    </div>
  </>
}

export default TabLayout