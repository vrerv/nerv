const newCanvasWithBg = (canvas: HTMLCanvasElement, backgroundColor: string | null | undefined): HTMLCanvasElement => {
  // Create a new canvas element
  const newCanvas = document.createElement("canvas");
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;

  const ctx = newCanvas.getContext("2d")!;

  // Draw the background color first
  if (backgroundColor) {
    // Set the background color or transparent if not specified
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
  }

  // Draw the original canvas content on top of the background
  ctx.drawImage(canvas, 0, 0);
  return newCanvas;
}

export const downloadCanvasAsPng = (canvas: HTMLCanvasElement, filename: string, backgroundColor: string | null | undefined) => {
  const newCanvas = newCanvasWithBg(canvas, backgroundColor);
  // Convert the canvas to a data URL
  const imageURL = newCanvas.toDataURL('image/png');

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

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}