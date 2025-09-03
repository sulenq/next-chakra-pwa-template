import { Props__NumInput } from "@/constants/props";
import { formatNumber } from "@/utils/formatter";
import { parseNumber } from "@/utils/number";
import { forwardRef, useEffect, useState } from "react";
import { StringInput } from "./string-input";

export const NumInput = forwardRef<HTMLInputElement, Props__NumInput>(
  (props, ref) => {
    // Props
    const {
      id,
      inputValue,
      onChange,
      placeholder = `${new Date().getFullYear()}`,
      invalid,
      boxProps,
      formatFunction,
      formatted,
      integer,
      min,
      max,
      ...restProps
    } = props;

    // States
    const [localInputValue, setLocalInputValue] = useState<string>("");

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

        setLocalInputValue(formattedValue || "");
      }
    }, [inputValue, formatFunction, formatted, integer]);

    // Utils
    function handleChange(rawInput: string) {
      if (!rawInput) {
        setLocalInputValue("");
        onChange?.(null);
        return;
      }

      // remove non-numeric characters
      let sanitizedInput = rawInput.replace(/[^0-9,]/g, "");

      // if integer = true, remove commas
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

      // limit max 19 char
      if (sanitizedInput.length > 19) {
        sanitizedInput = sanitizedInput.substring(0, 19);
      }

      // if formatted = false, show without formatting
      if (!formatted) {
        setLocalInputValue(sanitizedInput);
        const parsedValue = parseNumber(sanitizedInput);
        if (parsedValue !== undefined && onChange) {
          onChange(parsedValue);
        }
        return;
      }

      // if formatted = true, show with formatting
      let formattedValue = sanitizedInput.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      if (!integer && sanitizedInput.includes(",")) {
        const parts = sanitizedInput.split(",");
        if (parts.length === 2) {
          formattedValue = `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${
            parts[1]
          }`;
        }
      }

      // parse number
      let parsedValue = parseNumber(formattedValue);

      // if integer = true, round
      if (integer && parsedValue !== undefined) {
        parsedValue = Math.round(parsedValue!);
      }

      // if parsedValue > max, set to max
      if (parsedValue !== undefined && max && parsedValue! > max) {
        setLocalInputValue(formatNumber(max));
        if (onChange) onChange(max);
        return;
      }

      // if parsedValue < min, set to min
      if (parsedValue !== undefined && min && parsedValue! < min) {
        setLocalInputValue(formatNumber(min));
        if (onChange) onChange(min);
        return;
      }

      // set localInputValue
      setLocalInputValue(formattedValue);

      // onChange
      if (parsedValue !== undefined) {
        onChange?.(parsedValue);
      }
    }

    return (
      <StringInput
        ref={ref}
        onChange={handleChange}
        inputValue={localInputValue}
        invalid={invalid}
        placeholder={placeholder}
        boxProps={boxProps}
        {...restProps}
      />
    );
  }
);

NumInput.displayName = "NumInput";
