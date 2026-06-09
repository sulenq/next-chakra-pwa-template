import { Btn } from "@/components/ui/btn";
import { FileIcon } from "@/components/ui/file-icon";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { Center, Circle, Icon, Link, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export interface FileItemProps extends StackProps {
  fileData: any;
  index?: number;
  actions?: {
    type: "REMOVE" | "DELETE" | "UNDO_DELETE";
    onClick: () => void;
    label?: string;
    icon?: React.ReactNode;
  }[];
}

export const FileItem = (props: FileItemProps) => {
  // Props
  const { children, fileData, actions = [], index, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  return (
    <StackH
      align={"center"}
      py={2}
      px={4}
      pr={"6px"}
      rounded={theme.radii.component}
      border={"1px solid"}
      borderColor={"border.muted"}
      gap={4}
      justify={"space-between"}
      {...restProps}
    >
      <Link
        href={fileData?.fileUrl}
        target={"_blank"}
        style={{
          width: "100%",
        }}
      >
        <StackH align={"center"} gap={4}>
          <Center pos={"relative"}>
            <FileIcon flexShrink={0} mimeType={fileData?.fileMimeType} />

            {index !== undefined && (
              <Circle
                size={"16px"}
                bg={"bg.body"}
                border={"1px solid"}
                borderColor={"border.subtle"}
                shadow={"soft"}
                pos={"absolute"}
                left={"-6px"}
                top={"-6px"}
              >
                <P fontSize={"sm"}>{`${index + 1}`}</P>
              </Circle>
            )}
          </Center>

          <StackV flex={1}>
            <P lineClamp={1}>{`${fileData?.name}`}</P>
            <P fontSize={"sm"} color={"fg.muted"}>
              {`${fileData?.fileSize}`}
            </P>
          </StackV>
        </StackH>
      </Link>

      <StackH align={"center"} justify={"end"}>
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
      </StackH>

      {children}
    </StackH>
  );
};
