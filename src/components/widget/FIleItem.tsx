import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { FileIcon } from "@/components/ui/file-icon";
import { P } from "@/components/ui/p";
import { Props__FileItem } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, Icon } from "@chakra-ui/react";
import Link from "next/link";

export const FileItem = (props: Props__FileItem) => {
  // Props
  const { fileData, actions = [], ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <HStack
      py={2}
      px={4}
      pr={"6px"}
      rounded={themeConfig.radii.component}
      border={"1px solid"}
      borderColor={"border.muted"}
      gap={4}
      justify={"space-between"}
      {...restProps}
    >
      <Link
        href={fileData?.fileUrl}
        target="_blank"
        style={{
          width: "100%",
        }}
      >
        <HStack gap={4}>
          <FileIcon flexShrink={0} mimeType={fileData?.fileMimeType} />

          <CContainer flex={1}>
            <P lineClamp={1}>{`${fileData?.fileName}`}</P>
            <P fontSize={"sm"} color={"fg.muted"}>
              {`${fileData?.fileSize}`}
            </P>
          </CContainer>
        </HStack>
      </Link>

      <HStack justify={"end"}>
        {actions.map((action) => {
          return (
            <Btn
              key={action.type}
              iconButton={!!action.icon}
              flexShrink={0}
              size={"xs"}
              color={"fg.subtle"}
              variant={"plain"}
              colorPalette={"gray"}
              onClick={action.onClick}
              disabled={false}
            >
              {action.icon ? (
                <Icon boxSize={"18px"}>{action.icon}</Icon>
              ) : (
                action.label
              )}
            </Btn>
          );
        })}
      </HStack>
    </HStack>
  );
};
