import { Btn } from "@/components/ui/btn";
import { FileIcon } from "@/components/ui/file-icon";
import { Props__FileInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { emptyArray } from "@/utils/array";
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
    maxFileSize,
    maxFiles = 1,
    description,
    disabled,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const fc = useFieldContext();

  // States
  const singleFile = inputValue?.[0] as File;
  const singleFileInputted =
    maxFiles === 1 && (!emptyArray(inputValue) as boolean);
  const resolvedIcon = singleFileInputted ? (
    <FileIcon name={singleFile.name} mimeType={singleFile.type} size={"2xl"} />
  ) : undefined;
  const resolvedLabel = singleFileInputted
    ? singleFile?.name
    : placeholder || l.msg_file_input_dropzone;
  const resolvedDescription = singleFileInputted
    ? formatBytes(singleFile?.size)
    : description ||
      `up to ${maxFileSize || 10} MB, max ${maxFiles || 1} file${
        maxFiles! > 1 ? "s" : ""
      } ${accept ? `(${accept})` : ""}`;

  // Utils
  function handleFileChange(details: any) {
    let files = details.acceptedFiles || [];

    if (maxFiles && files.length > maxFiles) {
      files = files.slice(0, maxFiles);
    }

    onChange?.(files.length > 0 ? files : undefined);
  }

  return (
    <>
      <FileUploadRoot
        ref={fRef}
        alignItems="stretch"
        onFileChange={handleFileChange}
        // onFileReject={() => {
        //   toaster.error({
        //     title: l.error_file_input.title,
        //     description: l.error_file_input.description,
        //     action: {
        //       label: "Close",
        //       onClick: () => {},
        //     },
        //   });
        // }}
        maxFiles={maxFiles}
        gap={2}
        accept={accept}
        {...restProps}
      >
        <>
          {dropzone && !emptyArray(inputValue) && (
            <Tooltip content={"Reset"}>
              <CloseButton
                pos={"absolute"}
                top={3}
                right={3}
                size={"xs"}
                color={"fg.subtle"}
                onClick={() => {
                  onChange?.(undefined);
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
