import React, { useState } from 'react';

const TouchButton = ({className, onClick, disabled, children}) => {

  const handleClick = (e) => {
    onClick(e)
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
    >
      {children}
    </button>
  );
};

export default TouchButton;
