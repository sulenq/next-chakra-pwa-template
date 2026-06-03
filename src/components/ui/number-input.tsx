"use client";

import { StringInput } from "@/components/ui/string-input";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useMergedRefs } from "@/hooks/use-merge-refs";
import { formatNumber } from "@/utils/formatter";
import { InputProps, StackProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useRef } from "react";

// -----------------------------------------------------------------

const MAX_INTEGER_DIGITS = 15;

// -----------------------------------------------------------------

export interface NumInputProps extends Omit<
  InputProps,
  "onChange" | "value" | "defaultValue"
> {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  invalid?: boolean;
  containerProps?: StackProps;
  formatFunction?: (value: number | null) => string;
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
      value,
      defaultValue,
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

    // Hybrid: detect controlled mode
    const isControlled = value !== undefined;

    // Stores
    const { t } = useLocaleStore();

    // Refs
    const caretRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const mergeRef = useMergedRefs(inputRef, ref);

    // Derived Values
    const isID = locale === "id-ID";
    const decimalSep = isID ? "," : ".";
    const thousandSep = isID ? "." : ",";
    const resolvedPlaceholder =
      placeholder ?? (integer ? t.number_input : t.decimal_input);

    // Utils: format a number into display string (used for defaultValue)
    function toDisplayValue(val: number | null | undefined): string {
      if (val === null || val === undefined) return "";
      const v = integer ? Math.round(val) : val;
      if (!formatted) return v.toString().replace(".", decimalSep);
      if (formatFunction) return formatFunction(v);
      return formatNumber(v, locale) || "";
    }

    // Handle change from StringInput (React.ChangeEvent)
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const rawInput = e.target.value;

      if (inputRef.current) caretRef.current = inputRef.current.selectionStart;

      const escapedThousand = thousandSep === "." ? "\\." : thousandSep;

      if (rawInput.trim() === "") {
        if (inputRef.current) inputRef.current.value = "";
        onChange?.(null);
        return;
      }

      // 1. Sanitize: Remove all thousand separators
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

      // 5. Create numeric value for backend (always dot-based)
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

      // 6. Visual Formatting — write directly to DOM (uncontrolled)
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

      if (inputRef.current) inputRef.current.value = displayValue;

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

    // Sync controlled value to DOM (keeps formatting correct without
    // fighting React's controlled-input re-render cycle)
    useEffect(() => {
      if (isControlled && inputRef.current) {
        inputRef.current.value = toDisplayValue(value ?? null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, isControlled]);

    return (
      <StringInput
        ref={mergeRef}
        defaultValue={toDisplayValue(isControlled ? value : defaultValue)}
        onChange={handleChange}
        invalid={invalid}
        placeholder={resolvedPlaceholder}
        containerProps={containerProps}
        fontVariantNumeric={"tabular-nums"}
        {...restProps}
      />
    );
  },
);
