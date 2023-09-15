import React, { useEffect, useState } from "react";

const ColorSelector = ({selectedColor, setSelectedColor}) => {

  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { name: 'Red', code: '#FF0000' },
    { name: 'Green', code: '#008000' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Orange', code: '#FFA500' },
    { name: 'Purple', code: '#800080' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Brown', code: '#A52A2A' },
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Gray', code: '#808080' },
    { name: 'Cyan', code: '#00FFFF' },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (color) => {
    setSelectedColor(color.name);
    setIsOpen(false);
  };

  const [gridWidthPx, setGridWidthPx] = useState(100);
  const [gridStyle, setGridStyle] = useState({});

  useEffect(() => {
    handleResize();

    function handleResize() {
      const { innerWidth, innerHeight } = window;
      const ratio = innerWidth / innerHeight;
      const columns = Math.ceil(Math.sqrt(colors.length * ratio));
      const rows = Math.ceil(colors.length / columns);

      setGridWidthPx(Math.floor((innerWidth - 100) / columns));

      setGridStyle({
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .color-selector {
          position: relative;
        }
        .dropdown-button {
          cursor: pointer;
        }
        .dropdown-menu {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 1px solid #ccc;
          z-index: 1000;
          display: grid;
        }
        .dropdown-item {
          padding: 8px;
          cursor: pointer;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .dropdown-item:hover {
          opacity: 0.7;
        }
      `}</style>
      <div className="color-selector" style={{ backgroundColor: selectedColor }}>
        <button onClick={toggleDropdown} className="dropdown-button">
          {selectedColor}
        </button>
        {isOpen && (
          <div className="dropdown-menu" style={gridStyle}>
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => handleSelect(color)}
                className="dropdown-item"
                style={{ width: gridWidthPx, height: gridWidthPx, backgroundColor: color.code }}
              >
                {color.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ColorSelector;
