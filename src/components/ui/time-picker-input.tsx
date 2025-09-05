import { Btn } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { StringInput } from "@/components/ui/string-input";
import { Props__TimePicker } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useScreen from "@/hooks/useScreen";
import { back } from "@/utils/client";
import { formatTime } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import {
  getHoursFromTime,
  getMinutesFromTime,
  getSecondsFromTime,
  getUserTimezone,
} from "@/utils/time";
import {
  HStack,
  Icon,
  useDisclosure,
  useFieldContext,
  VStack,
} from "@chakra-ui/react";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconClock,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "./tooltip";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";

const DEFAULT_TIME = "00:00:00";

const TimePickerInput = (props: Props__TimePicker) => {
  // Props
  const {
    id,
    name,
    title,
    onConfirm,
    inputValue,
    showTimezone,
    withSeconds = false,
    placeholder,
    required,
    invalid,
    disclosureSize = withSeconds ? "sm" : "xs",
    ...restProps
  } = props;

  // Contexts
  const fc = useFieldContext();
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States
  const userTz = getUserTimezone();
  const resolvedPlaceholder = placeholder || l.select_time;
  const [selected, setSelected] = useState<string | undefined>(inputValue);
  const [hours, setHours] = useState<number>(getHoursFromTime(inputValue));
  const [minutes, setMinutes] = useState<number>(
    getMinutesFromTime(inputValue)
  );
  const [seconds, setSeconds] = useState<number>(
    getSecondsFromTime(inputValue)
  );
  const intervalIncrementRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const timeoutIncrementRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const intervalDecrementRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const timeoutDecrementRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const renderValue = formatTime(inputValue);

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    id || `time-picker${name ? `-${name}` : ""}`,
    open,
    onOpen,
    onClose
  );
  const { sw } = useScreen();
  const overflow = sw < 450 && withSeconds;

  // Update hours, minutes, seconds when inputValue changes
  useEffect(() => {
    if (inputValue) {
      setHours(getHoursFromTime(inputValue));
      setMinutes(getMinutesFromTime(inputValue));
      setSeconds(getSecondsFromTime(inputValue));
    }
  }, [inputValue]);

  // Update selected value when hours, minutes, or seconds change
  useEffect(() => {
    const fHours = String(hours).padStart(2, "0");
    const fMinutes = String(minutes).padStart(2, "0");
    const fSeconds = String(seconds).padStart(2, "0");
    setSelected(`${fHours}:${fMinutes}:${fSeconds}`);
  }, [hours, minutes, seconds]);

  // Handle increment, decrement
  function handleHoldIncrement(type: string) {
    if (timeoutIncrementRef.current || intervalIncrementRef.current) return;

    timeoutIncrementRef.current = setTimeout(() => {
      intervalIncrementRef.current = setInterval(() => {
        if (type === "hours") {
          setHours((ps) => (ps < 23 ? ps + 1 : 0));
        } else if (type === "minutes") {
          setMinutes((ps) => (ps < 59 ? ps + 1 : 0));
        } else if (type === "seconds") {
          setSeconds((ps) => (ps < 59 ? ps + 1 : 0));
        }
      }, 100);
    }, 300);
  }
  function handleTapIncrement() {
    if (timeoutIncrementRef.current) {
      clearTimeout(timeoutIncrementRef.current);
      timeoutIncrementRef.current = null;
    }
    if (intervalIncrementRef.current) {
      clearInterval(intervalIncrementRef.current);
      intervalIncrementRef.current = null;
    }
  }
  function handleHoldDecrement(type: string) {
    if (timeoutDecrementRef.current || intervalDecrementRef.current) return;

    timeoutDecrementRef.current = setTimeout(() => {
      intervalDecrementRef.current = setInterval(() => {
        if (type === "hours") {
          setHours((ps) => (ps > 0 ? ps - 1 : 23));
        } else if (type === "minutes") {
          setMinutes((ps) => (ps > 0 ? ps - 1 : 59));
        } else if (type === "seconds") {
          setSeconds((ps) => (ps > 0 ? ps - 1 : 59));
        }
      }, 100);
    }, 300);
  }
  function handleTapDecrement() {
    if (timeoutDecrementRef.current) {
      clearTimeout(timeoutDecrementRef.current);
      timeoutDecrementRef.current = null;
    }
    if (intervalDecrementRef.current) {
      clearInterval(intervalDecrementRef.current);
      intervalDecrementRef.current = null;
    }
  }

  // Handle confirm selected
  function onConfirmSelected() {
    const confirmable = !required || !!selected;
    if (confirmable) {
      onConfirm?.(selected);
      back();
    }
  }

  return (
    <>
      <Tooltip content={inputValue ? renderValue : resolvedPlaceholder}>
        <Btn
          w={"full"}
          clicky={false}
          variant={"ghost"}
          border={"1px solid"}
          borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
          onClick={() => {
            if (inputValue) {
              setSelected(inputValue);
            }
            onOpen();
          }}
          size={"md"}
          {...restProps}
        >
          <HStack w={"full"} justify={"space-between"}>
            {inputValue ? (
              <P truncate>
                {withSeconds
                  ? inputValue
                  : formatTime(inputValue, { timezoneKey: "UTC" })}
              </P>
            ) : (
              <P
                color={props?._placeholder?.color || "var(--placeholder)"}
                truncate
              >
                {resolvedPlaceholder}
              </P>
            )}

            <Icon color={"fg.subtle"}>
              <IconClock stroke={1.5} />
            </Icon>
          </HStack>
        </Btn>
      </Tooltip>

      <DisclosureRoot open={open} size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(title || l.select_time)}
            />
          </DisclosureHeader>

          <DisclosureBody>
            {/* Main layout for hours, minutes, (optional) seconds */}
            <HStack
              justify={"space-between"}
              gap={1}
              wrap={overflow ? "wrap" : ""}
              gapY={overflow ? 4 : 0}
            >
              {/* Hours control */}
              <VStack flex={"1 1 120"} align={"stretch"} gap={0}>
                <Btn
                  iconButton
                  aria-label="add hour button"
                  variant={"outline"}
                  onClick={() => {
                    setHours((ps) => (ps < 23 ? ps + 1 : 0));
                    if (!selected) setSelected(DEFAULT_TIME);
                  }}
                  onMouseDown={() => handleHoldIncrement("hours")}
                  onMouseUp={handleTapIncrement}
                  onMouseLeave={handleTapIncrement}
                  onTouchStart={() => handleHoldIncrement("hours")}
                  onTouchEnd={handleTapIncrement}
                >
                  <Icon fontSize={"md"}>
                    <IconCaretUpFilled />
                  </Icon>
                </Btn>

                <VStack my={4}>
                  <StringInput
                    clearable={false}
                    name="jam"
                    onChange={(input) => {
                      if (parseInt(input as string) < 24) {
                        setHours(parseInt(input as string));
                      }
                    }}
                    inputValue={
                      selected ? String(hours).padStart(2, "0") : "--"
                    }
                    fontSize={"64px !important"}
                    fontWeight={600}
                    h={"64px"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                  />
                  {/* <P textAlign={"center"}>Jam</P> */}
                </VStack>

                <Btn
                  iconButton
                  aria-label="reduce hour button"
                  variant={"outline"}
                  onClick={() => {
                    setHours((ps) => (ps > 0 ? ps - 1 : 23));
                    if (!selected) setSelected(DEFAULT_TIME);
                  }}
                  onMouseDown={() => handleHoldDecrement("hours")}
                  onMouseUp={handleTapDecrement}
                  onMouseLeave={handleTapDecrement}
                  onTouchStart={() => handleHoldDecrement("hours")}
                  onTouchEnd={handleTapDecrement}
                >
                  <Icon fontSize={"md"}>
                    <IconCaretDownFilled />
                  </Icon>
                </Btn>
              </VStack>

              {!overflow && (
                <P fontSize={50} opacity={0.2} mt={-2}>
                  :
                </P>
              )}

              {/* Minutes control */}
              <VStack flex={"1 1 120"} align={"stretch"} gap={0}>
                <Btn
                  iconButton
                  aria-label="add minute button"
                  variant={"outline"}
                  onClick={() => {
                    setMinutes((ps) => (ps < 59 ? ps + 1 : 0));
                    if (!selected) setSelected(DEFAULT_TIME);
                  }}
                  onMouseDown={() => handleHoldIncrement("minutes")}
                  onMouseUp={handleTapIncrement}
                  onMouseLeave={handleTapIncrement}
                  onTouchStart={() => handleHoldIncrement("minutes")}
                  onTouchEnd={handleTapIncrement}
                >
                  <Icon fontSize={"md"}>
                    <IconCaretUpFilled />
                  </Icon>
                </Btn>

                <VStack my={4}>
                  <StringInput
                    clearable={false}
                    name="menit"
                    onChange={(input) => {
                      if (parseInt(input as string) < 60) {
                        setMinutes(parseInt(input as string));
                      }
                    }}
                    inputValue={
                      selected ? String(minutes).padStart(2, "0") : "--"
                    }
                    fontSize={"64px !important"}
                    fontWeight={600}
                    h={"64px"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                  />
                  {/* <P textAlign={"center"}>Menit</P> */}
                </VStack>

                <Btn
                  iconButton
                  aria-label="reduce minute button"
                  variant={"outline"}
                  onClick={() => {
                    setMinutes((ps) => (ps > 0 ? ps - 1 : 59));
                    if (!selected) setSelected(DEFAULT_TIME);
                  }}
                  onMouseDown={() => handleHoldDecrement("minutes")}
                  onMouseUp={handleTapDecrement}
                  onMouseLeave={handleTapDecrement}
                  onTouchStart={() => handleHoldDecrement("minutes")}
                  onTouchEnd={handleTapDecrement}
                >
                  <Icon fontSize={"md"}>
                    <IconCaretDownFilled />
                  </Icon>
                </Btn>
              </VStack>

              {withSeconds && (
                <>
                  {!overflow && (
                    <P fontSize={50} opacity={0.2} mt={-2}>
                      :
                    </P>
                  )}

                  {/* Seconds control */}
                  <VStack flex={"1 1 120"} align={"stretch"} gap={0}>
                    <Btn
                      iconButton
                      aria-label="add second button"
                      variant={"outline"}
                      onClick={() => {
                        setSeconds((ps) => (ps < 59 ? ps + 1 : 0));
                        if (!selected) setSelected(DEFAULT_TIME);
                      }}
                      onMouseDown={() => handleHoldIncrement("seconds")}
                      onMouseUp={handleTapIncrement}
                      onMouseLeave={handleTapIncrement}
                      onTouchStart={() => handleHoldIncrement("seconds")}
                      onTouchEnd={handleTapIncrement}
                    >
                      <Icon fontSize={"md"}>
                        <IconCaretUpFilled />
                      </Icon>
                    </Btn>

                    <VStack my={4}>
                      <StringInput
                        clearable={false}
                        name="detik"
                        onChange={(input) => {
                          if (parseInt(input as string) < 60) {
                            setSeconds(parseInt(input as string));
                          }
                        }}
                        inputValue={
                          selected ? String(seconds).padStart(2, "0") : "--"
                        }
                        fontSize={"64px !important"}
                        fontWeight={600}
                        h={"64px"}
                        textAlign={"center"}
                        border={"none !important"}
                        _focus={{ border: "none !important" }}
                      />
                      {/* <P textAlign={"center"}>Detik</P> */}
                    </VStack>

                    <Btn
                      iconButton
                      aria-label="reduce second button"
                      variant={"outline"}
                      onClick={() => {
                        setSeconds((ps) => (ps > 0 ? ps - 1 : 59));
                        if (!selected) setSelected(DEFAULT_TIME);
                      }}
                      onMouseDown={() => handleHoldDecrement("seconds")}
                      onMouseUp={handleTapDecrement}
                      onMouseLeave={handleTapDecrement}
                      onTouchStart={() => handleHoldDecrement("seconds")}
                      onTouchEnd={handleTapDecrement}
                    >
                      <Icon fontSize={"md"}>
                        <IconCaretDownFilled />
                      </Icon>
                    </Btn>
                  </VStack>
                </>
              )}
            </HStack>
          </DisclosureBody>

          <DisclosureFooter>
            {showTimezone && (
              <CContainer mr={"auto"}>
                <P
                  color={"fg.subtle"}
                  fontSize={"xs"}
                  lineHeight={1.4}
                >{`${userTz.key}`}</P>
                <P
                  color={"fg.subtle"}
                  fontSize={"xs"}
                  lineHeight={1.4}
                >{`${userTz.formattedOffset}`}</P>
              </CContainer>
            )}

            <Btn
              variant={"outline"}
              onClick={() => {
                if (
                  !required &&
                  selected &&
                  hours === 0 &&
                  minutes === 0 &&
                  seconds === 0
                ) {
                  setSelected(undefined);
                  setHours(0);
                  setMinutes(0);
                  setSeconds(0);
                } else {
                  setSelected(DEFAULT_TIME);
                  setHours(0);
                  setMinutes(0);
                  setSeconds(0);
                }
              }}
            >
              {selected &&
              hours === 0 &&
              minutes === 0 &&
              seconds === 0 &&
              !required
                ? "Clear"
                : "Reset"}
            </Btn>
            <Btn
              onClick={onConfirmSelected}
              disabled={required ? !selected : false}
              colorPalette={themeConfig.colorPalette}
            >
              {l.confirm}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default TimePickerInput;
