import React, { useState } from 'react';

const TouchButton = ({className, onClick, disabled, children, ...props}) => {

  const [clicked, setClicked] = useState(false)

  const handleClick = async (e) => {
    if (clicked) return;
    setClicked(true)
    try {
      await onClick(e)
    } finally {
      setTimeout(() => setClicked(false), 300)
    }
  };

  const handleTouchStart = (e) => {
  };

  const handleTouchMove = (e) => {
  };

  const handleTouchEnd = (e) => {
    e.target.click()
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default TouchButton;
