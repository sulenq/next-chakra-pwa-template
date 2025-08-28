import { Text, TextProps } from "@chakra-ui/react";
import parse, { domToReact } from "html-react-parser";

interface Props extends TextProps {
  children?: any;
}

const P = (props: Props) => {
  // Props
  const { children = "", ...restProps } = props;

  return (
    <Text wordBreak={"break-word"} {...restProps}>
      {typeof children === "string"
        ? parse(children, {
            replace: (domNode) => {
              if (
                domNode.type === "tag" &&
                domNode.name === "b" &&
                domNode.children.length
              ) {
                // Cast children to any to avoid TS type mismatch
                return (
                  <b style={{ fontWeight: 700 }}>
                    {domToReact(domNode.children as any)}
                  </b>
                );
              }
            },
          })
        : "Invalid string"}
    </Text>
  );
};

export default P;
