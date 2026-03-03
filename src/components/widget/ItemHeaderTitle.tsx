import { P } from "@/components/ui/p";
import { InfoPopover } from "@/components/widget/InfoPopover";
import { HStack, TextProps } from "@chakra-ui/react";

export interface Props__ItemHeaderTitle extends TextProps {
  popoverContent?: string;
  autoHeight?: boolean;
}

const ItemHeaderTitle = (props: Props__ItemHeaderTitle) => {
  // Props
  const { children, popoverContent, autoHeight, ...restProps } = props;

  return (
    <HStack w={"fit"} minH={autoHeight ? "" : "42px"} gap={1}>
      <P fontWeight={"medium"} {...restProps}>
        {children}
      </P>

      {popoverContent && <InfoPopover popoverContent={popoverContent} />}
    </HStack>
  );
};

export default ItemHeaderTitle;
