"use client";

import { Props__PasswordInput } from "@/constants/props";
import { Box, Center, Icon, IconButton } from "@chakra-ui/react";
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
      boxProps,
      invalid,

      ...restProps
    } = props;

    // States
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <Box w={"full"} position={"relative"} {...boxProps}>
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
      </Box>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
