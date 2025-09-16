"use client";

import { StringInput } from "@/components/ui/string-input";
import { Props__SearchInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { debounce } from "@/utils/callback";
import { HStack, Icon, InputGroup } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
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
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();

  // States, Refs
  const [searchTemp, setSearchTemp] = useState<string>(inputValue || "");
  // const smInput = inputProps?.size === "xs" || inputProps?.size === "sm";

  // Handle onchange
  function handleOnChange(value: string) {
    if (value !== inputValue) {
      if (onChange) onChange(value);
    }
  }

  // Sync searchTemp with inputValue prop when it changes
  useEffect(() => {
    setSearchTemp(inputValue || "");
  }, [inputValue]);

  return (
    <Tooltip content={tooltipLabel || placeholder || l.search}>
      <InputGroup
        w={"full"}
        startElement={
          !noIcon && (
            <Icon boxSize={5} color={"fg.subtle"} {...iconProps}>
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
            pr={"40px"}
            onChange={(inputValue) => {
              setSearchTemp(inputValue || "");
              debounce(() => {
                handleOnChange(inputValue || "");
              });
            }}
            inputValue={searchTemp}
            boxShadow={"none !important"}
            borderColor={invalid ? "border.error" : "border.muted"}
            {...inputProps}
          />
        </HStack>
      </InputGroup>
    </Tooltip>
  );
}
