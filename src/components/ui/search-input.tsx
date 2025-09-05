import { StringInput } from "@/components/ui/string-input";
import { Props__SearchInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { HStack, Icon, InputGroup } from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
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
  const [searchLocal, setSearchLocal] = useState<string>(inputValue || "");

  // Handle onchange
  const handleOnChange = useCallback(
    (value: string) => {
      if (value !== inputValue) {
        if (onChange) onChange(value);
      }
    },
    [onChange, inputValue]
  );

  // Handle debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      handleOnChange(searchLocal);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchLocal, handleOnChange]);

  // Sync searchLocal with inputValue prop when it changes
  useEffect(() => {
    setSearchLocal(inputValue || "");
  }, [inputValue]);

  return (
    <Tooltip content={tooltipLabel || placeholder || l.search}>
      <InputGroup
        w={"full"}
        startElement={
          !noIcon && (
            <Icon
              ml={
                inputProps?.size === "xs" || inputProps?.size === "sm" ? -1 : ""
              }
              mb={"2px"}
              boxSize={5}
              color={"fg.subtle"}
              {...iconProps}
            >
              {icon || <IconSearch />}
            </Icon>
          )
        }
        {...restProps}
      >
        <HStack position="relative" w="full">
          <StringInput
            ref={inputRef ? inputRef : null}
            pl={
              noIcon
                ? 4
                : inputProps?.size === "xs" || inputProps?.size === "sm"
                ? 8
                : 10
            }
            placeholder={placeholder || `${l.search} ${additionalPlaceholder}`}
            pr={"40px"}
            onChange={(inputValue) => {
              setSearchLocal(inputValue || "");
            }}
            inputValue={searchLocal}
            boxShadow={"none !important"}
            borderColor={invalid ? "border.error" : "border.muted"}
            {...inputProps}
          />
        </HStack>
      </InputGroup>
    </Tooltip>
  );
}
