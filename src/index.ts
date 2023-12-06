import { kMeans } from "./extract/k-means";
import { getPixels } from "./image";
export * from "./extract";
export * from "./image";
export * from "./types";

export async function backflow(image: HTMLImageElement | string | File, n?: number) {
  let img = new Image();
  if (image instanceof File) {
    const url = URL.createObjectURL(image);
    img.src = url;
  } else if (typeof image === "string") {
    img.src = image;
  } else {
    img = image;
  }
  const pixels = await getPixels(img);
  const colors = kMeans(pixels, n);
  return colors;
}
