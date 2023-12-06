import type { Color } from "./types";
import { log } from "./utils";

export const MAX_PIXELS = 50000;

export async function getPixels(image: HTMLImageElement) {
  await image.decode();
  const originWidth = image.width;
  const originHeight = image.height;
  const { width, height } = rescaleDimensions(originWidth, originHeight, MAX_PIXELS);
  const bitMap = await createImageBitmap(image, {
    resizeHeight: height,
    resizeWidth: width,
    resizeQuality: "pixelated",
  });
  let canvas: HTMLCanvasElement | OffscreenCanvas;
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;
  if (typeof document === "undefined") {
    log("Using OffscreenCanvas");
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext("2d");
  } else {
    log("Using canvas");
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
  }
  if (ctx) {
    ctx.drawImage(bitMap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const colors: Color[] = [];
    for (let i = 0; i < imageData.width * imageData.height; i++) {
      colors.push([
        imageData.data[i * 4],
        imageData.data[i * 4 + 1],
        imageData.data[i * 4 + 2],
      ]);
    }
    return colors;
  }
  return [];
}

function rescaleDimensions(width: number, height: number, pixels: number) {
  const aspectRatio = width / height;
  const scalingFactor = Math.sqrt(pixels / aspectRatio);
  const rescaledWidth = Math.floor(aspectRatio * scalingFactor);
  const rescaledHeight = Math.floor(scalingFactor);
  return {
    width: rescaledWidth,
    height: rescaledHeight,
  };
}
