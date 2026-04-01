"use client";

import { StringInput } from "@/components/ui/string-input";
import { useLocale } from "@/contexts/useLocale";
import { useMergedRefs } from "@/hooks/useMergeRefs";
import { formatNumber } from "@/utils/formatter";
import { parseNumber } from "@/utils/number";
import { InputProps, StackProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

const MAX_INTEGER_DIGITS = 15;

// -----------------------------------------------------------------

export interface NumInputProps extends Omit<InputProps, "onChange"> {
  inputValue?: number | null;
  onChange?: (inputValue: number | null) => void;
  placeholder?: string;
  invalid?: boolean;
  containerProps?: StackProps;
  formatFunction?: (inputValue: number | null) => string;
  formatted?: boolean;
  integer?: boolean;
  min?: number;
  max?: number;
  locale?: "id-ID" | "en-US";
  maxFractionDigits?: number;
  clearButtonProps?: StackProps;
  clearable?: boolean;
}

export const NumInput = forwardRef<HTMLInputElement, NumInputProps>(
  function NumInput(props, ref) {
    // Props
    const {
      inputValue,
      onChange,
      placeholder,
      invalid,
      containerProps,
      formatFunction,
      formatted = true,
      integer = true,
      min = 0,
      max,
      locale = "id-ID",
      maxFractionDigits = 4,
      ...restProps
    } = props;

    // Contexts
    const { t } = useLocale();

    // Refs
    const caretRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mergeRef = useMergedRefs(inputRef, ref);

    // States
    const [numString, setNumString] = useState<string>("");

    // Derived Values
    const isID = locale === "id-ID";
    const decimalSep = isID ? "," : ".";
    const thousandSep = isID ? "." : ",";
    const resolvedPlaceholder =
      placeholder ?? (integer ? t.number_input : t.decimal_input);

    // Utils
    function handleChange(rawInput?: string) {
      if (rawInput === undefined) return;
      if (inputRef.current) caretRef.current = inputRef.current.selectionStart;

      if (rawInput.trim() === "") {
        setNumString("");
        onChange?.(null);
        return;
      }

      // 1. Sanitize: Remove all thousand separators
      const escapedThousand = thousandSep === "." ? "\\." : thousandSep;
      let cleanNode = rawInput.replace(new RegExp(escapedThousand, "g"), "");

      // 2. Mode enforcement
      if (integer) {
        cleanNode = cleanNode.replace(/[^0-9]/g, "");
      } else {
        const escapedDecimal = decimalSep === "." ? "\\." : decimalSep;

        cleanNode = cleanNode.replace(
          new RegExp(`[^0-9${escapedDecimal}]`, "g"),
          "",
        );

        const decimalCount = (
          cleanNode.match(new RegExp(escapedDecimal, "g")) || []
        ).length;

        if (decimalCount > 1) return;
      }

      // 3. Leading Zeros
      if (
        cleanNode.length > 1 &&
        cleanNode.startsWith("0") &&
        cleanNode[1] !== decimalSep
      ) {
        cleanNode = cleanNode.replace(/^0+/, "");
        if (cleanNode === "" || cleanNode.startsWith(decimalSep))
          cleanNode = "0" + cleanNode;
      }

      // 4. Split for processing
      const parts = cleanNode.split(decimalSep);
      const intPart = parts[0];
      let decPart = parts[1];

      if (intPart.length > MAX_INTEGER_DIGITS) return;

      if (!integer && decPart !== undefined) {
        decPart = decPart.slice(0, maxFractionDigits);
        cleanNode = `${intPart}${decimalSep}${decPart}`;
      }

      // 5. Create numeric value for Backend (always dot-based)
      let numericValue: number | null = null;

      if (intPart || decPart !== undefined) {
        const normalized =
          decPart !== undefined ? `${intPart}.${decPart}` : intPart;

        const parsed = Number(normalized);

        if (!Number.isNaN(parsed)) {
          numericValue = parsed;

          if (integer) numericValue = Math.round(numericValue);
          if (max !== undefined && numericValue > max) numericValue = max;
          if (min !== undefined && numericValue < min) numericValue = min;
        }
      }

      // 6. Visual Formatting
      let displayValue = cleanNode;
      if (formatted) {
        const formattedInt = intPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          thousandSep,
        );
        displayValue =
          decPart !== undefined
            ? `${formattedInt}${decimalSep}${decPart}`
            : formattedInt;
      }

      setNumString(displayValue);

      // 7. Prevent '1,2' -> '12' by not updating parent on hanging decimal
      if (!cleanNode.endsWith(decimalSep) && numericValue !== null) {
        onChange?.(numericValue);
      }

      // 8. Caret positioning
      requestAnimationFrame(() => {
        if (!inputRef.current || caretRef.current === null) return;
        const rawCharsBefore = rawInput
          .slice(0, caretRef.current)
          .replace(new RegExp(escapedThousand, "g"), "");
        const charsCountBefore = rawCharsBefore.length;

        let newPos = 0;
        let foundChars = 0;
        for (let i = 0; i < displayValue.length; i++) {
          if (displayValue[i] !== thousandSep) foundChars++;
          newPos = i + 1;
          if (foundChars >= charsCountBefore) break;
        }
        inputRef.current.setSelectionRange(newPos, newPos);
      });
    }

    // Sync external prop to internal state
    useEffect(() => {
      if (inputValue !== undefined && inputValue !== null) {
        const val = integer ? Math.round(inputValue) : inputValue;

        // Guard: Don't overwrite if numeric value is identical and user is typing a decimal
        const currentInternal = parseNumber(
          numString
            .replace(new RegExp(`\\${thousandSep}`, "g"), "")
            .replace(decimalSep, "."),
        );
        if (currentInternal === val && numString.includes(decimalSep)) return;

        const formattedValue = !formatted
          ? val.toString().replace(".", decimalSep)
          : formatFunction
            ? formatFunction(val)
            : formatNumber(val, locale);

        setNumString(formattedValue || "");
      } else {
        if (numString !== "") setNumString("");
      }
    }, [inputValue, locale, formatted, integer]);

    return (
      <StringInput
        ref={mergeRef}
        onChange={handleChange}
        inputValue={numString}
        invalid={invalid}
        placeholder={resolvedPlaceholder}
        containerProps={containerProps}
        fontVariantNumeric={"tabular-nums"}
        {...restProps}
      />
    );
  },
);
