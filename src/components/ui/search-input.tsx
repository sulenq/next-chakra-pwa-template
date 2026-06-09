"use client";

import { LucideIcon } from "@/components/misc/icon";
import { StackH } from "@/components/ui/stack";
import { StringInput, StringInputProps } from "@/components/ui/string-input";
import { Tooltip } from "@/components/ui/tooltip";
import { MAIN_INPUT_SIZE } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useDebounced } from "@/hooks/use-debounced";
import { InputSize, InputVariant } from "@/types/global.types";
import { Icon, IconProps, InputGroup, InputGroupProps } from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface SearchInputProps extends Omit<
  InputGroupProps,
  "children" | "onChange" | "defaultValue"
> {
  queryKey?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  additionalPlaceholder?: string;
  tooltipLabel?: string;
  inputProps?: StringInputProps;
  icon?: any;
  iconProps?: IconProps;
  invalid?: boolean;
  noIcon?: boolean;
  debounceTime?: number;
  children?: React.ReactNode;
  variant?: InputVariant;
  size?: InputSize;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(props, ref) {
    // Props
    const {
      value,
      defaultValue,
      onChange,
      tooltipLabel,
      placeholder,
      additionalPlaceholder = "",
      inputProps,
      icon,
      iconProps,
      invalid = false,
      noIcon = false,
      debounceTime = 400,
      queryKey = "q",
      variant = "outline",
      size = MAIN_INPUT_SIZE,
      ...restProps
    } = props;

    // Hybrid: detect controlled mode
    const isControlled = value !== undefined;

    // Stores
    const { t } = useLocaleStore();

    // Hooks
    const searchParams = useSearchParams();

    // States
    const [displayValue, setDisplayValue] = useState<string>(() => {
      if (isControlled) return value || "";

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const queryValue = params.get(queryKey);
        if (queryValue !== null) return queryValue;
      }
      return defaultValue || "";
    });

    useEffect(() => {
      if (isControlled && value !== undefined) {
        setDisplayValue(value);
      }
    }, [value, isControlled]);

    const triggerDebouncedUpdates = useDebounced((val: string) => {
      onChange?.(val);

      const params = new URLSearchParams(window.location.search);
      if (val) {
        params.set(queryKey, val);
      } else {
        params.delete(queryKey);
      }
      window.history.replaceState(null, "", `?${params.toString()}`);
    }, debounceTime);

    // Derived Values
    const resolvedPlaceholder = additionalPlaceholder
      ? `${t.search} ${additionalPlaceholder}`
      : (placeholder ?? t.search);

    // Utils
    function handleChange(val: string) {
      setDisplayValue(val);
      triggerDebouncedUpdates(val);
    }

    // Initialize from URL or prop (run only when queryKey changes)
    useEffect(() => {
      const queryValue = searchParams.get(queryKey);
      const initialVal = queryValue !== null ? queryValue : defaultValue || "";

      if (!isControlled) {
        setDisplayValue(initialVal);
        onChange?.(initialVal);
      }
    }, [queryKey]);

    return (
      <Tooltip
        content={displayValue || tooltipLabel || placeholder || t.search}
      >
        <InputGroup
          w={"full"}
          startElement={
            !noIcon && (
              <Icon
                boxSize={4}
                color={"fg.subtle"}
                ml={"-1px"}
                mt={"1px"}
                {...iconProps}
              >
                {icon || <LucideIcon icon={SearchIcon} />}
              </Icon>
            )
          }
          {...restProps}
        >
          <StackH align={"center"} position={"relative"} w={"full"}>
            <StringInput
              ref={ref}
              pl={noIcon ? "16px" : "34px"}
              pr={"40px"}
              placeholder={resolvedPlaceholder}
              onChange={(e: any) => handleChange(e.target.value)}
              value={displayValue}
              size={size}
              borderColor={
                invalid
                  ? "border.error"
                  : inputProps?.variant === "subtle" || variant === "subtle"
                    ? "transparent"
                    : "border.muted"
              }
              variant={variant}
              {...inputProps}
            />
          </StackH>
        </InputGroup>
      </Tooltip>
    );
  },
);
