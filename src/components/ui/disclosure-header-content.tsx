import { Btn } from "@/components/ui/btn";
import { back } from "@/utils/client";
import { HStack, Icon } from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";
import { DialogCloseTrigger } from "./dialog";
import { DrawerCloseTrigger } from "./drawer";
import { P } from "./p";
import { Props__DisclosureHeaderContent } from "@/constants/props";

export const DisclosureHeaderContent = (
  props: Props__DisclosureHeaderContent
) => {
  // Props
  const {
    title,
    withCloseButton = true,
    prefix,
    content,
    children,
    ...restProps
  } = props;

  // Utils
  function handleBack() {
    back();
  }

  return (
    <HStack justify={"space-between"} w={"full"} pr={7} {...restProps}>
      {content ? (
        content
      ) : (
        <P fontWeight={"semibold"} ml={!prefix ? [0, null, 0] : ""}>
          {title}
        </P>
      )}

      <HStack ml={"auto"}>
        {children}

        {withCloseButton && (
          <>
            {prefix && (
              <>
                {prefix === "dialog" && (
                  <DialogCloseTrigger
                    rounded={"full"}
                    top={"12px"}
                    right={"12px"}
                    onClick={handleBack}
                    mt={"-2px"}
                    mr={"-6px"}
                  />
                )}

                {prefix === "drawer" && (
                  <DrawerCloseTrigger
                    rounded={"full"}
                    top={3}
                    right={"10px"}
                    onClick={handleBack}
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
                pos={"absolute"}
                top={[3, null, "10px"]}
                right={["10px", null, "12px"]}
                size={["xs", null, "2xs"]}
                onClick={handleBack}
              >
                <Icon boxSize={4}>
                  <IconX />
                </Icon>
              </Btn>
            )}
          </>
        )}
      </HStack>
    </HStack>
  );
};
