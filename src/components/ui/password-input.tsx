"use client";

import { CContainer } from "@/components/ui/c-container";
import { Props__PasswordInput } from "@/constants/props";
import { Center, Icon, IconButton } from "@chakra-ui/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { forwardRef, useState } from "react";
import { StringInput } from "./string-input";

export const PasswordInput = forwardRef<HTMLInputElement, Props__PasswordInput>(
  (props, ref) => {
    const {
      name,
      onChange,
      inputValue,
      placeholder = "••••••••",
      containerProps,
      invalid,
      flex,
      flexShrink,
      flexGrow,
      flexBasis,
      ...restProps
    } = props;

    // States
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <CContainer
        w={restProps?.w || "full"}
        h={restProps?.h}
        flex={flex}
        flexShrink={flexShrink}
        flexGrow={flexGrow}
        flexBasis={flexBasis}
        position={"relative"}
        display={"inline-flex"}
        {...containerProps}
      >
        <StringInput
          ref={ref}
          name={name}
          placeholder={placeholder}
          onChange={(inputValue) => {
            if (onChange) onChange(inputValue);
          }}
          inputValue={inputValue}
          type={showPassword ? "text" : "password"}
          pr={20}
          invalid={invalid}
          clearButtonProps={{
            right: 9,
          }}
          {...restProps}
        />

        <Center
          flexShrink={0}
          zIndex={2}
          position={"absolute"}
          h={"full"}
          right={1}
          top={0}
        >
          <IconButton
            aria-label="clear input"
            onClick={() => {
              setShowPassword((ps) => !ps);
            }}
            variant={"plain"}
            size={"sm"}
            color={"fg.subtle"}
          >
            <Icon boxSize={5}>
              {showPassword ? (
                <IconEye stroke={1.5} />
              ) : (
                <IconEyeOff stroke={1.5} />
              )}
            </Icon>
          </IconButton>
        </Center>
      </CContainer>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
