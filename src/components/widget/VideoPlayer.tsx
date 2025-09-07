"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import Select from "@/components/ui/Select";
import useClickOutside from "@/hooks/useClickOutside";
import {
  getVideoCurrentTime,
  getVideoDuration,
  loadProgress,
  pauseVideo,
  playVideo,
  saveProgress,
  seekVideo,
  setPlaybackRate,
  setVideoVolume,
  toggleFullscreen,
  toggleMute,
} from "@/utils/video";
import { chakra, HStack, Icon, Slider, Stack, Text } from "@chakra-ui/react";
import {
  IconMaximize,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconRewindBackward5,
  IconRewindForward5,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width?: number;
  height?: number;
  storageKey?: string;
};

const VideoElement = chakra("video");

export default function VideoPlayer(props: Props) {
  // Props
  const { src, storageKey = "default", ...restProps } = props;

  // Refs
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // States
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setRate] = useState(1);
  const rates = [
    { label: "0.5x", value: "0.5" },
    { label: "1x", value: "1" },
    { label: "1.5x", value: "1.5" },
    { label: "2x", value: "2" },
  ];

  // handle show controls
  useClickOutside([videoContainerRef], () => setShowControls(false));

  // load first progress
  useEffect(() => {
    const saved = loadProgress(storageKey);
    seekVideo(videoRef.current, saved);
  }, [storageKey]);

  // update duration when metadata loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => setDuration(getVideoDuration(video));
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  // update progress setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const current = getVideoCurrentTime(videoRef.current);
        setProgress(current);
        saveProgress(storageKey, current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [storageKey]);

  function handlePlayPause() {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      pauseVideo(video);
      setIsPlaying(false);
    } else {
      playVideo(video);
      setIsPlaying(true);
    }
  }
  function handleSeek(e: any) {
    const video = videoRef.current;
    if (!video) return;
    seekVideo(video, e.value);
    setProgress(e.value);
  }
  function handleSeekForward() {
    const video = videoRef.current;
    if (!video) return;
    seekVideo(video, progress + 5);
    setProgress(progress + 5);
  }
  function handleSeekBackward() {
    const video = videoRef.current;
    if (!video) return;
    seekVideo(video, progress - 5);
    setProgress(progress - 5);
  }
  function handleVolume(e: any) {
    const video = videoRef.current;
    if (!video) return;
    setVideoVolume(video, e.value / 100);
    setVolume(e.value);
    if (e.value / 100 === 0) {
      setMuted(true);
      toggleMute(video, true);
    } else {
      setMuted(false);
      toggleMute(video, false);
    }
  }
  function handleMute() {
    const video = videoRef.current;
    if (!video) return;
    toggleMute(video);
    setMuted(!muted);
    if (!muted === false && volume / 100 === 0) {
      setVideoVolume(video, 100 / 100);
      setVolume(100);
    }
  }
  function handleRate(val: number) {
    const video = videoRef.current;
    if (!video) return;
    setPlaybackRate(video, val);
    setRate(val);
  }
  function formatTime(s: number) {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  }

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoContainerRef.current) return;

      // check if focus is inside container
      if (!videoContainerRef.current.contains(document.activeElement)) return;

      switch (e.code) {
        case "Space":
          e.preventDefault(); // biar page ga scroll
          handlePlayPause();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSeekForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSeekBackward();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [progress, isPlaying]); // dependensi biar update saat progress/playing state berubah

  // inside VideoPlayer component
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    let timer: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      container.style.cursor = "default";

      // reset timer
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setShowControls(false);
        container.style.cursor = "none";
      }, 3000);
    };

    const handleMouseLeave = () => {
      // mouse keluar container, showControls normal behavior
      setShowControls(false);
      container.style.cursor = "default";
      if (timer) clearTimeout(timer);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <CContainer
      ref={videoContainerRef}
      justify={"center"}
      align={"center"}
      mx="auto"
      pos={"relative"}
      overflow={"clip"}
      onMouseEnter={() => setShowControls(true)}
      onTouchStart={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onBlur={() => setShowControls(true)}
      aspectRatio={16 / 10}
      bg={"black"}
      {...restProps}
    >
      <VideoElement
        as="video"
        ref={videoRef}
        src={src}
        w="full"
        shadow="md"
        onClick={handlePlayPause}
      />

      <CContainer
        w={"full"}
        className="dsb"
        pos={"absolute"}
        left={0}
        transition={"200ms"}
        bottom={0}
        visibility={showControls ? "visible" : "hidden"}
        opacity={showControls ? 1 : 0}
      >
        <HStack mt={"-5px"}>
          {/* Progress bar */}
          <Slider.Root
            flex={1}
            min={0}
            max={duration}
            step={1}
            size={"sm"}
            value={[progress]}
            onValueChange={handleSeek}
            colorPalette={"light"}
          >
            <Slider.Control>
              <Slider.Track rounded={0} bg={"dark"}>
                <Slider.Range rounded={0} />
              </Slider.Track>

              <Slider.Thumbs w={"10px"} h={"10px"} bg={"dark"} />
            </Slider.Control>
          </Slider.Root>
        </HStack>

        <Stack
          flexDir={["column", null, "row"]}
          gap={0}
          pb={1}
          px={1}
          justify={"space-between"}
        >
          <HStack justify={"space-between"}>
            <HStack>
              {/* Play / Pause */}
              <Btn
                iconButton
                clicky={false}
                size={"xs"}
                colorPalette={"light"}
                variant="ghost"
                onClick={handlePlayPause}
              >
                <Icon>
                  {isPlaying ? (
                    <IconPlayerPauseFilled />
                  ) : (
                    <IconPlayerPlayFilled />
                  )}
                </Icon>
              </Btn>

              {/* Timer */}
              <Text fontSize="xs" textAlign="right" flexShrink={0}>
                {formatTime(progress)} / {formatTime(duration)}
              </Text>
            </HStack>

            {/* Playback Rate */}
            <Select
              selectOptions={rates}
              inputValue={`${playbackRate}`}
              onValueChange={(val) => handleRate(Number(val))}
              color={"light"}
              w={"68px"}
              size="xs"
              fontSize={"xs"}
            />
          </HStack>

          <HStack justify={"space-between"}>
            <HStack gap={0}>
              <Btn
                iconButton
                clicky={false}
                size={"xs"}
                colorPalette={"light"}
                variant="ghost"
                onClick={handleSeekBackward}
              >
                <Icon>
                  <IconRewindBackward5 />
                </Icon>
              </Btn>

              <Btn
                iconButton
                clicky={false}
                size={"xs"}
                colorPalette={"light"}
                variant="ghost"
                onClick={handleSeekForward}
              >
                <Icon>
                  <IconRewindForward5 />
                </Icon>
              </Btn>
            </HStack>

            <HStack>
              {/* Volume */}
              <HStack>
                <Btn
                  iconButton
                  clicky={false}
                  size={"xs"}
                  variant="ghost"
                  onClick={handleMute}
                  colorPalette={"light"}
                >
                  <Icon>
                    {muted || volume === 0 ? <IconVolumeOff /> : <IconVolume />}
                  </Icon>
                </Btn>

                <Slider.Root
                  w="60px"
                  min={0}
                  max={100}
                  step={1}
                  size={"sm"}
                  colorPalette={"light"}
                  value={[volume]}
                  onValueChange={handleVolume}
                >
                  <Slider.Control>
                    <Slider.Track bg={"dark"}>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs w={"10px"} h={"10px"} bg={"dark"} />
                  </Slider.Control>
                </Slider.Root>
              </HStack>

              {/* Fullscreen */}
              <Btn
                iconButton
                clicky={false}
                size={"xs"}
                colorPalette={"light"}
                variant="ghost"
                onClick={() => toggleFullscreen(videoContainerRef.current)}
              >
                <IconMaximize size={18} />
              </Btn>
            </HStack>
          </HStack>
        </Stack>
      </CContainer>
    </CContainer>
  );
}
