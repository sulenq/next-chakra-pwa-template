import { Btn } from "@/components/ui/btn";
import { FileIcon } from "@/components/ui/file-icon";
import { Props__FileInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { isEmptyArray } from "@/utils/array";
import { formatBytes } from "@/utils/formatter";
import { Icon, useFieldContext } from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "../ui/file-button";
import { CloseButton } from "@/components/ui/close-button";
import { Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";

const FileInput = (props: Props__FileInput) => {
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
    maxFileSize = 1,
    maxFiles = 1,
    description,
    disabled,
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
      `up to ${maxFileSize} MB, max ${maxFiles || 1} file${
        maxFiles! > 1 ? "s" : ""
      } ${accept ? `(${accept})` : ""}`;

  // Utils
  function handleFileChange(details: any) {
    setKey((ps) => ps + 1);

    let files = details.acceptedFiles || [];

    if (maxFiles && files.length > maxFiles) {
      files = files.slice(0, maxFiles);
    }

    onChange?.(files.length > 0 ? files : undefined);
  }

  return (
    <>
      <FileUploadRoot
        key={`${key}`}
        ref={fRef}
        alignItems="stretch"
        onFileChange={handleFileChange}
        onFileReject={() => {
          toaster.error({
            title: l.error_400_default.title,
            description: l.error_400_default.description,
            action: {
              label: "Close",
              onClick: () => {},
            },
          });
        }}
        maxFileSize={maxFileSize}
        maxFiles={maxFiles}
        gap={2}
        accept={accept}
        {...restProps}
      >
        <>
          {dropzone && !isEmptyArray(inputValue) && (
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
                iconProps={{
                  boxSize: "18px",
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
              opacity={disabled ? 0.5 : 1}
              cursor={disabled ? "disabled" : "pointer"}
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
            <FileUploadList files={inputValue as File[]} />
          )}
        </>
      </FileUploadRoot>
    </>
  );
};

export default FileInput;
