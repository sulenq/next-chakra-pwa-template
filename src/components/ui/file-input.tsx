"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CloseButton } from "@/components/ui/close-button";
import {
  FileUploadDropzone,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { FileIcon } from "@/components/ui/file-icon";
import { P } from "@/components/ui/p";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { FileItem } from "@/components/widgets/file-item";
import { LucideIcon } from "@/components/widgets/icon";
import { Interface__StorageFile } from "@/shared/constants/interfaces";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { isEmptyArray } from "@/shared/utils/array";
import { makeFileUrl } from "@/shared/utils/file";
import { formatBytes, formatNumber } from "@/shared/utils/formatter";
import {
  Center,
  FileUploadRootProps,
  Icon,
  StackProps,
  useFieldContext,
} from "@chakra-ui/react";
import { TrashIcon, UploadIcon, XIcon } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";

// -----------------------------------------------------------------

interface FileListProps extends Omit<StackProps, "onChange"> {
  inputValue: File[] | null;
  onChange?: (inputValue: FileInputProps["inputValue"]) => void;
  existing: Interface__StorageFile[];
}

const FileList = (props: FileListProps) => {
  // Props
  const { inputValue, onChange, existing, ...restProps } = props;

  return (
    <CContainer gap={2} {...restProps}>
      {inputValue?.map((file: any, idx: number) => {
        const fileData = {
          fileName: file.name,
          fileMimeType: file.type,
          fileSize: formatBytes(file.size),
          fileUrl: makeFileUrl(file) || "",
        };

        return (
          <FileItem
            key={idx}
            idx={existing.length + idx}
            fileData={fileData}
            actions={[
              {
                type: "REMOVE",
                icon: <LucideIcon icon={XIcon} />,
                onClick: () => {
                  const next = inputValue.filter(
                    (_file: File, i: number) => i !== idx,
                  );
                  onChange?.(next.length > 0 ? next : null);
                },
              },
            ]}
          />
        );
      })}
    </CContainer>
  );
};

// -----------------------------------------------------------------

export interface FileInputInputComponentProps extends Omit<
  FileInputProps,
  "removed"
> {
  existing: Interface__StorageFile[];
  showDropzoneIcon?: boolean;
  showDropzoneLabel?: boolean;
  showDropzoneDescription?: boolean;
  acceptPlaceholder?: string;
  imgInput?: boolean;
}

export const FileInputRoot = forwardRef<
  HTMLInputElement,
  FileInputInputComponentProps
>(function FileInputRoot(props, ref) {
  // Props
  const {
    children,
    onChange,
    inputValue,
    accept,
    acceptPlaceholder,
    invalid,
    placeholder,
    label,
    dropzone,
    maxFileSizeMB = 10,
    maxFiles = 1,
    description,
    disabled,
    existing,
    showDropzoneIcon = true,
    showDropzoneLabel = true,
    showDropzoneDescription = true,
    imgInput,
    // removed,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const fc = useFieldContext();

  // States
  const [key, setKey] = useState<number>(1);

  // Derived Values
  const existingArr = Array.isArray(existing) // normalize existing to array (prevent undefined issues)
    ? existing
    : ([] as Interface__StorageFile[]);
  const existingCount = existingArr.length;
  const singleFile = inputValue?.[0] as File;
  const singleFileInputted =
    maxFiles === 1 && (!isEmptyArray(inputValue) as boolean);
  const resolvedIcon = singleFileInputted ? (
    <FileIcon name={singleFile.name} mimeType={singleFile.type} size={"2xl"} />
  ) : undefined;
  const resolvedLabel = singleFileInputted
    ? singleFile?.name
    : placeholder || t.msg_file_input_dropzone;
  const resolvedDescription = singleFileInputted
    ? formatBytes(singleFile?.size)
    : description ||
      `up to ${maxFileSizeMB} mB, max ${maxFiles || 1} file${
        maxFiles! > 1 ? "s" : ""
      } ${acceptPlaceholder ? `(${acceptPlaceholder})` : ""}`;
  const resolvedDisabled =
    fc?.disabled || disabled || existingCount >= maxFiles; // disable if disabled prop true or already have maxFiles existing

  // Utils
  function handleFileChange(details: any) {
    // reset internal input by changing key to force rerender when needed
    setKey((ps) => ps + 1);

    const files = details.acceptedFiles || [];

    // Reject if total existing + new exceeds maxFiles
    if (maxFiles && existingCount + files.length > maxFiles) {
      const title = t.error_invalid_file.title;
      const description = t.error_invalid_file.description;

      toaster.error({
        title,
        description,
      });

      // clear input by bumping key again (ensure dropzone/file input resets)
      setKey((ps) => ps + 1);
      return;
    }

    // Accept upload (files length guaranteed to be within limits)
    onChange?.(files.length > 0 ? files : undefined);
  }

  // Clear input when resolvedDisabled = true
  useEffect(() => {
    if (resolvedDisabled) {
      onChange?.(undefined);
      setKey((ps) => ps + 1);
    }
  }, [resolvedDisabled]);

  return (
    <>
      <FileUploadRoot
        ref={ref}
        key={`${key}`}
        alignItems={"stretch"}
        onFileChange={handleFileChange}
        onFileReject={() => {
          toaster.error({
            title: t.error_invalid_file.title,
            description: t.error_invalid_file.description,
          });
        }}
        maxFileSize={maxFileSizeMB * 1024 * 1024}
        maxFiles={maxFiles}
        gap={2}
        accept={accept}
        disabled={resolvedDisabled}
        pos={"relative"}
        {...restProps}
      >
        <>
          {dropzone && singleFileInputted && (
            <Tooltip content={"Reset"}>
              <CloseButton
                pos={"absolute"}
                top={"6px"}
                right={"6px"}
                size={"xs"}
                variant={"plain"}
                color={"fg.subtle"}
                onClick={() => {
                  onChange?.(undefined);
                  setKey((ps) => ps + 1);
                }}
              />
            </Tooltip>
          )}

          {dropzone ? (
            <FileUploadDropzone
              flex={1}
              icon={resolvedIcon}
              label={resolvedLabel}
              description={resolvedDescription}
              border={"2px dashed"}
              borderColor={
                (invalid ?? fc?.invalid) ? "border.error" : "border.muted"
              }
              disabled={resolvedDisabled}
              cursor={resolvedDisabled ? "disabled" : "pointer"}
              showIcon={showDropzoneIcon}
              showLabel={showDropzoneLabel}
              showDescription={showDropzoneDescription}
              imgInput={imgInput}
            >
              <Center
                mt={
                  imgInput &&
                  (!isEmptyArray(inputValue) || !isEmptyArray(existing))
                    ? 7
                    : -4
                }
              >
                {children}
              </Center>
            </FileUploadDropzone>
          ) : (
            <FileUploadTrigger asChild borderColor={invalid ? "fg.error" : ""}>
              <Btn
                variant={"outline"}
                borderColor={
                  (invalid ?? fc?.invalid) ? "border.error" : "border.muted"
                }
              >
                <Icon scale={0.8}>
                  <LucideIcon icon={UploadIcon} />
                </Icon>
                {label || "File upload"}
              </Btn>
            </FileUploadTrigger>
          )}

          {!singleFileInputted && inputValue && !isEmptyArray(inputValue) && (
            <CContainer gap={2}>
              {(!isEmptyArray(existing) || !isEmptyArray(inputValue)) && (
                <P fontSize={"sm"} color={"fg.subtle"}>{`Total : ${formatNumber(
                  inputValue.length + existing.length,
                )}`}</P>
              )}

              <FileList
                inputValue={inputValue}
                onChange={onChange}
                existing={existing}
              />
            </CContainer>
          )}
        </>
      </FileUploadRoot>
    </>
  );
});

// -----------------------------------------------------------------

export interface FileInputProps extends Omit<FileUploadRootProps, "onChange"> {
  id?: string;
  inputValue?: File[] | null;
  onChange?: (inputValue: FileInputProps["inputValue"]) => void;
  accept?: string;
  acceptPlaceholder?: string;
  invalid?: boolean;
  placeholder?: string;
  label?: string;
  dropzone?: boolean;
  maxFileSizeMB?: number;
  maxFiles?: number;
  description?: string;
  disabled?: boolean;
  existingFiles?: Interface__StorageFile[];
  onDeleteFile?: (file: Interface__StorageFile) => void;
  onUndoDeleteFile?: (file: Interface__StorageFile) => void;
}

export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput(props, ref) {
    // Props
    const { existingFiles, onDeleteFile, onUndoDeleteFile, ...restProps } =
      props;

    // Contexts
    const { t } = useLocale();
    const { themeConfig } = useThemeConfig();
    const fc = useFieldContext();

    // States
    const [existing, setExisting] = useState<Interface__StorageFile[]>(
      existingFiles || [],
    );
    const [deleted, setDeleted] = useState<Interface__StorageFile[]>([]);

    // Constants
    const resolvedDisabled = fc?.disabled;

    return (
      <CContainer gap={3}>
        {!isEmptyArray(existing) && (
          <CContainer
            p={2}
            gap={3}
            border={"2px dashed"}
            borderColor={"border.muted"}
            rounded={themeConfig.radii.container}
          >
            <CContainer
              gap={2}
              opacity={resolvedDisabled ? 0.5 : 1}
              cursor={resolvedDisabled ? "disabled" : "auto"}
            >
              <P fontWeight={"medium"} pl={1}>
                {t.uploaded_file}
              </P>

              {existing?.map((fileData: any, idx: number) => {
                return (
                  <FileItem
                    key={idx}
                    idx={idx}
                    fileData={fileData}
                    actions={[
                      {
                        type: "DELETE",
                        icon: <LucideIcon icon={TrashIcon} />,
                        onClick: () => {
                          setExisting((prev) =>
                            prev.filter((f) => f.id !== fileData.id),
                          );
                          setDeleted((ps) => [...ps, fileData]);
                          onDeleteFile?.(fileData);
                        },
                      },
                    ]}
                  />
                );
              })}
            </CContainer>
          </CContainer>
        )}

        {!isEmptyArray(deleted) && (
          <CContainer
            p={2}
            gap={3}
            border={"2px dashed"}
            borderColor={"border.muted"}
            rounded={themeConfig.radii.container}
          >
            <CContainer
              gap={2}
              opacity={resolvedDisabled ? 0.5 : 1}
              cursor={resolvedDisabled ? "disabled" : "auto"}
            >
              <P fontWeight={"medium"} pl={1}>
                {t.deleted_file}
              </P>

              {deleted?.map((fileData: any, idx: number) => {
                return (
                  <FileItem
                    key={idx}
                    fileData={fileData}
                    actions={[
                      {
                        type: "UNDO_DELETE",
                        label: "Undo",
                        onClick: () => {
                          setExisting((prev) => [...prev, fileData]);
                          setDeleted((ps) =>
                            ps.filter((f) => f.id !== fileData.id),
                          );
                          onUndoDeleteFile?.(fileData);
                        },
                      },
                    ]}
                  />
                );
              })}
            </CContainer>
          </CContainer>
        )}

        <FileInputRoot ref={ref} existing={existing} {...restProps} />
      </CContainer>
    );
  },
);
