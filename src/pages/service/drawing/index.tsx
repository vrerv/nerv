import React, { useRef, useState } from "react";
// @ts-ignore
import TouchButton from "@/components/drawing/TouchButton";
// @ts-ignore
import ImageCanvas from "@/components/drawing/ImageCanvas";
// @ts-ignore
import FileInputButton from "@/components/drawing/FileInputButton";
// @ts-ignore
import ColorSelector from "@/components/drawing/ColorSelector";
import TabLayout from "@/components/drawing/TabLayout";
import Head from "next/head";
import { dateNumber } from "@/mentalcare/lib/date-number";
import { clearCanvas, downloadCanvasAsPng } from "@/components/drawing/canvasHelper";


const EDGE_THRESHOLD = 20;

const getTouch = (touchList: TouchList, rect: any) => {
  /*
  clientX: 231.591796875
  clientY: 189.01303100585938
  force: 1
  identifier: 0
  pageX: 231.591796875
  pageY: 189.01303100585938
  radiusX: 0.63720703125
  radiusY: 0.63720703125
  rotationAngle: 0
  screenX: 231.591796875
  screenY: 271.6796875
   */
  if (touchList.length === 1) {
    return touchList[0];
  }
  const touches: Touch[] = [];
  for(let i = 0; i < touchList.length; i++) {
    const touch = touchList[i];
    if (touch !== null && touch !== undefined) {
      touches.push(touch);
    }
  }
  const centreX = rect.width / 2;
  const centreY = rect.height / 2;
  return touches.sort((a, b) => a.radiusX - b.radiusX)
    .sort((a, b) => {
      // Sort by distance from the centre of the canvas
      const distA = Math.sqrt((a.clientX - centreX) ** 2 + (a.clientY - centreY) ** 2);
      const distB = Math.sqrt((b.clientX - centreX) ** 2 + (b.clientY - centreY) ** 2);
      return distA - distB;
    })
    .find(touch => {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      return !(x < EDGE_THRESHOLD || x > (rect.width - EDGE_THRESHOLD) ||
        y < EDGE_THRESHOLD || y > (rect.height - EDGE_THRESHOLD))
    });
};

const isCanvasCleared = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Check every pixel. Note: this could be optimized by checking fewer pixels.
  for (let i = 0; i < data.length; i += 4) {
    // If any pixel is not fully transparent, return false
    if (data[i + 3] !== 0) return false;
  }

  // If we made it through all pixels without returning false, the canvas is cleared
  return true;
}

const draw = (e: any, canvas: HTMLCanvasElement, brush = 'pen') => {
  if (e.cancelable) {
    e.preventDefault(); // Prevent scrolling
  } else {
    e.stopPropagation();
  }

  const ctx = canvas.getContext("2d")!
  const rect = canvas.getBoundingClientRect();

  let x, y;
  let lineWidth = brush === 'eraser' ? 20 : 5;
  // Set the blend mode based on the brush type
  ctx.globalCompositeOperation = brush === 'eraser' ? 'destination-out' : 'source-over';

  if (e.touches) { // If this is a touch event

    const touch = getTouch(e.touches, rect)
    if (touch) {
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
      if (brush !== 'eraser') {
        lineWidth = Math.min(touch.radiusX, 1) * 5;
      }
    } else {
      console.log("no touch")
      return;
    }
  } else { // If this is a mouse event
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  ctx.lineWidth = lineWidth;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

const Drawing = (_: any) => {
  const backgroundColor = '#ffffff'
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState({name: 'Black', code: '#000000'});
  const [brush, setBrush] = useState('pen')

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  const handleStart = async (e:any) => {
    setDrawing((_: boolean) => {
      callDraw(e, true)
      return true
    });
  };

  const handleEnd = (_:any) => {
    setDrawing(false);
    const canvas: HTMLCanvasElement = canvasRef.current!
    if (brush === 'eraser' && isCanvasCleared(canvas)) {
      setBrush('pen')
    }
    const ctx = canvas.getContext("2d")!
    ctx.beginPath();
  };

  const handleMove = (e: any) => {
    callDraw(e, drawing)
  }

  const callDraw = (e: any, drawing: boolean) => {
    if (!drawing) return;
    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.lineCap = "round";
    ctx.strokeStyle = color.code;
    draw(e, canvas, brush);
  }

  /*
  const toggleFullscreen = (_:any) => {
    const canvas = document.documentElement
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }*/

  /*
  const clear = () => {
    const canvas: HTMLCanvasElement = canvasRef.current!
    clearCanvas(canvas)
  };
   */

  const handleUseEraser = () => {
    if (brush == 'pen') {
      setBrush('eraser')
    } else {
      setBrush('pen')
    }
  }

  const handleSetColor = (color: { name: string, code: string }) => {
    setBrush('pen')
    setColor(color)
  }

  const bgRef = useRef(null);

  const handleUploadImage = (e: Event) => {
    // @ts-ignore
    bgRef.current.handleImageUpload(e.target.files);
  }

  const handleDownload = () => {
    downloadCanvasAsPng(canvasRef.current!, "drawing-" + dateNumber(new Date()) + ".png", backgroundColor);
  }

  const [loading, setLoading] = useState(false);
  const loadAiImage = async () => {
    setLoading(true)
    try {
      const animals = ["rabbit", "fox", "cat", "elephant", "dog", "bird", "bear", "lion", "tiger", "penguin", "panda", "koala", "monkey", "squirrel", "deer", "wolf", "zebra", "giraffe", "hippo", "rhino", "kangaroo", "crocodile", "snake", "turtle", "frog", "fish", "shark", "whale", "dolphin", "octopus", "crab", "lobster"];
      const payload = {
        "item": animals[Math.floor(Math.random() * animals.length)],
        "size": "512x512"
      };

      const response = await fetch("/api/gen-image/", {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const body = await response.json()
        console.log("XXX response, ", body)
        // @ts-ignore
        console.log("XXX url", body.data[0].url)
        // @ts-ignore
        clearCanvas(canvasRef.current!);
        await bgRef.current.setImage([body.data[0].url]);
        return;
      }
      throw new Error(`Error: ${response.text()}`);
    } catch (err) {
      //setError(`${err}`);
      console.log("error", err)
    } finally {
      setBrush('pen')
      setHidden(false)
      setLoading(false)
    }
  }

  const [hidden, setHidden] = useState(false);

  const handleHidden = () => {
    setHidden(!hidden)
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,user-scalable=no,minimal-ui"
          key="viewport"
        />
      </Head>
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
      <TabLayout dimensions={dimensions} setDimensions={setDimensions} control={
        () => {

          return <>
            <FileInputButton className={"p-4 no-selection"} type="file" accept="image/*" onFileChange={handleUploadImage} value={""} label={"📄"} />
            <ColorSelector className={'p-4 no-selection text-2xl'} selectedColor={color} setSelectedColor={handleSetColor} menuText={'🎨'} />
            <TouchButton className={'p-4 no-selection text-2xl'} onClick={handleUseEraser}>{brush === 'pen' ? '⌫' : '✏️'}</TouchButton>
            {/*<TouchButton className={'p-4 no-selection'} onClick={toggleFullscreen}>Full</TouchButton>*/}
            <TouchButton className={'p-4 no-selection text-2xl'} onClick={handleDownload}>⬇️</TouchButton>
            <TouchButton className={'p-4 no-selection text-2xl'} onClick={loadAiImage} disabled={loading}>{loading ? '...' : '🖼️'}</TouchButton>
            <TouchButton className={'p-4 no-selection text-2xl'} onClick={handleHidden}>{hidden ? '👀': ' 🙈'}</TouchButton>
          </>}
      } >
        <div style={{
          background: backgroundColor,
          width: dimensions.width,
          height: dimensions.height
        }} />
        <ImageCanvas ref={bgRef} dimensions={dimensions} hidden={hidden} alpha={0.7} />
        <canvas
          ref={canvasRef}
          style={{ background: '#ffffff05' }}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseMove={handleMove}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchMove={handleMove}
        ></canvas>
      </TabLayout>
    </>
  );
};


export default Drawing;