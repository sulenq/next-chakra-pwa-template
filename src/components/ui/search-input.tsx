"use client";

import { StringInput } from "@/components/ui/string-input";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__SearchInput } from "@/constants/props";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";
import { HStack, Icon, InputGroup } from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tooltip } from "./tooltip";

export default function SearchInput(props: Props__SearchInput) {
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
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();

  // Next navigation utils
  const searchParams = useSearchParams();

  // Hooks
  const debounced = useDebouncedCallback((inputValue: string) => {
    onChange?.(inputValue);
  }, debounceTime);

  // States
  const [searchTemp, setSearchTemp] = useState<string>("");

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
    <Tooltip content={inputValue || tooltipLabel || placeholder || l.search}>
      <InputGroup
        w="full"
        startElement={
          !noIcon && (
            <Icon
              boxSize={BASE_ICON_BOX_SIZE}
              color="fg.subtle"
              ml={"-4px"}
              {...iconProps}
            >
              {icon || <LucideIcon icon={SearchIcon} />}
            </Icon>
          )
        }
        {...restProps}
      >
        <HStack position="relative" w="full">
          <StringInput
            ref={inputRef ? inputRef : null}
            pl={noIcon ? 4 : 8}
            pr="40px"
            placeholder={placeholder || `${l.search} ${additionalPlaceholder}`}
            onChange={(inputValue) => {
              const val = inputValue || "";
              setSearchTemp(val);
              debounced(val);
            }}
            inputValue={searchTemp}
            boxShadow="none !important"
            borderColor={
              invalid
                ? "border.error"
                : inputProps?.variant === "subtle" || variant === "subtle"
                  ? "transparent"
                  : "border.muted"
            }
            variant={variant as any}
            {...inputProps}
          />
        </HStack>
      </InputGroup>
    </Tooltip>
  );
}
