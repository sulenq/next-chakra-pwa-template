import { getStorage, setStorage } from "@/utils/client";

// play video safely
export const playVideo = async (video: HTMLVideoElement | null) => {
  try {
    await video?.play();
  } catch {
    // autoplay block or error
  }
};

export const pauseVideo = (video: HTMLVideoElement | null) => {
  video?.pause();
};

export const seekVideo = (video: HTMLVideoElement | null, seconds: number) => {
  if (video && video.duration && !isNaN(video.duration)) {
    video.currentTime = Math.min(Math.max(seconds, 0), video.duration);
  }
};

export const getVideoDuration = (video: HTMLVideoElement | null) =>
  video && !isNaN(video.duration) ? video.duration : 0;

export const getVideoCurrentTime = (video: HTMLVideoElement | null) =>
  video?.currentTime ?? 0;

export const setVideoVolume = (
  video: HTMLVideoElement | null,
  volume: number
) => {
  if (video) video.volume = Math.min(Math.max(volume, 0), 1);
};

// real toggle (flip state if no arg)
export const toggleMute = (video: HTMLVideoElement | null, force?: boolean) => {
  if (!video) return;
  video.muted = typeof force === "boolean" ? force : !video.muted;
};

export const setPlaybackRate = (
  video: HTMLVideoElement | null,
  rate: number
) => {
  if (video) video.playbackRate = rate;
};

// cross-browser fullscreen
export function toggleFullscreen(container: any | null) {
  if (!container) return;
  const elem = container as any;

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      // keluar fullscreen, scroll elem ke view
      elem.scrollIntoView({ block: "center" });
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitEnterFullscreen) elem.webkitEnterFullscreen(); // Safari iOS
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

export const saveProgress = (key: string, currentTime: number) => {
  setStorage(`video-progress:${key}`, String(currentTime));
};

export const loadProgress = (key: string) => {
  const value = getStorage(`video-progress:${key}`);
  return value ? Number(value) : 0;
};

export const isVideoCompleted = (
  video: HTMLVideoElement | null,
  threshold = 0.95
) => {
  if (!video || !video.duration || isNaN(video.duration)) return false;
  return video.currentTime / video.duration >= threshold;
};

export const getVideoThumbnail = (
  videoSrc: string,
  seekTime = 1
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoSrc;
    video.crossOrigin = "anonymous";

    video.addEventListener("loadeddata", () => {
      video.currentTime = seekTime;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context error");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL("image/jpeg");
      resolve(imgData);
    });

    video.addEventListener("error", (e) => reject(e));
  });
};
