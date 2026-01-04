import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";

const ImageCanvas = forwardRef(({ dimensions, hidden, alpha = 1.0 }, ref) => {
  // ... your existing state variables and functions
  const [image, setImage] = useState(null);
  const bgCanvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    handleImageUpload: handleImageUpload,
    setImage: async (image) => {
      return await drawImage(image);
    },
  }));

  const drawImage = async (image) => {
    setImage(image);
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (image) {
      await new Promise((resolve, reject) => {

        const img = new Image();
        img.src = image;
        img.onload = () => {
          // Calculate aspect ratio
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio);

          // Calculate new dimensions based on aspect ratio
          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;

          // Draw the image on the canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = alpha
          ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
          resolve();
        };
        img.onerror = (e) => reject(e);
      })
    }
  };

  const handleImageUpload = async (files) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      drawImage(reader.result).then(() => console.log('Image loaded'));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/*image && <img src={image} alt="Background" width={dimensions.width} height={dimensions.height} />*/}
      <canvas
        hidden={hidden}
        ref={bgCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
      ></canvas>
    </>
  );
});

ImageCanvas.displayName = 'ImageCanvas';

export default ImageCanvas;
