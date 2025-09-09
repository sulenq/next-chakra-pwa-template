"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import Select from "@/components/ui/Select";
import { Props__VideoPlayer } from "@/constants/props";
import useClickOutside from "@/hooks/useClickOutside";
import {
  getVideoCurrentTime,
  getVideoDuration,
  getVideoThumbnail,
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
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";

const VideoElement = chakra("video");

export default function VideoPlayer(props: Props__VideoPlayer) {
  // Props
  const { id, thumbnail, src, ...restProps } = props;

  // Refs
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // States
  const [resolvedThumbnail, setResolvedThumbnail] = useState<string>(
    thumbnail || ""
  );
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

  // Utils
  const formatTime = (s: number) => {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };
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
  function handleFullscreen() {
    const video = videoContainerRef.current;
    if (!video) return;
    toggleFullscreen(video);
  }

  // resolved thumbnail
  useEffect(() => {
    if (!thumbnail) {
      const getThumbnail = async () => {
        const fethcedThumbnail = await getVideoThumbnail(src || "", 1);
        setResolvedThumbnail(fethcedThumbnail);
      };
      getThumbnail();
    }
  }, [thumbnail]);

  // load first progress
  useEffect(() => {
    const saved = loadProgress(`video-progress:${id}`);
    seekVideo(videoRef.current, saved);
  }, [id]);

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
        saveProgress(`video-progress:${id}`, current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [id]);

  // keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoContainerRef.current) return;

      // check if focus is inside container
      if (!videoContainerRef.current.contains(document.activeElement)) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
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
  }, [progress, isPlaying]);

  // handle show controls + reset countdown
  useEffect(() => {
    const container = videoContainerRef.current;
    if (!container) return;

    const handleMouseMove = () => {
      setShowControls(true);
      container.style.cursor = "default";

      // reset timer
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowControls(false);
        container.style.cursor = "none";
        timerRef.current = null;
      }, 3000);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  useClickOutside([videoContainerRef], () => setShowControls(false));

  // handle video ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  return (
    <CContainer
      ref={videoContainerRef}
      justify={"center"}
      align={"center"}
      mx="auto"
      pos={"relative"}
      overflow={"clip"}
      onTouchStart={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onBlur={() => setShowControls(false)}
      aspectRatio={16 / 10}
      bg={"black"}
      {...restProps}
    >
      <VideoElement
        as="video"
        ref={videoRef}
        src={src}
        poster={resolvedThumbnail}
        w="full"
        shadow="md"
        onClick={() => {
          if (showControls) {
            handlePlayPause();
          } else {
            setShowControls(true);
          }
        }}
        onDoubleClick={handleFullscreen}
      />

      <CContainer
        w={"full"}
        className="dsb"
        pos={"absolute"}
        left={0}
        transition={"500ms"}
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
                size={"md"}
                colorPalette={"light"}
                variant={"plain"}
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
              portalled={false}
              selectOptions={rates}
              inputValue={`${playbackRate}`}
              onValueChange={(val) => handleRate(Number(val))}
              w={"68px"}
              size={"md"}
              fontSize={"xs"}
              _hover={{
                bg: "transparent !important",
              }}
            />
          </HStack>

          <HStack justify={"space-between"}>
            {/* Forward Backward */}
            <HStack gap={0}>
              <Btn
                clicky={false}
                size={"md"}
                colorPalette={"light"}
                variant={"plain"}
                onClick={handleSeekBackward}
                px={2}
              >
                <P fontSize={"xs"}>5</P>
                <Icon>
                  <IconPlayerTrackPrev />
                </Icon>
              </Btn>

              <Btn
                clicky={false}
                size={"md"}
                colorPalette={"light"}
                variant={"plain"}
                onClick={handleSeekForward}
                px={2}
              >
                <Icon>
                  <IconPlayerTrackNext />
                </Icon>
                <P fontSize={"xs"}>5</P>
              </Btn>
            </HStack>

            <HStack>
              {/* Volume */}
              <HStack>
                <Btn
                  iconButton
                  clicky={false}
                  size={"md"}
                  variant={"plain"}
                  onClick={handleMute}
                  colorPalette={"light"}
                  mr={"-10px"}
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
                size={"md"}
                colorPalette={"light"}
                variant={"plain"}
                onClick={handleFullscreen}
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
