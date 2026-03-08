import { Btn } from "@/components/ui/btn";
import { DialogCloseTrigger } from "@/components/ui/dialog";
import { DrawerCloseTrigger } from "@/components/ui/drawer";
import { P } from "@/components/ui/p";
import { LucideIcon } from "@/components/widgets/icon";
import { back } from "@/utils/client";
import { HStack, Icon } from "@chakra-ui/react";
import { MaximizeIcon, MinimizeIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export interface DisclosureHeaderContentProps {
  title?: string;
  withCloseButton?: boolean;
  withMaximizeButton?: boolean;
  onMaximizeChange?: (maximize: boolean) => void;
  content?: any;
  prefix?: "drawer" | "dialog";
  children?: any;
}
export const DisclosureHeaderContent = (
  props: DisclosureHeaderContentProps,
) => {
  // Props
  const {
    title,
    withCloseButton = true,
    withMaximizeButton = false,
    onMaximizeChange,
    prefix,
    content,
    children,
    ...restProps
  } = props;

  // States
  const [maximize, setMaximize] = useState(false);

  useEffect(() => {
    onMaximizeChange?.(maximize);
  }, [maximize]);

  return (
    <HStack justify={"space-between"} w={"full"} {...restProps}>
      {content ? (
        content
      ) : (
        <P fontWeight={"semibold"} ml={!prefix ? [0, null, 0] : ""}>
          {title}
        </P>
      )}

      <HStack ml={"auto"} gap={[0, null, 2]}>
        {children}

        {withMaximizeButton && (
          <Btn
            clicky={false}
            iconButton
            size={["xs", null, "2xs"]}
            rounded={"full"}
            variant={["ghost", null, "subtle"]}
            onClick={() => {
              setMaximize((ps) => !ps);
            }}
          >
            <Icon boxSize={3.5}>
              {maximize ? (
                <LucideIcon icon={MinimizeIcon} />
              ) : (
                <LucideIcon icon={MaximizeIcon} />
              )}
            </Icon>
          </Btn>
        )}

        {withCloseButton && (
          <>
            {prefix && (
              <>
                {prefix === "dialog" && (
                  <DialogCloseTrigger
                    rounded={"full"}
                    onClick={back}
                    pos={"static"}
                    // top={"12px"}
                    // right={"12px"}
                    // mt={"-2px"}
                    // mr={"-6px"}
                  />
                )}

                {prefix === "drawer" && (
                  <DrawerCloseTrigger
                    rounded={"full"}
                    onClick={back}
                    pos={"static"}
                    // top={3}
                    // right={"10px"}
                  />
                )}
              </>
            )}

            {!prefix && (
              <Btn
                iconButton
                clicky={false}
                rounded={"full"}
                variant={["ghost", null, "subtle"]}
                size={["xs", null, "2xs"]}
                onClick={back}
              >
                <Icon boxSize={4}>
                  <LucideIcon icon={XIcon} />
                </Icon>
              </Btn>
            )}
          </>
        )}
      </HStack>
    </HStack>
  );
};
