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

const Drawing = (_: any) => {
  const background = "#ffffff05";
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState({name: 'Black', code: '#000000'});
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });

  const EDGE_THRESHOLD = 20;

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
    console.log("getTouch", touchList)
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
    console.log("touches", touches);
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

  const draw = (e: any) => {
    if (!drawing) return;
    if (e.cancelable) {
      e.preventDefault(); // Prevent scrolling
    } else {
      e.stopPropagation();
    }

    const canvas: HTMLCanvasElement = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const rect = canvas.getBoundingClientRect();

    let x, y;
    let lineWidth = color.code === '#FFFFFF' ? 20 : 5;
    if (e.touches) { // If this is a touch event

      const touch = getTouch(e.touches, rect)
      if (touch) {
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
        if (color.code !== '#FFFFFF') {
          lineWidth = Math.min(touch.radiusX, 1) * 5;
        }
      } else {
        return;
      }
    } else { // If this is a mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = lineWidth;
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
    bgRef.current.handleImageUpload(e.target.files);
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
    downloadCanvasAsPng(canvasRef.current!, "drawing-" + dateNumber(new Date()) + ".png");
  }

  const [loading, setLoading] = useState(false);
  const loadAiImage = async () => {
    setLoading(true)
    try {
      const headers = {
        "Content-Type": "application/json"
      };

      const animals = ["rabbit", "fox", "cat", "elephant", "dog", "bird", "bear", "lion", "tiger", "penguin", "panda", "koala", "monkey", "squirrel", "deer", "wolf", "zebra", "giraffe", "hippo", "rhino", "kangaroo", "crocodile", "snake", "turtle", "frog", "fish", "shark", "whale", "dolphin", "octopus", "crab", "lobster"];
      const payload = {
        "item": animals[Math.floor(Math.random() * animals.length)],
        "size": "512x512"
      };

      console.log("XXX get")
      const response = await fetch("/api/gen-image/", {
        method: 'post',
        headers: headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const body = await response.json()
        console.log("XXX response, ", body)
        // @ts-ignore
        console.log("XXX url", body.data[0].url)
        // @ts-ignore
        await bgRef.current.setImage([body.data[0].url]);

        //setResponse(data);
        return;
      }
      throw new Error(`Error: ${response.text()}`);
    } catch (err) {
      //setError(`${err}`);
      console.log("error", err)
    } finally {
      setHidden(false)
      setLoading(false)
    }
  }

  const [hidden, setHidden] = useState(false);

  const handleHidden = () => {
    // TODO: need to reset file input
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
            <FileInputButton className={'p-4 no-selection'}
              type="file"
              accept="image/*"
              onFileChange={(e: Event) => { handleUploadImage(e); }}
            />
            <ColorSelector className={'p-4 no-selection'} selectedColor={color} setSelectedColor={setColor} />
            <TouchButton className={'p-4 no-selection'} onClick={clearCanvas}>Clear</TouchButton>
            {/*<TouchButton className={'p-4 no-selection'} onClick={toggleFullscreen}>Full</TouchButton>*/}
            <TouchButton className={'p-4 no-selection'} onClick={handleDownload}>Get</TouchButton>
            <TouchButton className={'p-4 no-selection'} onClick={loadAiImage} disabled={loading}>{loading ? '...' : 'AI'}</TouchButton>
            <TouchButton className={'p-4 no-selection'} onClick={handleHidden}>{hidden ? 'O': 'X'}</TouchButton>
          </>}
      } >
        <div style={{
          background: "#ffffff",
          width: dimensions.width,
          height: dimensions.height
        }} />
        <ImageCanvas ref={bgRef} dimensions={dimensions} hidden={hidden} />
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