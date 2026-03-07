import { P, PProps } from "@/components/ui/p";
import { InfoPopover } from "@/components/widget/InfoPopover";
import { HStack } from "@chakra-ui/react";

export interface ItemHeaderTitleProps extends PProps {
  popoverContent?: string;
  autoHeight?: boolean;
}
const ItemHeaderTitle = (props: ItemHeaderTitleProps) => {
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
