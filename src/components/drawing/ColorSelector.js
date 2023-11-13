import React, { useEffect, useState } from "react";

function invertColor(hex, bw) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + r.padStart(2, '0') + g.padStart(2, '0') + b.padStart(2, '0');
}

const ColorSelector = ({className, selectedColor, setSelectedColor}) => {

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
    setSelectedColor(color);
    setIsOpen(false);
  };

  const [gridWidthPx, setGridWidthPx] = useState(100);
  const [gridStyle, setGridStyle] = useState({});

  useEffect(() => {

    function handleResize() {

      if (window === undefined) return;

      const [innerWidth, innerHeight] = [document.documentElement.clientWidth, document.documentElement.clientHeight]
      const ratio = innerWidth / innerHeight;
      const columns = Math.ceil(Math.sqrt(colors.length * ratio));
      const rows = Math.ceil(colors.length / columns);

      setGridWidthPx(Math.floor((innerWidth - 100) / columns));

      setGridStyle({
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      });
    }

    handleResize()

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .dropdown-button {
          cursor: pointer;
        }
        .dropdown-menu {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 0px solid #ccc;
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
      <div className={className} style={{ backgroundColor: selectedColor.code }}>
        <button onClick={toggleDropdown} className="dropdown-button" style={{color: invertColor(selectedColor.code, true)}}>
          {selectedColor.name}
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
