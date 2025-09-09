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
      boxProps,
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
      if (!rawInput) {
        setNum("");
        onChange?.(null);
        return;
      }

      let sanitizedInput = rawInput.replace(/[^0-9,]/g, "");

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

      // Parse number earlier to apply min/max before rendering
      let parsedValue = parseNumber(sanitizedInput);

      if (parsedValue !== undefined) {
        if (integer) parsedValue = Math.round(parsedValue!);

        // Apply max limit
        if (max !== undefined && parsedValue! > max) {
          parsedValue = max;
          sanitizedInput = String(max); // enforce max in UI
        }

        // Apply min limit
        if (min !== undefined && parsedValue! < min) {
          parsedValue = min;
          sanitizedInput = String(min); // enforce min in UI
        }
      }

      if (!formatted) {
        setNum(sanitizedInput);
        if (parsedValue !== undefined) onChange?.(parsedValue);
        return;
      }

      // Format value with thousand separators
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
        boxProps={boxProps}
        {...restProps}
      />
    );
  }
);

NumInput.displayName = "NumInput";
