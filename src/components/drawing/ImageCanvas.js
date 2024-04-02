import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";

const ImageCanvas = forwardRef((props, ref) => {
  // ... your existing state variables and functions
  const dimensions = props.dimensions
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clear: clearCanvas,
    handleImageUpload: handleImageUpload,
    setImage: setImage,
  }));

  const drawImage = () => {
    const canvas = bgCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (image) {
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
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    drawImage();
  }, [image]);

  const handleImageUpload = (files) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/*image && <img src={image} alt="Background" width={dimensions.width} height={dimensions.height} />*/}
      <canvas
        ref={bgCanvasRef}
        width={dimensions.width}
        height={dimensions.height}
      ></canvas>
    </>
  );
});

export default ImageCanvas;
