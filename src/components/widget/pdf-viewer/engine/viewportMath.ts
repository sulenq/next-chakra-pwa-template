import type { PageViewport } from "pdfjs-dist/types/src/display/display_utils";

/**
 * Calculate the scale needed to make a page fill the container width.
 */
export function fitToWidth(
  pageViewport: PageViewport,
  containerWidth: number,
): number {
  return containerWidth / pageViewport.width;
}

/**
 * Calculate the scale so the entire page fits within the container.
 */
export function fitToPage(
  pageViewport: PageViewport,
  containerWidth: number,
  containerHeight: number,
): number {
  const scaleX = containerWidth / pageViewport.width;
  const scaleY = containerHeight / pageViewport.height;
  return Math.min(scaleX, scaleY);
}

/**
 * Return pixel dimensions of a page at a given scale.
 */
export function getPageDimensions(
  pageViewport: PageViewport,
  scale: number,
): { width: number; height: number } {
  return {
    width: pageViewport.width * scale,
    height: pageViewport.height * scale,
  };
}
