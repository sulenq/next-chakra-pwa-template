import { Btn } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import { StringInput } from "@/components/ui/string-input";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__TimePicker } from "@/constants/props";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useScreen from "@/hooks/useScreen";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
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
  Stack,
  useDisclosure,
  useFieldContext,
  VStack,
} from "@chakra-ui/react";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";
import { ClockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "./tooltip";

const DEFAULT = "00:00:00";

export const TimePickerInput = (props: Props__TimePicker) => {
  // Props
  const {
    id,
    name,
    title,
    onChange,
    inputValue,
    showTimezone,
    withSeconds = false,
    placeholder,
    required,
    invalid,
    disclosureSize = withSeconds ? "sm" : "xs",
    variant = "outline",
    ...restProps
  } = props;

  // Contexts
  const fc = useFieldContext();
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States
  const resolvedInvalid = invalid ?? fc?.invalid;
  const userTz = getUserTimezone();
  const resolvedPlaceholder = placeholder || l.select_time;
  const [selected, setSelected] = useState<string | null | undefined>(
    inputValue,
  );
  const [hours, setHours] = useState<number>(getHoursFromTime(inputValue));
  const [minutes, setMinutes] = useState<number>(
    getMinutesFromTime(inputValue),
  );
  const [seconds, setSeconds] = useState<number>(
    getSecondsFromTime(inputValue),
  );
  const intervalIncrementRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const timeoutIncrementRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const intervalDecrementRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const timeoutDecrementRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const renderValue = formatTime(inputValue);

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(id || `time-picker${name ? `-${name}` : ""}`),
    open,
    onOpen,
    onClose,
  );
  const { sw } = useScreen();
  const wrapped = sw < 450 && withSeconds;

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
    if (!required) {
      if (selected) {
        onChange?.(selected);
      } else {
        onChange?.(null);
      }
      back();
    }
  }

  return (
    <>
      <Tooltip content={inputValue ? renderValue : resolvedPlaceholder}>
        <Btn
          w={"full"}
          gap={4}
          justifyContent={"space-between"}
          variant={variant}
          border={"1px solid"}
          borderColor={
            resolvedInvalid
              ? "border.error"
              : variant === "subtle"
                ? "transparent"
                : "border.muted"
          }
          onClick={() => {
            if (inputValue) {
              setSelected(inputValue);
            }
            onOpen();
          }}
          {...restProps}
        >
          {inputValue ? (
            <P truncate fontVariantNumeric={"tabular-nums"}>
              {withSeconds
                ? inputValue
                : formatTime(inputValue, { timezoneKey: "UTC" })}
            </P>
          ) : (
            <P
              truncate
              color={props?._placeholder?.color || "var(--placeholder)"}
              fontVariantNumeric={"tabular-nums"}
            >
              {resolvedPlaceholder}
            </P>
          )}

          <Icon boxSize={BASE_ICON_BOX_SIZE} color={"fg.subtle"} mr={-1}>
            <LucideIcon icon={ClockIcon} />
          </Icon>
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
              wrap={wrapped ? "wrap" : ""}
              gapY={wrapped ? 4 : 0}
            >
              {/* Hours control */}
              <VStack flex={"1 1 120"} align={"stretch"} gap={0}>
                <Btn
                  iconButton
                  size={"sm"}
                  aria-label="add hour button"
                  variant={"outline"}
                  onClick={() => {
                    setHours((ps) => (ps < 23 ? ps + 1 : 0));
                    if (!selected) setSelected(DEFAULT);
                  }}
                  onMouseDown={() => handleHoldIncrement("hours")}
                  onMouseUp={handleTapIncrement}
                  onMouseLeave={handleTapIncrement}
                  onTouchStart={() => handleHoldIncrement("hours")}
                  onTouchEnd={handleTapIncrement}
                >
                  <Icon>
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
                    fontWeight={"400"}
                    fontVariantNumeric={"tabular-nums"}
                    h={"64px"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                    className="num"
                  />
                  {/* <P textAlign={"center"}>Jam</P> */}
                </VStack>

                <Btn
                  iconButton
                  size={"sm"}
                  aria-label="reduce hour button"
                  variant={"outline"}
                  onClick={() => {
                    setHours((ps) => (ps > 0 ? ps - 1 : 23));
                    if (!selected) setSelected(DEFAULT);
                  }}
                  onMouseDown={() => handleHoldDecrement("hours")}
                  onMouseUp={handleTapDecrement}
                  onMouseLeave={handleTapDecrement}
                  onTouchStart={() => handleHoldDecrement("hours")}
                  onTouchEnd={handleTapDecrement}
                >
                  <Icon>
                    <IconCaretDownFilled />
                  </Icon>
                </Btn>
              </VStack>

              {!wrapped && (
                <P fontSize={50} opacity={0.2} mt={-2}>
                  :
                </P>
              )}

              {/* Minutes control */}
              <VStack flex={"1 1 120"} align={"stretch"} gap={0}>
                <Btn
                  iconButton
                  size={"sm"}
                  aria-label="add minute button"
                  variant={"outline"}
                  onClick={() => {
                    setMinutes((ps) => (ps < 59 ? ps + 1 : 0));
                    if (!selected) setSelected(DEFAULT);
                  }}
                  onMouseDown={() => handleHoldIncrement("minutes")}
                  onMouseUp={handleTapIncrement}
                  onMouseLeave={handleTapIncrement}
                  onTouchStart={() => handleHoldIncrement("minutes")}
                  onTouchEnd={handleTapIncrement}
                >
                  <Icon>
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
                    fontWeight={"400"}
                    fontVariantNumeric={"tabular-nums"}
                    h={"64px"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                    className="num"
                  />
                  {/* <P textAlign={"center"}>Menit</P> */}
                </VStack>

                <Btn
                  iconButton
                  size={"sm"}
                  aria-label="reduce minute button"
                  variant={"outline"}
                  onClick={() => {
                    setMinutes((ps) => (ps > 0 ? ps - 1 : 59));
                    if (!selected) setSelected(DEFAULT);
                  }}
                  onMouseDown={() => handleHoldDecrement("minutes")}
                  onMouseUp={handleTapDecrement}
                  onMouseLeave={handleTapDecrement}
                  onTouchStart={() => handleHoldDecrement("minutes")}
                  onTouchEnd={handleTapDecrement}
                >
                  <Icon>
                    <IconCaretDownFilled />
                  </Icon>
                </Btn>
              </VStack>

              {withSeconds && (
                <>
                  {!wrapped && (
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
                        if (!selected) setSelected(DEFAULT);
                      }}
                      onMouseDown={() => handleHoldIncrement("seconds")}
                      onMouseUp={handleTapIncrement}
                      onMouseLeave={handleTapIncrement}
                      onTouchStart={() => handleHoldIncrement("seconds")}
                      onTouchEnd={handleTapIncrement}
                    >
                      <Icon>
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
                        fontWeight={"400"}
                        fontVariantNumeric={"tabular-nums"}
                        h={"64px"}
                        textAlign={"center"}
                        border={"none !important"}
                        _focus={{ border: "none !important" }}
                        className="num"
                      />
                      {/* <P textAlign={"center"}>Detik</P> */}
                    </VStack>

                    <Btn
                      iconButton
                      aria-label="reduce second button"
                      variant={"outline"}
                      onClick={() => {
                        setSeconds((ps) => (ps > 0 ? ps - 1 : 59));
                        if (!selected) setSelected(DEFAULT);
                      }}
                      onMouseDown={() => handleHoldDecrement("seconds")}
                      onMouseUp={handleTapDecrement}
                      onMouseLeave={handleTapDecrement}
                      onTouchStart={() => handleHoldDecrement("seconds")}
                      onTouchEnd={handleTapDecrement}
                    >
                      <Icon>
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
              <Stack
                flexDir={["row", null, "column"]}
                justify={"space-between"}
                mr={[0, null, "auto"]}
              >
                <P
                  color={"fg.subtle"}
                  fontSize={"sm"}
                  lineHeight={1}
                >{`${userTz.key}`}</P>
                <P
                  color={"fg.subtle"}
                  fontSize={"sm"}
                  lineHeight={1}
                >{`${userTz.formattedOffset}`}</P>
              </Stack>
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
                  setSelected(DEFAULT);
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
