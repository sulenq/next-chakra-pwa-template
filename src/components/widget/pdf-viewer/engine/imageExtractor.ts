import * as pdfjsLib from "pdfjs-dist";

export interface PDFImageMetadata {
  name: string;
  ctm: number[];
  width: number;
  height: number;
  src: string;
}

/**
 * Extracts images from a PDF page as metadata and data URLs.
 * This allows rendering images as real <img> tags in the DOM.
 */
export async function extractPageImages(
  page: pdfjsLib.PDFPageProxy,
): Promise<PDFImageMetadata[]> {
  const operatorList = await page.getOperatorList();
  const OPS = (pdfjsLib as any).OPS || {
    save: 10,
    restore: 11,
    transform: 12,
    paintImageXObject: 85,
    paintInlineImageXObject: 86,
    paintImageMaskXObject: 83,
  };

  const images: PDFImageMetadata[] = [];
  const stack: number[][] = [];
  let currentCTM = [1, 0, 0, 1, 0, 0];

  for (let i = 0; i < operatorList.fnArray.length; i++) {
    const fn = operatorList.fnArray[i];
    const args = operatorList.argsArray[i];

    switch (fn) {
      case OPS.save:
        stack.push([...currentCTM]);
        break;

      case OPS.restore:
        if (stack.length > 0) {
          currentCTM = stack.pop()!;
        }
        break;

      case OPS.transform: {
        const [a, b, c, d, e, f] = args as number[];
        const [a1, b1, c1, d1, e1, f1] = currentCTM;
        // Matrix multiplication: [a1 b1 0] * [a b 0]
        //                        [c1 d1 0]   [c d 0]
        //                        [e1 f1 1]   [e f 1]
        currentCTM = [
          a1 * a + c1 * b,
          b1 * a + d1 * b,
          a1 * c + c1 * d,
          b1 * c + d1 * d,
          a1 * e + c1 * f + e1,
          b1 * e + d1 * f + f1,
        ];
        break;
      }

      case OPS.paintImageXObject: {
        const name = args[0] as string;
        try {
          // Sometimes objects need a moment to be resolved from the worker
          let imgObj = null;
          for (let retry = 0; retry < 3; retry++) {
            imgObj = await page.objs.get(name);
            if (imgObj) break;
            await new Promise((resolve) => setTimeout(resolve, 50));
          }

          if (imgObj && (imgObj.data || imgObj.bitmap)) {
            const src = await convertImageToSrc(imgObj);
            if (src) {
              images.push({
                name,
                ctm: [...currentCTM],
                width: imgObj.width,
                height: imgObj.height,
                src,
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to extract image ${name}:`, err);
        }
        break;
      }

      // Inline images and masks can be added later if needed
    }
  }

  return images;
}

async function convertImageToSrc(imgObj: any): Promise<string> {
  // If it's already a bitmap (e.g. from newer PDF.js versions or browser-supported formats)
  if (
    imgObj.bitmap &&
    typeof ImageBitmap !== "undefined" &&
    imgObj.bitmap instanceof ImageBitmap
  ) {
    const canvas = document.createElement("canvas");
    canvas.width = imgObj.bitmap.width;
    canvas.height = imgObj.bitmap.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(imgObj.bitmap, 0, 0);
      return canvas.toDataURL();
    }
  }

  // Handle standard pixel data
  if (imgObj.data) {
    const { width, height, data } = imgObj;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // PDF.js image data format can vary (RGB, RGBA, Grayscale)
      // Most common is RGBA (32bpp) or RGB (24bpp)
      let clampedData: Uint8ClampedArray;

      if (data.length === width * height * 4) {
        clampedData =
          data instanceof Uint8ClampedArray
            ? data
            : new Uint8ClampedArray(data);
      } else if (data.length === width * height * 3) {
        // RGB to RGBA
        clampedData = new Uint8ClampedArray(width * height * 4);
        for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
          clampedData[j] = data[i];
          clampedData[j + 1] = data[i + 1];
          clampedData[j + 2] = data[i + 2];
          clampedData[j + 3] = 255;
        }
      } else {
        // Fallback for other formats (grayscale, etc.) - simple representation
        clampedData = new Uint8ClampedArray(width * height * 4).fill(255);
      }

      const imageData = new ImageData(clampedData as any, width, height);
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    }
  }

  return "";
}
