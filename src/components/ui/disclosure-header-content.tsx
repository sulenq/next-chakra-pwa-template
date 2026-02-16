import { Btn } from "@/components/ui/btn";
import { LucideIcon } from "@/components/widget/Icon";
import { Props__DisclosureHeaderContent } from "@/constants/props";
import { back } from "@/utils/client";
import { HStack, Icon } from "@chakra-ui/react";
import { MaximizeIcon, MinimizeIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DialogCloseTrigger } from "./dialog";
import { DrawerCloseTrigger } from "./drawer";
import { P } from "./p";

export const DisclosureHeaderContent = (
  props: Props__DisclosureHeaderContent
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

  // Hooks
  // const iss = useIsSmScreenWidth();

  // States
  const [maximize, setMaximize] = useState(false);

  // Utils
  function handleBack() {
    back();
  }

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
                    onClick={handleBack}
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
                    onClick={handleBack}
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
                onClick={handleBack}
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
