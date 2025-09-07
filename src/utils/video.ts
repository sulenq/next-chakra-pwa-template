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
export const toggleFullscreen = (video: HTMLVideoElement | null) => {
  if (!video) return;
  const elem = video as any;

  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitEnterFullscreen) elem.webkitEnterFullscreen(); // Safari iOS
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
};

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
