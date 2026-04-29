"use client";

import { StringInput, StringInputProps } from "@/components/ui/string-input";
import { LucideIcon } from "@/components/widgets/icon";
import { BASE_ICON_BOX_SIZE, MAIN_INPUT_SIZE } from "@/constants/styles";
import { InputSize, InputVariant } from "@/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";
import {
  HStack,
  Icon,
  IconProps,
  InputGroup,
  InputGroupProps,
} from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";

// -----------------------------------------------------------------

export interface SearchInputProps extends Omit<
  InputGroupProps,
  "children" | "onChange"
> {
  queryKey: string;
  inputValue?: string;
  onChange?: (inputValue: string) => void;
  placeholder?: string;
  additionalPlaceholder?: string;
  tooltipLabel?: string;
  inputRef?: any;
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

export const SearchInput = (props: SearchInputProps) => {
  // Props
  const {
    inputRef,
    inputValue,
    onChange,
    tooltipLabel,
    placeholder,
    additionalPlaceholder = "",
    inputProps,
    icon,
    iconProps,
    invalid = false,
    noIcon = false,
    debounceTime = 200,
    queryKey = "q",
    variant = "outline",
    size = MAIN_INPUT_SIZE,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();

  // Hooks
  const searchParams = useSearchParams();
  const debounced = useDebouncedCallback((inputValue: string) => {
    onChange?.(inputValue);
  }, debounceTime);

  // States
  const [searchTemp, setSearchTemp] = useState<string>("");

  // Derived Values
  const resolvedPlacholder = additionalPlaceholder
    ? `${t.search} ${additionalPlaceholder}`
    : (placeholder ?? t.search);

  // Utils
  function handleChange(inputValue: string) {
    setSearchTemp(inputValue);
    debounced(inputValue);
  }

  // Initialize from URL or prop
  useEffect(() => {
    const queryValue = searchParams.get(queryKey);
    if (queryValue !== null) {
      setSearchTemp(queryValue);
      onChange?.(queryValue);
    } else {
      setSearchTemp(inputValue || "");
      onChange?.(inputValue || "");
    }
  }, [inputValue, queryKey]);

  // Update query string whenever search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTemp) params.set(queryKey, searchTemp);
    else params.delete(queryKey);

    // Use native history.replaceState to prevent rerender or scroll reset
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [searchTemp, queryKey]);

  return (
    <Tooltip content={inputValue || tooltipLabel || placeholder || t.search}>
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
        <HStack position={"relative"} w={"full"}>
          <StringInput
            ref={inputRef ? inputRef : null}
            pl={noIcon ? "16px" : "34px"}
            pr={"40px"}
            placeholder={resolvedPlacholder}
            onChange={handleChange}
            inputValue={searchTemp}
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
        </HStack>
      </InputGroup>
    </Tooltip>
  );
};
