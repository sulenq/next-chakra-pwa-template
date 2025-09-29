import { Props__NumInput } from "@/constants/props";
import { formatNumber } from "@/utils/formatter";
import { parseNumber } from "@/utils/number";
import { forwardRef, useEffect, useState } from "react";
import { StringInput } from "./string-input";

export const NumInput = forwardRef<HTMLInputElement, Props__NumInput>(
  (props, ref) => {
    // Props
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

    // States
    const [num, setNum] = useState<string>("");

    useEffect(() => {
      if (inputValue !== undefined && inputValue !== null) {
        // if integer = true, round inputValue
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

    // Utils
    function handleChange(rawInput?: string) {
      if (rawInput === undefined) return;

      // case: nothing
      if (rawInput.trim() === "") {
        setNum("");
        onChange?.(null);
        return;
      }

      // hanya izinkan digit + koma
      const isValid = /^[0-9,]+$/.test(rawInput);
      if (!isValid) {
        // kalau huruf → jangan ubah state/value sama sekali
        return;
      }

      let sanitizedInput = rawInput;

      if (integer) {
        sanitizedInput = sanitizedInput.replace(/,/g, "");
      }

      const commaIndex = sanitizedInput.indexOf(",");
      if (
        !integer &&
        commaIndex !== -1 &&
        sanitizedInput.lastIndexOf(",") !== commaIndex
      ) {
        return;
      }

      if (sanitizedInput.length > 19) {
        sanitizedInput = sanitizedInput.substring(0, 19);
      }

      // Parse number
      let parsedValue = parseNumber(sanitizedInput);

      if (parsedValue !== undefined) {
        if (integer) parsedValue = Math.round(parsedValue!);

        // max
        if (max !== undefined && parsedValue! > max) {
          parsedValue = max;
          sanitizedInput = String(max);
        }

        // min
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

      // thousand separator
      let formattedValue = sanitizedInput.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      if (!integer && sanitizedInput.includes(",")) {
        const parts = sanitizedInput.split(",");
        if (parts.length === 2) {
          formattedValue = `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${
            parts[1]
          }`;
        }
      }

      setNum(formattedValue);
      if (parsedValue !== undefined) onChange?.(parsedValue);
    }

    return (
      <StringInput
        ref={ref}
        onChange={handleChange}
        inputValue={num}
        invalid={invalid}
        placeholder={placeholder}
        containerProps={containerProps}
        {...restProps}
      />
    );
  }
);

NumInput.displayName = "NumInput";
