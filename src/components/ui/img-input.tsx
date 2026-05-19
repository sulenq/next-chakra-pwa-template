"use client";

import { FileInputProps, FileInputRoot } from "@/components/ui/file-input";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { FileItem } from "@/components/widgets/file-item";
import { LucideIcon } from "@/components/widgets/icon";
import { ImgViewer } from "@/components/widgets/img-viewer";
import { ScrollH } from "@/components/widgets/scroll-h";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { StorageFile } from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { imgUrl } from "@/utils/url";
import { Circle, useFieldContext } from "@chakra-ui/react";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export const ImgInput = (props: FileInputProps) => {
  // Props
  const {
    id,
    existingFiles,
    onDeleteFile,
    onUndoDeleteFile,
    inputValue,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
  const fc = useFieldContext();

  // States
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const resolvedDisabled = fc?.disabled;
  const [existing, setExisting] = useState<StorageFile[]>(existingFiles || []);
  const [deleted, setDeleted] = useState<StorageFile[]>([]);
  const shouldRenderPreview = !isEmptyArray(previewUrls);

  useEffect(() => {
    let inputValueUrls: string[] = [];
    if (inputValue) {
      inputValueUrls = inputValue.map((f: any) => URL.createObjectURL(f));
    }
    const exsistingUrls = existing.map((f: StorageFile) =>
      imgUrl(f.filePath),
    ) as string[];

    setPreviewUrls([...exsistingUrls, ...inputValueUrls]);
  }, [existing, inputValue]);

  return (
    <StackV gap={3} flex={restProps?.flex}>
      {!isEmptyArray(existing) && (
        <StackV
          p={2}
          gap={3}
          border={"2px dashed"}
          borderColor={"border.muted"}
          rounded={themeContext.radii.container}
        >
          <StackV
            gap={2}
            opacity={resolvedDisabled ? 0.5 : 1}
            cursor={resolvedDisabled ? "disabled" : "auto"}
          >
            <P fontWeight={"medium"} pl={1}>
              {t.uploaded_file}
            </P>

            {existing?.map((fileData: any, index: number) => {
              return (
                <FileItem
                  key={index}
                  index={index}
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
          </StackV>
        </StackV>
      )}

      {!isEmptyArray(deleted) && (
        <StackV
          p={2}
          gap={3}
          border={"2px dashed"}
          borderColor={"border.muted"}
          rounded={themeContext.radii.container}
        >
          <StackV
            gap={2}
            opacity={resolvedDisabled ? 0.5 : 1}
            cursor={resolvedDisabled ? "disabled" : "auto"}
          >
            <P fontWeight={"medium"} pl={1}>
              {t.deleted_file}
            </P>

            {deleted?.map((fileData: any, index: number) => {
              return (
                <FileItem
                  key={index}
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
          </StackV>
        </StackV>
      )}

      <FileInputRoot
        imgInput
        dropzone
        existing={existing}
        showDropzoneIcon={shouldRenderPreview ? false : true}
        inputValue={inputValue}
        accept={"image/png, image/jpeg, image/webp"}
        acceptPlaceholder={".jpg, .jpeg, .png"}
        {...restProps}
      >
        {shouldRenderPreview && (
          <>
            {/* <P
              fontWeight={"medium"}
              mt={3}
              mb={-8}
              ml={4}
              mr={"auto"}
              color={"fg.subtle"}
            >
              Preview
            </P> */}

            <ScrollH
              className={"scrollX"}
              maxW={restProps?.maxW || ""}
              gap={2}
              mt={1}
            >
              <StackH align={"center"} justify={"center"} h={"224px"} px={4}>
                {previewUrls.map((url: string, index: number) => {
                  return (
                    <ImgViewer
                      id={`img-input-preview-${id}-${index}`}
                      key={url}
                      src={url}
                      flex={"1 1 0"}
                    >
                      <StackV align={"center"} mx={"auto"} pos={"relative"}>
                        <Circle
                          bg={"bg.body"}
                          size={"20px"}
                          border={"1px solid"}
                          borderColor={"border.subtle"}
                          shadow={"soft"}
                          pos={"absolute"}
                          top={"6px"}
                          left={"6px"}
                          zIndex={2}
                        >
                          <P fontWeight={"medium"}>{`${index + 1}`}</P>
                        </Circle>

                        <Img
                          key={index}
                          src={url}
                          fluid
                          // h={"200px"}
                          w={"200px"}
                        />
                      </StackV>
                    </ImgViewer>
                  );
                })}
              </StackH>
            </ScrollH>
          </>
        )}
      </FileInputRoot>
    </StackV>
  );
};
