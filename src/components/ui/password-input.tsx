"use client";

import { CContainer } from "@/components/ui/c-container";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__PasswordInput } from "@/constants/props";
import { Center, Icon, IconButton } from "@chakra-ui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { StringInput } from "./string-input";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";

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
            right: 8,
          }}
          {...restProps}
        />

        <Center
          flexShrink={0}
          zIndex={2}
          position={"absolute"}
          h={"full"}
          right={"2px"}
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
            <Icon boxSize={BASE_ICON_BOX_SIZE}>
              {showPassword ? (
                <LucideIcon icon={EyeIcon} />
              ) : (
                <LucideIcon icon={EyeOffIcon} />
              )}
            </Icon>
          </IconButton>
        </Center>
      </CContainer>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
