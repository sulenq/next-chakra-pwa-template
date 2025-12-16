import { Props__NumInput } from "@/constants/props";
import { formatNumber } from "@/utils/formatter";
import { parseNumber } from "@/utils/number";
import { forwardRef, useEffect, useRef, useState } from "react";
import { StringInput } from "./string-input";

const MAX_INTEGER_DIGITS = 15;

export const NumInput = forwardRef<HTMLInputElement, Props__NumInput>(
  (props, ref) => {
    const {
      inputValue,
      onChange,
      placeholder = "Input number",
      invalid,
      containerProps,
      formatFunction,
      formatted = true,
      integer = true,
      min = 0,
      max,
      ...restProps
    } = props;

    const [num, setNum] = useState<string>("");

    const caretRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    useEffect(() => {
      if (inputValue !== undefined && inputValue !== null) {
        const valueToDisplay =
          integer && typeof inputValue === "number"
            ? Math.round(inputValue)
            : inputValue;

        const formattedValue = !formatted
          ? valueToDisplay.toString()
          : formatFunction
          ? formatFunction(valueToDisplay)
          : formatNumber(valueToDisplay);

        setNum(formattedValue || "");
      } else {
        setNum("");
      }
    }, [inputValue, formatFunction, formatted, integer]);

    function handleChange(rawInput?: string) {
      if (rawInput === undefined) return;

      if (inputRef.current) caretRef.current = inputRef.current.selectionStart;

      if (rawInput.trim() === "") {
        setNum("");
        onChange?.(null);
        return;
      }

      if (!/^[0-9.,]+$/.test(rawInput)) return;

      let sanitizedInput = rawInput;

      if (integer) {
        sanitizedInput = sanitizedInput.replace(/[.,]/g, "");
      } else {
        sanitizedInput = sanitizedInput.replace(/\./g, "");
      }

      if (integer) {
        sanitizedInput = sanitizedInput.replace(/^0+(?=\d)/, "");
      }

      const parts = sanitizedInput.split(",");
      if (parts[0].length > MAX_INTEGER_DIGITS) return;

      let parsedValue = parseNumber(sanitizedInput);

      if (parsedValue !== undefined) {
        if (integer) parsedValue = Math.round(parsedValue!);

        if (!Number.isSafeInteger(parsedValue)) return;

        if (max !== undefined && parsedValue! > max) {
          parsedValue = max;
          sanitizedInput = String(max);
        }

        if (min !== undefined && parsedValue! < min) {
          parsedValue = min;
          sanitizedInput = String(min);
        }
      }

      if (!formatted) {
        setNum(sanitizedInput);
        if (parsedValue !== undefined) onChange?.(parsedValue);
        return;
      }

      let formattedValue = sanitizedInput.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      if (!integer && sanitizedInput.includes(",")) {
        const s = sanitizedInput.split(",");
        formattedValue = `${s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${
          s[1]
        }`;
      }

      setNum(formattedValue);
      if (parsedValue !== undefined) onChange?.(parsedValue);

      requestAnimationFrame(() => {
        if (!inputRef.current || caretRef.current === null) return;

        const digitsBeforeCaret = rawInput
          .slice(0, caretRef.current)
          .replace(/[^0-9]/g, "").length;

        let digitCount = 0;
        let nextCaret = formattedValue.length;

        for (let i = 0; i < formattedValue.length; i++) {
          if (/[0-9]/.test(formattedValue[i])) digitCount++;
          if (digitCount === digitsBeforeCaret) {
            nextCaret = i + 1;
            break;
          }
        }

        inputRef.current.setSelectionRange(nextCaret, nextCaret);
      });
    }

    return (
      <StringInput
        ref={inputRef}
        onChange={handleChange}
        inputValue={num}
        invalid={invalid}
        placeholder={placeholder}
        containerProps={containerProps}
        fontVariantNumeric={"tabular-nums"}
        {...restProps}
      />
    );
  }
);

NumInput.displayName = "NumInput";
