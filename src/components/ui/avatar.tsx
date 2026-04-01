"use client";

import { CContainer } from "@/components/ui/c-container";
import { Disclosure } from "@/components/ui/disclosure";
import { FileInputProps } from "@/components/ui/file-input";
import { ImgInput } from "@/components/ui/img-input";
import { P } from "@/components/ui/p";
import { BackButton } from "@/components/widgets/back-button";
import { Interface__User } from "@/constants/interfaces";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { getInitials } from "@/utils/string";
import type { GroupProps, SlotRecipeProps } from "@chakra-ui/react";
import { Avatar as ChakraAvatar, Group } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

// -----------------------------------------------------------------

export interface AvatarProps extends ChakraAvatar.RootProps {
  name?: string;
  src?: string;
  srcSet?: string;
  loading?: ImageProps["loading"];
  icon?: React.ReactElement;
  fallback?: React.ReactNode;
  iconBoxSize?: string | number;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(props, ref) {
    const {
      name,
      src,
      srcSet,
      loading,
      icon,
      fallback,
      children,
      iconBoxSize,
      ...rest
    } = props;
    return (
      <ChakraAvatar.Root ref={ref} bg={"d1"} {...rest}>
        <AvatarFallback
          name={name}
          icon={icon}
          boxSize={iconBoxSize}
          color={"fg.subtle"}
          fontSize={rest.fontSize}
        >
          {fallback}
        </AvatarFallback>
        <ChakraAvatar.Image src={src} srcSet={srcSet} loading={loading} />
        {children}
      </ChakraAvatar.Root>
    );
  },
);

// -----------------------------------------------------------------

interface AvatarFallbackProps extends ChakraAvatar.FallbackProps {
  name?: string;
  icon?: React.ReactElement;
}

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  function AvatarFallback(props, ref) {
    const { name, icon, children, ...rest } = props;
    return (
      <ChakraAvatar.Fallback ref={ref} {...rest}>
        {children}
        {name != null && children == null && (
          <P fontSize={rest.fontSize}>{getInitials(name)}</P>
        )}
        {name == null && children == null && (
          <ChakraAvatar.Icon asChild={!!icon} boxSize={rest?.boxSize}>
            {icon}
          </ChakraAvatar.Icon>
        )}
      </ChakraAvatar.Fallback>
    );
  },
);

// -----------------------------------------------------------------

interface AvatarGroupProps extends GroupProps, SlotRecipeProps<"avatar"> {}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  function AvatarGroup(props, ref) {
    const { size, variant, borderless, ...rest } = props;
    return (
      <ChakraAvatar.PropsProvider value={{ size, variant, borderless }}>
        <Group gap={"0"} spaceX={"-3"} ref={ref} {...rest} />
      </ChakraAvatar.PropsProvider>
    );
  },
);

// -----------------------------------------------------------------

interface AvatarInputDisclosureTriggerProps extends FileInputProps {
  children: React.ReactElement<any>;
  formik: any;
  user?: Interface__User;
}

export const AvatarUploadTrigger = (
  props: AvatarInputDisclosureTriggerProps,
) => {
  // Props
  const { children, inputValue, onChange, formik, user } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("avatar-input"));

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen}>
        {children}
      </CContainer>

      <Disclosure.Root open={open} lazyLoad size={"xs"}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent title={`Avatar`} />
          </Disclosure.Header>

          <Disclosure.Body>
            <ImgInput
              inputValue={inputValue}
              onChange={(inputValue) => {
                onChange?.(inputValue);
              }}
              existingFiles={user?.avatar}
              onDeleteFile={(fileData) => {
                formik.setFieldValue(
                  "deleteAvatarIds",
                  Array.from(
                    new Set([...formik.values.deleteAvatarIds, fileData.id]),
                  ),
                );
              }}
              onUndoDeleteFile={(fileData) => {
                formik.setFieldValue(
                  "deleteAvatarIds",
                  formik.values.deleteAvatarIds.filter(
                    (id: string) => id !== fileData.id,
                  ),
                );
              }}
            />
          </Disclosure.Body>

          <Disclosure.Footer>
            <BackButton />
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};
