import { P } from "@/components/ui/p";
import { TextProps } from "@chakra-ui/react";

const ItemHeaderTitle = ({ children, ...props }: TextProps) => {
  return (
    <P fontWeight={"semibold"} {...props}>
      {children}
    </P>
  );
};

export default ItemHeaderTitle;
