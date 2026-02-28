"use client";

import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { extractPageImages, PDFImageMetadata } from "../engine/imageExtractor";
import { Box } from "@chakra-ui/react";

interface ImageLayerProps {
  page: pdfjsLib.PDFPageProxy;
  viewport: pdfjsLib.PageViewport;
}

export const ImageLayer: React.FC<ImageLayerProps> = ({ page, viewport }) => {
  const [images, setImages] = useState<PDFImageMetadata[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadImages = async () => {
      try {
        const extractedImages = await extractPageImages(page);
        if (mounted) {
          setImages(extractedImages);
        }
      } catch (err) {
        console.error("Error in ImageLayer:", err);
      }
    };

    loadImages();
    return () => {
      mounted = false;
    };
  }, [page]);

  return (
    <Box
      className="pdf-image-layer"
      position="absolute"
      top={0}
      left={0}
      width={`${viewport.width}px`}
      height={`${viewport.height}px`}
      pointerEvents="auto" // Allow right-click on images
      zIndex={1}
    >
      {images.map((img, idx) => {
        // The CTM in PDF.js maps from a [0,0,1,1] unit square to the page space.
        // We need to apply this matrix to an <img> tag.
        // CSS matrix(a, b, c, d, tx, ty)

        // Note: PDF.js viewport transform is also applied if we want absolute page coordinates.
        // BUT page.getOperatorList() returns operators in "user space" (usually 72dpi).
        // viewport.transform maps user space to device space (pixels).

        const [a, b, c, d, e, f] = img.ctm;

        // Combine with viewport transform for final pixel positioning
        // viewport.transform = [scale, 0, 0, -scale, 0, height] usually
        // Result = ViewportMatrix * CTM

        const [va, vb, vc, vd, ve, vf] = viewport.transform;

        // Matrix Multiplication (A * B)
        // [va vc ve]   [a c e]
        // [vb vd vf] * [b d f]
        // [ 0  0  1]   [0 0 1]

        const ra = va * a + vc * b;
        const rb = vb * a + vd * b;
        const rc = va * c + vc * d;
        const rd = vb * c + vd * d;
        const re = va * e + vc * f + ve;
        const rf = vb * e + vd * f + vf;

        const transformStr = `matrix(${ra}, ${rb}, ${rc}, ${rd}, ${re}, ${rf})`;

        return (
          <img
            key={`${img.name}-${idx}`}
            src={img.src}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1px",
              height: "1px",
              transform: transformStr,
              transformOrigin: "0 0",
              imageRendering: "crisp-edges",
            }}
          />
        );
      })}
    </Box>
  );
};
