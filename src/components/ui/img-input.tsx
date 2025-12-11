"use client";

import { CContainer } from "@/components/ui/c-container";
import { InputComponent } from "@/components/ui/file-input";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { FileItem } from "@/components/widget/FIleItem";
import HScroll from "@/components/widget/HScroll";
import { LucideIcon } from "@/components/widget/Icon";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { Interface__StorageFile } from "@/constants/interfaces";
import { Props__FileInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { isEmptyArray } from "@/utils/array";
import { imgUrl } from "@/utils/url";
import { Center, Circle, HStack, useFieldContext } from "@chakra-ui/react";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const ImgInput = (props: Props__FileInput) => {
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
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // States
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const resolvedDisabled = fc?.disabled;
  const [existing, setExisting] = useState<Interface__StorageFile[]>(
    existingFiles || []
  );
  const [deleted, setDeleted] = useState<Interface__StorageFile[]>([]);
  const shouldRenderPreview = !isEmptyArray(previewUrls);

  useEffect(() => {
    let inputValueUrls: string[] = [];
    if (inputValue) {
      inputValueUrls = inputValue.map((f: any) => URL.createObjectURL(f));
    }
    const exsistingUrls = existing.map((f: Interface__StorageFile) =>
      imgUrl(f.filePath)
    ) as string[];

    setPreviewUrls([...exsistingUrls, ...inputValueUrls]);
  }, [existing, inputValue]);

  return (
    <CContainer gap={3} flex={restProps?.flex}>
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
              {l.uploaded_file}
            </P>

            {existing?.map((fileData: any, idx: number) => {
              return (
                <FileItem
                  key={idx}
                  idx={idx}
                  fileData={fileData}
                  actions={[
                    {
                      type: "delete",
                      icon: <LucideIcon icon={TrashIcon} />,
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
          <CContainer
            gap={2}
            opacity={resolvedDisabled ? 0.5 : 1}
            cursor={resolvedDisabled ? "disabled" : "auto"}
          >
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

      <InputComponent
        imgInput
        dropzone
        existing={existing}
        showDropzoneIcon={shouldRenderPreview ? false : true}
        inputValue={inputValue}
        accept="image/png, image/jpeg, image/webp"
        acceptPlaceholder=".jpg, .jpeg, .png"
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

            <HScroll
              className="scrollX"
              maxW={restProps?.maxW || ""}
              gap={2}
              mt={1}
            >
              <HStack justify={"center"} h={"224px"} px={4}>
                {previewUrls.map((url: string, idx: number) => {
                  return (
                    <ImgViewer
                      id={`img-input-preview-${id}-${idx}`}
                      key={url}
                      src={url}
                      flex={"1 1 0"}
                    >
                      <Center w={"fit"} mx={"auto"} pos={"relative"}>
                        <Circle
                          className="ss"
                          bg={"body"}
                          size={"20px"}
                          border={"1px solid"}
                          borderColor={"border.subtle"}
                          pos={"absolute"}
                          top={"6px"}
                          left={"6px"}
                          zIndex={2}
                        >
                          <P fontWeight={"medium"}>{`${idx + 1}`}</P>
                        </Circle>

                        <Img key={idx} src={url} fluid h={"200px"} />
                      </Center>
                    </ImgViewer>
                  );
                })}
              </HStack>
            </HScroll>
          </>
        )}
      </InputComponent>
    </CContainer>
  );
};
