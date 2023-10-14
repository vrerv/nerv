// LayeredContainer.js
import React from 'react';

const LayeredContainer = ({ children, width, height }) => {
  return (
    <>
      <style jsx>{`
      .layered-container {
        position: relative;
      }
      
      .layered-item {
        position: absolute;
      }
      `}</style>
    <div className="layered-container" style={{width: width, height: height}}>
      {React.Children.map(children, (child, index) => {
        return (
          <div className="layered-item w-full h-full" style={{ zIndex: index }}>
            {child}
          </div>
        );
      })}
    </div>
    </>
  );
};

export default LayeredContainer;
