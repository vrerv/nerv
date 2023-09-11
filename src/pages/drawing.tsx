import { useEffect, useRef, useState } from "react";
import TouchButton from "@/components/drawing/TouchButton";
import ImageCanvas from "@/components/drawing/ImageCanvas";
import LayeredContainer from "@/components/drawing/LayeredContainer";
import FileInputButton from "@/components/drawing/FileInputButton";
import ColorSelector from "@/components/drawing/ColorSelector";

const Drawing = (_: any) => {
  const background = "#ffffff05";
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    handleResize();

    function handleResize() {
      console.log("window.innerWidth", window.innerWidth, document.documentElement.clientWidth, "window.innerHeight", window.innerHeight);
      const landscape = window.innerWidth > window.innerHeight;
      setDimensions({
        width: document.documentElement.clientWidth - (landscape ? 100 : 5),
        height: document.documentElement.clientHeight - (landscape ? 5 : 100)
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const toggleFullscreen = (_:any) => {
    const canvas = document.documentElement
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }

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
    ctx.strokeStyle = color;

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

  const handleUploadImage = (e) => {
    bgRef.current.handleImageUpload(e);
  }

  return (
    <>
      <style jsx>{`
        .drawing {
          display: flex;
          flex-direction: row;  /* Default to row (controls on the right) */
          justify-content: space-between;
          gap: 20px;
        }
        
        canvas {
          border: 1px solid #ccc;
        }

        .controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-evenly;
          padding: 10px;
        }

        /* Media query for screen orientation */
        @media (orientation: portrait) {
          .drawing {
            flex-direction: column;  /* Change to column (controls on the top) */
            align-items: center;  /* Center the canvas and controls */
          }

          canvas {
            //margin-bottom: 20px;  /* Separate canvas from controls */
          }

          .controls {
            flex-direction: row;  /* Change to row */
            width: 100%;
          }
        }
      `}</style>
      <div className="drawing">

        <LayeredContainer
          width={dimensions.width}
          height={dimensions.height}>
            <div style={{ background: "#ffffff", width: dimensions.width, height: dimensions.height }}></div>
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
        </LayeredContainer>
        <div className="controls">
          <FileInputButton
            type="file"
            accept="image/*"
            onFileChange={(e) => { handleUploadImage(e); }}
          />
          <ColorSelector selectedColor={color} setSelectedColor={setColor} />
          <TouchButton onClick={clearCanvas}>Clear</TouchButton>
          <TouchButton onClick={toggleFullscreen}>Full</TouchButton>
        </div>
      </div>
    </>
  );
};


export default Drawing;