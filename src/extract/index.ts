import { extractColors } from "./k-means";

export type Color = [number, number, number];

const MAX_K_MEANS_PIXELS = 50000;

export const DEFAULT_K = 3;

export function extract(image: string | HTMLImageElement | File, k: number) {
  if (!document) {
    throw new Error("Not in browser environment");
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }
  const img = new Image();
  if (typeof image === "string") {
    img.src = image;
  } else if (image instanceof File) {
    img.src = URL.createObjectURL(image);
  } else {
    img.src = image.src;
  }
  return new Promise<Color[]>((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colors: Color[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const color: Color = [data[i], data[i + 1], data[i + 2]];
        colors.push(color);
      }
      const c = extractColors(colors, k);
      resolve(c);
    };
  });
}
