import React, { useState } from 'react';

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
            position: fixed; /* Changed from absolute to fixed */
            top: 50%; /* Center vertically */
            left: 50%; /* Center horizontally */
            transform: translate(-50%, -50%); /* Necessary for precise centering */
            border: 1px solid #ccc;
            z-index: 1000; /* High z-index to make sure it's above other elements */
          }

          .dropdown-item {
            padding: 8px;
            cursor: pointer;
            text-align: center;
          }

          .dropdown-item:hover {
            opacity: 0.7;
          }
          `}</style>
      <div className="color-selector" style={{ backgroundColor: selectedColor }} >
        <button onClick={toggleDropdown} className="dropdown-button">
          {selectedColor}
        </button>
        {isOpen && (
          <div className="dropdown-menu">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => handleSelect(color)}
                className="dropdown-item"
                style={{ backgroundColor: color.code }}
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
