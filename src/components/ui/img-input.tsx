"use client";

// TODO hiatus
import { CContainer } from "@/components/ui/c-container";
import { InputComponent } from "@/components/ui/file-input";
import { P } from "@/components/ui/p";
import { FileItem } from "@/components/widget/FIleItem";
import { Interface__StorageFile } from "@/constants/interfaces";
import { Props__FileInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { isEmptyArray } from "@/utils/array";
import { useFieldContext } from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

export const ImgInput = (props: Props__FileInput) => {
  // Props
  const { existingFiles, onDeleteFile, onUndoDeleteFile, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // States
  const resolvedDisabled = fc.disabled;
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
        dropzone
        existing={existing}
        showDropzoneIcon={false}
        showDropzoneLabel={false}
        showDropzoneDescription={false}
        {...restProps}
      ></InputComponent>
    </CContainer>
  );
};
