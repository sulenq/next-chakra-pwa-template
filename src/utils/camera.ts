import { RefObject } from "react";

export async function startCamera(
  videoRef: RefObject<HTMLVideoElement | null>,
  streamRef: RefObject<MediaStream | null>,
  onOpen: () => void,
  onError: (error: Error) => void
) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    streamRef.current = stream;

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    onOpen();
  } catch (error) {
    onError(error as Error);
    console.error("Gagal mengakses kamera:", error);
  }
}

export function stopCamera(
  videoRef: RefObject<HTMLVideoElement | null>,
  streamRef: RefObject<MediaStream | null>,
  onClose: () => void
) {
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
  }
  onClose();
}
