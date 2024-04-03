
export const downloadCanvasAsPng = (canvas: HTMLCanvasElement, filename: string) => {
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

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}