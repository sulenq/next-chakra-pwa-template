import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { FileIcon } from "@/components/ui/file-icon";
import { P } from "@/components/ui/p";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";

interface Props extends StackProps {
  data: any;
  withDeleteButton?: boolean;
  onDelete?: () => void;
  withUndoButton?: boolean;
  onUndo?: () => void;
}

export const FileItem = (props: Props) => {
  // Props
  const {
    data,
    withDeleteButton = true,
    onDelete,
    withUndoButton = false,
    onUndo,
    ...restProps
  } = props;

  // console.log("file", data);

  // Contexts
  const { themeConfig } = useThemeConfig();
  return (
    <HStack
      py={2}
      px={4}
      pr={3}
      borderRadius={themeConfig.radii.component}
      border={"1px solid"}
      borderColor={"border.muted"}
      gap={4}
      justify={"space-between"}
      {...restProps}
    >
      <Link
        href={data?.file_url}
        target="_blank"
        style={{
          width: "100%",
        }}
      >
        <HStack gap={4}>
          <FileIcon flexShrink={0} mimeType={data?.file_mime_type} />

          <CContainer flex={1}>
            <P lineClamp={1}>{`${data?.file_name}`}</P>
            <P fontSize={"xs"} color={"fg.muted"}>
              {`${data?.file_size}`}
            </P>
          </CContainer>
        </HStack>
      </Link>

      <HStack justify={"end"}>
        {withDeleteButton && (
          <Btn
            flexShrink={0}
            iconButton
            size={"xs"}
            variant={"ghost"}
            colorPalette={"gray"}
            onClick={onDelete}
          >
            <Icon boxSize={5}>
              <IconTrash stroke={1.5} />
            </Icon>
          </Btn>
        )}

        {withUndoButton && (
          <Btn
            flexShrink={0}
            size={"xs"}
            onClick={onUndo}
            variant={"ghost"}
            colorPalette={"gray"}
          >
            Undo
          </Btn>
        )}
      </HStack>
    </HStack>
  );
};
