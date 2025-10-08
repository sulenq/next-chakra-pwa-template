"use client";

import { StringInput } from "@/components/ui/string-input";
import { Props__SearchInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { useDebouncedCallback } from "@/hooks/useDebounceCallback";
import { HStack, Icon, InputGroup } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Tooltip } from "./tooltip";
import { useRouter, useSearchParams } from "next/navigation";

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
    debounceTime = 500,
    queryKey = "q",
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();

  // Next navigation utils
  const router = useRouter();
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
    const currentValue = searchParams.get(queryKey);
    if (searchTemp === (currentValue || "")) return;

    const params = new URLSearchParams(searchParams.toString());
    if (searchTemp) params.set(queryKey, searchTemp);
    else params.delete(queryKey);

    // Use replace to avoid polluting browser history for every keystroke
    router.replace(`?${params.toString()}`);
  }, [searchTemp, queryKey, router]);

  return (
    <Tooltip content={tooltipLabel || placeholder || l.search}>
      <InputGroup
        w="full"
        startElement={
          !noIcon && (
            <Icon boxSize={5} color="fg.subtle" {...iconProps}>
              {icon || <IconSearch />}
            </Icon>
          )
        }
        {...restProps}
      >
        <HStack position="relative" w="full">
          <StringInput
            ref={inputRef ? inputRef : null}
            pl={noIcon ? 4 : 10}
            placeholder={placeholder || `${l.search} ${additionalPlaceholder}`}
            pr="40px"
            onChange={(inputValue) => {
              const val = inputValue || "";
              setSearchTemp(val);
              debounced(val);
            }}
            inputValue={searchTemp}
            boxShadow="none !important"
            borderColor={invalid ? "border.error" : "border.muted"}
            {...inputProps}
          />
        </HStack>
      </InputGroup>
    </Tooltip>
  );
}
