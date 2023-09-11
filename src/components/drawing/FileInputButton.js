import React from 'react';

const FileInputButton = ({ label = "File", type, accept, onFileChange }) => {
  return (
    <>
      <style jsx>{`
      .small-button {
        padding: 2px;
        background-color: blue;
        color: white;
        border: none;
        cursor: pointer;
        display: inline-block;
      }
      
      .hidden-input {
        display: none;
      }
      `}</style>
    <div>
      <input
        type={type}
        accept={accept}
        id="fileInput"
        className="hidden-input"
        onChange={onFileChange}
      />
      <label htmlFor="fileInput" className="small-button">
        {label}
      </label>
    </div>
    </>
  );
};

export default FileInputButton;
