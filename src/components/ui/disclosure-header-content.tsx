import { Btn } from "@/components/ui/btn";
import { back } from "@/utils/client";
import { HStack, Icon } from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";
import { DialogCloseTrigger } from "./dialog";
import { DrawerCloseTrigger } from "./drawer";
import { P } from "./p";

type Props = {
  title?: string;
  withCloseButton?: boolean;
  content?: any;
  prefix?: "drawer" | "dialog";
};
export const DisclosureHeaderContent = ({
  title,
  withCloseButton = true,
  prefix,
  content,
}: Props) => {
  function handleBack() {
    back();
  }

  return (
    <HStack justify={"space-between"} w={"full"} pr={7}>
      {content ? (
        content
      ) : (
        <P fontWeight={"semibold"} ml={!prefix ? [0, null, 1] : ""}>
          {title}
        </P>
      )}

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
  );
};
