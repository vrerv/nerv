import React, {
  useRef,
  useState
} from "react";
// @ts-ignore
import TouchButton from '@/components/drawing/TouchButton';
// @ts-ignore
import ImageCanvas from '@/components/drawing/ImageCanvas';
// @ts-ignore
import FileInputButton from '@/components/drawing/FileInputButton';
// @ts-ignore
import ColorSelector from '@/components/drawing/ColorSelector';
import TabLayout from "@/components/drawing/TabLayout";

const Drawing = (_: any) => {
  const background = "#ffffff05";
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState({name: 'Black', code: '#000000'});
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  const handleStart = (e:any) => {
    setDrawing(true);
    draw(e);
  };

  const handleEnd = (_:any) => {
    setDrawing(false);
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    ctx.beginPath();
  };

  /*
  const toggleFullscreen = (_:any) => {
    const canvas = document.documentElement
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }*/

  const draw = (e: any) => {
    if (!drawing) return;

    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.touches) { // If this is a touch event
      const touch = e.touches[e.touches.length - 1]
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
      e.preventDefault(); // Prevent scrolling
    } else { // If this is a mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = color.code;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const bgRef = useRef(null);

  const handleUploadImage = (e: Event) => {
    // @ts-ignore
    bgRef.current.handleImageUpload(e);
  }

  const downloadCanvasAsPng = (canvas: HTMLCanvasElement, filename: string) => {
    // Convert the canvas to a data URL
    const imageURL = canvas.toDataURL('image/png');

    // Create an anchor tag for downloading
    const downloadLink = document.createElement('a');
    downloadLink.href = imageURL;
    downloadLink.download = filename;

    // Append the link to the body (required for Firefox)
    document.body.appendChild(downloadLink);

    // Trigger the download
    downloadLink.click();

    // Clean up: remove the link from the body
    document.body.removeChild(downloadLink);
  }

  const handleDownload = () => {
    downloadCanvasAsPng(canvasRef.current!, "hi")
  }

  return (
    <>
      <style jsx>{`
        
        canvas {
          border: 1px solid #ccc;
        }
        /* Media query for screen orientation */
        @media (orientation: portrait) {

          canvas {
            //margin-bottom: 20px;  /* Separate canvas from controls */
          }
        }
      `}</style>
      <TabLayout control={
        ({ contentDimensions }) => {

          setDimensions(contentDimensions)
          return <>
            <FileInputButton className={'p-4'}
              type="file"
              accept="image/*"
              onFileChange={(e: Event) => { handleUploadImage(e); }}
            />
            <ColorSelector className={'p-4'} selectedColor={color} setSelectedColor={setColor} />
            <TouchButton className={'p-4'} onClick={clearCanvas}>Clear</TouchButton>
            {/*<TouchButton className={'p-4'} onClick={toggleFullscreen}>Full</TouchButton>*/}
            <TouchButton className={'p-4'} onClick={handleDownload}>Download</TouchButton>
          </>}
      } >
        <div style={{
          background: "#ffffff",
          width: dimensions.width,
          height: dimensions.height
        }} />
        <ImageCanvas ref={bgRef} dimensions={dimensions} />
        <canvas
          ref={canvasRef}
          style={{ background: background }}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseMove={draw}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchMove={draw}
        ></canvas>
      </TabLayout>
    </>
  );
};


export default Drawing;