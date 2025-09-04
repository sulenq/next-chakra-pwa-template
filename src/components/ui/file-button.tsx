"use client";

import type { ButtonProps, RecipeProps } from "@chakra-ui/react";
import {
  Button,
  FileUpload as ChakraFileUpload,
  Icon,
  IconButton,
  Span,
  Text,
  useFileUploadContext,
  useRecipe,
} from "@chakra-ui/react";
import { IconUpload, IconX } from "@tabler/icons-react";
import { forwardRef } from "react";
import { useThemeConfig } from "@/context/useThemeConfig";
import { FileIcon } from "@/components/ui/file-icon";
import { P } from "@/components/ui/p";

export interface FileUploadRootProps extends ChakraFileUpload.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const FileUploadRoot = forwardRef<HTMLInputElement, FileUploadRootProps>(
  function FileUploadRoot(props, ref) {
    const { children, inputProps, ...rest } = props;
    return (
      <ChakraFileUpload.Root {...rest}>
        <ChakraFileUpload.HiddenInput ref={ref} {...inputProps} />
        {children}
      </ChakraFileUpload.Root>
    );
  }
);

export interface FileUploadDropzoneProps
  extends ChakraFileUpload.DropzoneProps {
  icon: any;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const FileUploadDropzone = forwardRef<
  HTMLInputElement,
  FileUploadDropzoneProps
>(function FileUploadDropzone(props, ref) {
  const { children, icon, label, description, ...rest } = props;

  return (
    <ChakraFileUpload.Dropzone
      ref={ref}
      cursor={"pointer"}
      bg={"body"}
      {...rest}
      _hover={{ bg: "gray.subtle" }}
    >
      <Icon fontSize="2xl" color="fg.muted">
        {icon || <IconUpload />}
      </Icon>
      <ChakraFileUpload.DropzoneContent>
        <P>{label}</P>
        {description && (
          <Text color="fg.muted">{description || ".* up to 5MB"}</Text>
        )}
      </ChakraFileUpload.DropzoneContent>
      {children}
    </ChakraFileUpload.Dropzone>
  );
});

interface VisibilityProps {
  showSize?: boolean;
  clearable?: boolean;
}

interface FileUploadItemProps extends VisibilityProps {
  file: File;
}

const FileUploadItem = (props: FileUploadItemProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  const { file, showSize, clearable } = props;

  return (
    <ChakraFileUpload.Item
      file={file}
      py={2}
      h={"54px"}
      bg={"body"}
      borderRadius={themeConfig.radii.component}
    >
      <ChakraFileUpload.ItemPreview asChild>
        <Icon fontSize={20}>
          <FileIcon mimeType={file.type} />
        </Icon>
      </ChakraFileUpload.ItemPreview>

      {showSize ? (
        <ChakraFileUpload.ItemContent>
          <ChakraFileUpload.ItemName />
          <ChakraFileUpload.ItemSizeText />
        </ChakraFileUpload.ItemContent>
      ) : (
        <ChakraFileUpload.ItemName flex="1" />
      )}

      {clearable && (
        <ChakraFileUpload.ItemDeleteTrigger asChild>
          <IconButton
            variant="ghost"
            colorPalette={"gray"}
            color="fg.muted"
            size="xs"
            h={"32px"}
            mr={-2}
          >
            <IconX />
          </IconButton>
        </ChakraFileUpload.ItemDeleteTrigger>
      )}
    </ChakraFileUpload.Item>
  );
};

interface FileUploadListProps
  extends VisibilityProps,
    ChakraFileUpload.ItemGroupProps {
  files?: File[];
}

export const FileUploadList = forwardRef<HTMLUListElement, FileUploadListProps>(
  function FileUploadList(props, ref) {
    const { showSize = true, clearable = true, files, ...rest } = props;

    const fileUpload = useFileUploadContext();
    const acceptedFiles = files ?? fileUpload.acceptedFiles;

    if (acceptedFiles.length === 0) return null;

    return (
      <ChakraFileUpload.ItemGroup ref={ref} {...rest}>
        {acceptedFiles.map((file) => (
          <FileUploadItem
            key={file.name}
            file={file}
            showSize={showSize}
            clearable={clearable}
          />
        ))}
      </ChakraFileUpload.ItemGroup>
    );
  }
);

type Assign<T, U> = Omit<T, keyof U> & U;

interface FileInputProps extends Assign<ButtonProps, RecipeProps<"input">> {
  placeholder?: React.ReactNode;
}

export const ChakraFileInput = forwardRef<HTMLButtonElement, FileInputProps>(
  function ChakraFileInput(props, ref) {
    const inputRecipe = useRecipe({ key: "input" });
    const [recipeProps, restProps] = inputRecipe.splitVariantProps(props);
    const { placeholder = "Select file(s)", ...rest } = restProps;
    return (
      <ChakraFileUpload.Trigger asChild>
        <Button
          unstyled
          py="0"
          ref={ref}
          {...rest}
          css={[inputRecipe(recipeProps), props.css]}
        >
          <ChakraFileUpload.Context>
            {({ acceptedFiles }) => {
              if (acceptedFiles.length === 1) {
                return <span>{acceptedFiles[0].name}</span>;
              }
              if (acceptedFiles.length > 1) {
                return <span>{acceptedFiles.length} files</span>;
              }
              return <Span color="fg.subtle">{placeholder}</Span>;
            }}
          </ChakraFileUpload.Context>
        </Button>
      </ChakraFileUpload.Trigger>
    );
  }
);

export const FileUploadLabel = ChakraFileUpload.Label;
export const FileUploadClearTrigger = ChakraFileUpload.ClearTrigger;
export const FileUploadTrigger = ChakraFileUpload.Trigger;
