/**
 * Given an image URL and crop coordinates, returns a cropped File.
 */
const FORMAT_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

function createCroppedCanvas(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<{ canvas: HTMLCanvasElement; image: HTMLImageElement }> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No 2d context"));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve({ canvas, image });
    };

    image.onerror = () => reject(new Error("Failed to load image"));
  });
}

export async function getCroppedPreview(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  format = "image/jpeg"
): Promise<string> {
  const { canvas } = await createCroppedCanvas(imageSrc, pixelCrop);
  return canvas.toDataURL(format);
}

export function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  format = "image/jpeg"
): Promise<File> {
  const mime = FORMAT_EXT[format] ? format : "image/jpeg";
  const ext = FORMAT_EXT[mime] || "jpg";

  return new Promise((resolve, reject) => {
    createCroppedCanvas(imageSrc, pixelCrop).then(({ canvas }) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        const file = new File([blob], `cropped.${ext}`, { type: mime });
        resolve(file);
      }, mime);
    }).catch(reject);
  });
}
