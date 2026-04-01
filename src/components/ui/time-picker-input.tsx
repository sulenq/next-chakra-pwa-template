import { Btn, BtnProps } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { P, TNum } from "@/components/ui/p";
import { StringInput } from "@/components/ui/string-input";
import { Tooltip } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/widgets/icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { ButtonVariant, DisclosureSizes } from "@/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { useScreen } from "@/hooks/useScreen";
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
import { HStack, Icon, Stack, useFieldContext, VStack } from "@chakra-ui/react";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";
import { ClockIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

const DEFAULT_TIME = "00:00:00";

// -----------------------------------------------------------------

export interface TimePickerInputProps extends Omit<BtnProps, "onChange"> {
  id?: string;
  name?: string;
  title?: string;
  inputValue?: string | null;
  onChange?: (inputValue?: TimePickerInputProps["inputValue"]) => void;
  withSeconds?: boolean;
  showTimezone?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  variant?: ButtonVariant;
}

export const TimePickerInput = (props: TimePickerInputProps) => {
  // Props
  const {
    id,
    name,
    title,
    onChange,
    inputValue,
    showTimezone = true,
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
  const { t } = useLocale();

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(id || "time-picker-input"),
  );
  const { sw } = useScreen();
  const wrapped = sw < 450 && withSeconds;

  // Refs
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

  // States
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

  // Constants
  const userTz = getUserTimezone();

  // Derived Values
  const resolvedPlaceholder = placeholder ?? t.select_time;
  const resolvedInvalid = invalid ?? fc?.invalid;

  // Utils
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
  function handleConfirm() {
    if (!required) {
      onChange?.(selected ?? null);
      back();
    }
  }
  function handleEnterToConfirm(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleConfirm();
    }
  }

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

  return (
    <>
      <Tooltip
        content={inputValue ? formatTime(inputValue) : resolvedPlaceholder}
      >
        <Btn
          name={name}
          justifyContent={"space-between"}
          gap={4}
          variant={variant}
          w={"full"}
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
            <P truncate>
              <TNum>
                {withSeconds
                  ? inputValue
                  : formatTime(inputValue, { timezoneKey: "UTC" })}
              </TNum>
            </P>
          ) : (
            <P
              truncate
              color={props?._placeholder?.color || "var(--placeholder)"}
            >
              {resolvedPlaceholder}
            </P>
          )}

          <Icon boxSize={BASE_ICON_BOX_SIZE} color={"fg.subtle"} mr={-1}>
            <LucideIcon icon={ClockIcon} />
          </Icon>
        </Btn>
      </Tooltip>

      <Disclosure.Root open={open} size={disclosureSize}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent
              title={capitalizeWords(title || t.select_time)}
            />
          </Disclosure.Header>

          <Disclosure.Body>
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
                  aria-label={"add hour button"}
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
                  <Icon>
                    <IconCaretUpFilled />
                  </Icon>
                </Btn>

                <VStack my={4}>
                  <StringInput
                    clearable={false}
                    name={"hour"}
                    inputValue={
                      selected ? String(hours).padStart(2, "0") : "--"
                    }
                    onChange={(input) => {
                      if (parseInt(input as string) < 24) {
                        setHours(parseInt(input as string));
                      }
                    }}
                    onKeyDown={handleEnterToConfirm}
                    h={"64px"}
                    fontFamily={"number"}
                    fontVariantNumeric={"tabular-nums"}
                    fontSize={"64px !important"}
                    fontWeight={"400"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                  />
                  {/* <P textAlign={"center"}>Jam</P> */}
                </VStack>

                <Btn
                  iconButton
                  size={"sm"}
                  aria-label={"reduce hour button"}
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
                  aria-label={"add minute button"}
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
                  <Icon>
                    <IconCaretUpFilled />
                  </Icon>
                </Btn>

                <VStack my={4}>
                  <StringInput
                    clearable={false}
                    name={"minute"}
                    inputValue={
                      selected ? String(minutes).padStart(2, "0") : "--"
                    }
                    onChange={(input) => {
                      if (parseInt(input as string) < 60) {
                        setMinutes(parseInt(input as string));
                      }
                    }}
                    onKeyDown={handleEnterToConfirm}
                    h={"64px"}
                    fontFamily={"number"}
                    fontVariantNumeric={"tabular-nums"}
                    fontSize={"64px !important"}
                    fontWeight={"400"}
                    textAlign={"center"}
                    border={"none !important"}
                    _focus={{ border: "none !important" }}
                  />
                  {/* <P textAlign={"center"}>Menit</P> */}
                </VStack>

                <Btn
                  iconButton
                  size={"sm"}
                  aria-label={"reduce minute button"}
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
                      aria-label={"add second button"}
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
                      <Icon>
                        <IconCaretUpFilled />
                      </Icon>
                    </Btn>

                    <VStack my={4}>
                      <StringInput
                        clearable={false}
                        name={"second"}
                        inputValue={
                          selected ? String(seconds).padStart(2, "0") : "--"
                        }
                        onChange={(input) => {
                          if (parseInt(input as string) < 60) {
                            setSeconds(parseInt(input as string));
                          }
                        }}
                        onKeyDown={handleEnterToConfirm}
                        h={"64px"}
                        fontFamily={"number"}
                        fontVariantNumeric={"tabular-nums"}
                        fontSize={"64px !important"}
                        fontWeight={"400"}
                        textAlign={"center"}
                        border={"none !important"}
                        _focus={{ border: "none !important" }}
                      />
                      {/* <P textAlign={"center"}>Detik</P> */}
                    </VStack>

                    <Btn
                      iconButton
                      aria-label={"reduce second button"}
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
                      <Icon>
                        <IconCaretDownFilled />
                      </Icon>
                    </Btn>
                  </VStack>
                </>
              )}
            </HStack>
          </Disclosure.Body>

          <Disclosure.Footer>
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
                >{`${userTz.localAbbr}`}</P>
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
              onClick={handleConfirm}
              disabled={required ? !selected : false}
              colorPalette={themeConfig.colorPalette}
            >
              {t.confirm}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};
