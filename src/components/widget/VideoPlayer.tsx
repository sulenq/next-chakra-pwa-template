"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import Select from "@/components/ui/Select";
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
import { chakra, HStack, Icon, Slider, Text } from "@chakra-ui/react";
import {
  IconMaximize,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setRate] = useState(1);
  const rates = [
    { label: "0.5x", value: "0.5" },
    { label: "1x", value: "1" },
    { label: "1.5x", value: "1.5" },
    { label: "2x", value: "2" },
  ];

  // load progress awal
  useEffect(() => {
    const saved = loadProgress(storageKey);
    seekVideo(videoRef.current, saved);
  }, [storageKey]);

  // update duration pas metadata loaded
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

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      pauseVideo(video);
      setIsPlaying(false);
    } else {
      playVideo(video);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: any) => {
    const video = videoRef.current;
    if (!video) return;
    seekVideo(video, e.value);
    setProgress(e.value);
  };

  const handleVolume = (e: any) => {
    const video = videoRef.current;
    if (!video) return;
    setVideoVolume(video, e.value);
    setVolume(e.value);
    setMuted(e.value === 0);
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    toggleMute(video);
    setMuted(!muted);
  };

  const handleRate = (val: number) => {
    const video = videoRef.current;
    if (!video) return;
    setPlaybackRate(video, val);
    setRate(val);
  };

  const formatTime = (s: number) => {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  console.log(volume);

  return (
    <CContainer mx="auto" pos={"relative"} {...restProps}>
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
        bottom={0}
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
              <Slider.Track rounded={0}>
                <Slider.Range rounded={0} />
              </Slider.Track>
              <Slider.Thumbs w={"10px"} h={"10px"} />
            </Slider.Control>
          </Slider.Root>
        </HStack>

        <HStack pb={1} px={1} justify={"space-between"}>
          <HStack>
            {/* Play / Pause */}
            <Btn
              iconButton
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
            <Text fontSize="xs" textAlign="right">
              {formatTime(progress)} / {formatTime(duration)}
            </Text>
          </HStack>

          <HStack>
            <HStack>
              {/* Volume */}
              <Btn
                iconButton
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
                max={1}
                step={0.05}
                size={"sm"}
                colorPalette={"light"}
                value={muted ? [0] : [volume]}
                onChange={handleVolume}
              >
                <Slider.Control>
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumbs w={"10px"} h={"10px"} />
                </Slider.Control>
              </Slider.Root>
            </HStack>

            {/* Playback Rate */}
            <Select
              selectOptions={rates}
              inputValue={`${playbackRate}`}
              onValueChange={(val) => handleRate(Number(val))}
              color={"light"}
              w={"68px"}
              size="xs"
              mr={-2}
            />

            {/* Fullscreen */}
            <Btn
              iconButton
              size={"xs"}
              colorPalette={"light"}
              variant="ghost"
              onClick={() => toggleFullscreen(videoRef.current)}
            >
              <IconMaximize size={18} />
            </Btn>
          </HStack>
        </HStack>
      </CContainer>
    </CContainer>
  );
}
