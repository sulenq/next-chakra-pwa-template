import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CloseButton } from "@/components/ui/close-button";
import { FileIcon } from "@/components/ui/file-icon";
import { P } from "@/components/ui/p";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { FileItem } from "@/components/widget/FIleItem";
import { Interface__StorageFile } from "@/constants/interfaces";
import {
  Props__FileInput,
  Props__FileInputInputComponent,
} from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { isEmptyArray } from "@/utils/array";
import { formatBytes } from "@/utils/formatter";
import { Icon, useFieldContext } from "@chakra-ui/react";
import { IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  FileUploadDropzone,
  FileUploadRoot,
  FileUploadTrigger,
} from "../ui/file-button";
import { makeFileUrl } from "@/utils/file";

const FileList = (props: any) => {
  // Props
  const { inputValue, onChange, ...restProps } = props;

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
            fileData={fileData}
            actions={[
              {
                type: "remove",
                icon: <IconX stroke={1.5} />,
                onClick: () => {
                  const next = inputValue.filter(
                    (_file: File, i: number) => i !== idx
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
const InputComponent = (props: Props__FileInputInputComponent) => {
  // Props
  const {
    fRef,
    onChange,
    inputValue,
    accept,
    invalid,
    placeholder,
    label,
    dropzone,
    maxFileSize = 10,
    maxFiles = 1,
    description,
    disabled,
    existing,
    // removed,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const fc = useFieldContext();

  // States
  const [key, setKey] = useState<number>(1);
  const singleFile = inputValue?.[0] as File;
  const singleFileInputted =
    maxFiles === 1 && (!isEmptyArray(inputValue) as boolean);
  const resolvedIcon = singleFileInputted ? (
    <FileIcon name={singleFile.name} mimeType={singleFile.type} size={"2xl"} />
  ) : undefined;
  const resolvedLabel = singleFileInputted
    ? singleFile?.name
    : placeholder || l.msg_file_input_dropzone;
  const resolvedDescription = singleFileInputted
    ? formatBytes(singleFile?.size)
    : description ||
      `up to ${maxFileSize} mB, max ${maxFiles || 1} file${
        maxFiles! > 1 ? "s" : ""
      } ${accept ? `(${accept})` : ""}`;
  const resolvedDisabled = disabled || existing.length === maxFiles;

  // Utils
  function handleFileChange(details: any) {
    setKey((ps) => ps + 1);

    let files = details.acceptedFiles || [];

    if (maxFiles && files.length > maxFiles) {
      files = files.slice(0, maxFiles);
    }

    onChange?.(files.length > 0 ? files : undefined);
  }

  // clear input when resolvedDisabled = true
  useEffect(() => {
    if (resolvedDisabled) {
      onChange?.(undefined);
      setKey((ps) => ps + 1);
    }
  }, [resolvedDisabled]);

  return (
    <>
      <FileUploadRoot
        key={`${key}`}
        ref={fRef}
        alignItems="stretch"
        onFileChange={handleFileChange}
        onFileReject={() => {
          toaster.error({
            title: l.error_invalid_file.title,
            description: l.error_invalid_file.description,
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
        }}
        maxFileSize={maxFileSize * 1024 * 1024}
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
                top={3}
                right={3}
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
              icon={resolvedIcon}
              label={resolvedLabel}
              description={resolvedDescription}
              border={"2px dashed"}
              borderColor={
                invalid ?? fc?.invalid ? "border.error" : "border.muted"
              }
              opacity={resolvedDisabled ? 0.5 : 1}
              cursor={resolvedDisabled ? "disabled" : "pointer"}
            />
          ) : (
            <FileUploadTrigger asChild borderColor={invalid ? "fg.error" : ""}>
              <Btn
                variant="outline"
                borderColor={
                  invalid ?? fc?.invalid ? "border.error" : "border.muted"
                }
              >
                <Icon scale={0.8}>
                  <IconUpload />
                </Icon>{" "}
                {label || "File upload"}
              </Btn>
            </FileUploadTrigger>
          )}

          {!singleFileInputted && inputValue && (
            <FileList
              inputValue={inputValue}
              onChange={onChange}
              setKey={setKey}
            />
          )}
        </>
      </FileUploadRoot>
    </>
  );
};

export const FileInput = (props: Props__FileInput) => {
  // Props
  const { existingFiles, onDeleteFile, onUndoDeleteFile, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [existing, setExisting] = useState<Interface__StorageFile[]>(
    existingFiles || []
  );
  const [deleted, setDeleted] = useState<Interface__StorageFile[]>([]);

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
          <CContainer gap={2}>
            <P fontWeight={"medium"} pl={1}>
              {l.uploaded_file}
            </P>

            {existing?.map((fileData: any, idx: number) => {
              return (
                <FileItem
                  key={idx}
                  fileData={fileData}
                  actions={[
                    {
                      type: "delete",
                      icon: <IconTrash stroke={1.5} />,
                      onClick: () => {
                        setExisting((prev) =>
                          prev.filter((f) => f.id !== fileData.id)
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
          <CContainer gap={2}>
            <P fontWeight={"medium"} pl={1}>
              {l.deleted_file}
            </P>

            {deleted?.map((fileData: any, idx: number) => {
              return (
                <FileItem
                  key={idx}
                  fileData={fileData}
                  actions={[
                    {
                      type: "undo_delete",
                      label: "Undo",
                      onClick: () => {
                        setExisting((prev) => [...prev, fileData]);
                        setDeleted((ps) =>
                          ps.filter((f) => f.id !== fileData.id)
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

      <InputComponent existing={existing} {...restProps} />
    </CContainer>
  );
};
