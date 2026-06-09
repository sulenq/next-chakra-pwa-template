import { Btn, BtnProps } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { P, TNum } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { Tooltip } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/misc/icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { useScreen } from "@/hooks/use-screen";
import { ButtonVariant, DisclosureSizes } from "@/types/global.types";
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
import { Icon, Stack, useFieldContext } from "@chakra-ui/react";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";
import { ClockIcon } from "lucide-react";
import { useEffect, useRef, useState, forwardRef } from "react";

// -----------------------------------------------------------------

const DEFAULT_TIME = "00:00:00";

// -----------------------------------------------------------------

export interface TimePickerInputProps extends Omit<
  BtnProps,
  "onChange" | "defaultValue" | "value"
> {
  id?: string;
  name?: string;
  title?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value?: TimePickerInputProps["value"]) => void;
  withSeconds?: boolean;
  showTimezone?: boolean;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  variant?: ButtonVariant;
}

export const TimePickerInput = forwardRef<
  HTMLButtonElement,
  TimePickerInputProps
>(function TimePickerInput(props, ref) {
  // Props
  const {
    id,
    name,
    title,
    onChange,
    value,
    defaultValue,
    showTimezone = true,
    withSeconds = false,
    placeholder,
    required,
    invalid,
    disclosureSize = withSeconds ? "sm" : "xs",
    variant = "outline",
    ...restProps
  } = props;

  // Stores
  const fc = useFieldContext();
  const { theme } = useThemeStore();
  const { t } = useLocaleStore();

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
  const [internalValue, setInternalValue] = useState<string | null>(
    defaultValue ?? null,
  );

  // Hybrid: detect controlled mode
  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;

  const [selected, setSelected] = useState<string | null | undefined>(
    displayValue,
  );
  const [hours, setHours] = useState<number>(getHoursFromTime(displayValue));
  const [minutes, setMinutes] = useState<number>(
    getMinutesFromTime(displayValue),
  );
  const [seconds, setSeconds] = useState<number>(
    getSecondsFromTime(displayValue),
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
    if (required && !selected) return;
    const finalValue = selected ?? null;
    if (!isControlled) setInternalValue(finalValue);
    onChange?.(finalValue);
    back();
  }
  function handleEnterToConfirm(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleConfirm();
    }
  }

  // Update hours, minutes, seconds when value changes
  useEffect(() => {
    if (displayValue) {
      setHours(getHoursFromTime(displayValue));
      setMinutes(getMinutesFromTime(displayValue));
      setSeconds(getSecondsFromTime(displayValue));
    }
  }, [displayValue]);

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
        content={displayValue ? formatTime(displayValue) : resolvedPlaceholder}
      >
        <Btn
          ref={ref}
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
            if (displayValue) {
              setSelected(displayValue);
            }
            onOpen();
          }}
          {...restProps}
        >
          {displayValue ? (
            <P truncate>
              <TNum>
                {withSeconds
                  ? displayValue
                  : formatTime(displayValue, { timezoneKey: "UTC" })}
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
            <StackH
              align={"center"}
              justify={"space-between"}
              gap={1}
              wrap={wrapped ? "wrap" : ""}
              gapY={wrapped ? 4 : 0}
            >
              {/* Hours control */}
              <StackV flex={"1 1 120"} align={"stretch"} gap={0}>
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

                <StackV my={4}>
                  <StringInput
                    clearable={false}
                    name={"hour"}
                    value={selected ? String(hours).padStart(2, "0") : "--"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (parseInt(val) < 24) {
                        setHours(parseInt(val));
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
                </StackV>

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
              </StackV>

              {!wrapped && (
                <P fontSize={50} opacity={0.2} mt={-2}>
                  :
                </P>
              )}

              {/* Minutes control */}
              <StackV flex={"1 1 120"} align={"stretch"} gap={0}>
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

                <StackV my={4}>
                  <StringInput
                    clearable={false}
                    name={"minute"}
                    value={selected ? String(minutes).padStart(2, "0") : "--"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (parseInt(val) < 60) {
                        setMinutes(parseInt(val));
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
                </StackV>

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
              </StackV>

              {withSeconds && (
                <>
                  {!wrapped && (
                    <P fontSize={50} opacity={0.2} mt={-2}>
                      :
                    </P>
                  )}

                  {/* Seconds control */}
                  <StackV flex={"1 1 120"} align={"stretch"} gap={0}>
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

                    <StackV my={4}>
                      <StringInput
                        clearable={false}
                        name={"second"}
                        value={
                          selected ? String(seconds).padStart(2, "0") : "--"
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (parseInt(val) < 60) {
                            setSeconds(parseInt(val));
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
                    </StackV>

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
                  </StackV>
                </>
              )}
            </StackH>
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
              colorPalette={theme.colorPalette}
            >
              {t.confirm}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
});
