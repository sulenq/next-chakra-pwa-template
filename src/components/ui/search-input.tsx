"use client";

import { StackH } from "@/components/ui/stack";
import { StringInput, StringInputProps } from "@/components/ui/string-input";
import { Tooltip } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/misc/icon";
import { BASE_ICON_BOX_SIZE, MAIN_INPUT_SIZE } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useDebounced } from "@/hooks/use-debounced";
import { InputSize, InputVariant } from "@/types/global.types";
import { Icon, IconProps, InputGroup, InputGroupProps } from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, forwardRef } from "react";

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
    const debounced = useDebounced((value: string) => {
      onChange?.(value);
    }, debounceTime);

    // States
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const queryValue = params.get(queryKey);
        if (queryValue !== null) return queryValue;
      }
      return defaultValue || "";
    });

    const searchTemp = isControlled ? value : internalValue;

    // Derived Values
    const resolvedPlacholder = additionalPlaceholder
      ? `${t.search} ${additionalPlaceholder}`
      : (placeholder ?? t.search);

    // Utils
    function handleChange(val: string) {
      if (!isControlled) setInternalValue(val);
      debounced(val);
    }

    // Initialize from URL or prop (run only when queryKey changes)
    useEffect(() => {
      const queryValue = searchParams.get(queryKey);
      if (queryValue !== null) {
        if (!isControlled) setInternalValue(queryValue);
        onChange?.(queryValue);
      } else {
        if (!isControlled) setInternalValue(defaultValue || "");
        onChange?.(defaultValue || "");
      }
    }, [queryKey]);

    // Update query string whenever search changes
    useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTemp) params.set(queryKey, searchTemp);
      else params.delete(queryKey);

      // Use native history.replaceState to prevent rerender or scroll reset
      window.history.replaceState(null, "", `?${params.toString()}`);
    }, [searchTemp, queryKey]);

    return (
      <Tooltip content={value || tooltipLabel || placeholder || t.search}>
        <InputGroup
          w={"full"}
          startElement={
            !noIcon && (
              <Icon
                boxSize={BASE_ICON_BOX_SIZE}
                color={"fg.subtle"}
                ml={"-2px"}
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
              placeholder={resolvedPlacholder}
              onChange={(e: any) => handleChange(e.target.value)}
              value={searchTemp}
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
