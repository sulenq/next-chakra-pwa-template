"use client";

import { CContainer } from "@/components/ui/c-container";
import { LucideIcon } from "@/components/widgets/icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import {
  Center,
  Icon,
  IconButton,
  InputProps,
  StackProps,
} from "@chakra-ui/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { forwardRef, useState } from "react";
import { StringInput } from "@/components/ui/string-input";

// -----------------------------------------------------------------

export interface PasswordInputProps extends Omit<InputProps, "onChange"> {
  name?: string;
  onChange?: (inputValue: string) => void;
  inputValue?: string | undefined;
  placeholder?: string;
  containerProps?: StackProps;
  invalid?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    // Props
    const {
      name,
      onChange,
      inputValue,
      placeholder = "••••••••",
      containerProps,
      invalid,
      ...restProps
    } = props;

    // States
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    // Utils
    function togglePasswordVisibility() {
      setIsPasswordVisible((prev) => !prev);
    }
    function handleChange(inputValue: string) {
      if (onChange) onChange(inputValue);
    }

    return (
      <CContainer
        flex={restProps.flex}
        flexShrink={restProps.flexShrink}
        flexGrow={restProps.flexGrow}
        flexBasis={restProps.flexBasis}
        w={restProps.w || "full"}
        h={restProps.h}
        position={"relative"}
        display={"inline-flex"}
        {...containerProps}
      >
        <StringInput
          ref={ref}
          name={name}
          placeholder={placeholder}
          inputValue={inputValue}
          onChange={handleChange}
          pr={20}
          type={isPasswordVisible ? "text" : "password"}
          invalid={invalid}
          clearButtonProps={{
            right: 8,
          }}
          {...restProps}
        />

        <Center
          flexShrink={0}
          h={"full"}
          position={"absolute"}
          right={"2px"}
          top={0}
          zIndex={2}
        >
          <IconButton
            aria-label={"clear input"}
            onClick={togglePasswordVisibility}
            variant={"plain"}
            size={"sm"}
            color={"fg.subtle"}
          >
            <Icon boxSize={BASE_ICON_BOX_SIZE}>
              {isPasswordVisible ? (
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
