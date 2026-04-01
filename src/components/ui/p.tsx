"use client";

import { Text, TextProps } from "@chakra-ui/react";
import parse, { domToReact } from "html-react-parser";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface PProps extends TextProps {
  children?: any;
}

export const P = forwardRef<HTMLParagraphElement, PProps>(
  function P(props, ref) {
    // Props
    const { children = "", ...restProps } = props;

    return (
      <Text
        ref={ref}
        as="p"
        wordBreak={"break-word"}
        fontFamily={"inherit"}
        {...restProps}
      >
        {typeof children === "string"
          ? parse(children, {
              replace: (domNode) => {
                if (
                  domNode.type === "tag" &&
                  domNode.name === "b" &&
                  domNode.children.length
                ) {
                  return (
                    <b style={{ fontWeight: 700 }}>
                      {domToReact(domNode.children as any)}
                    </b>
                  );
                }
              },
            })
          : children}
      </Text>
    );
  },
);

// -----------------------------------------------------------------

export const PSerif = forwardRef<HTMLParagraphElement, PProps>(
  function PSerif(props, ref) {
    // Props
    const { children = "", ...restProps } = props;

    return (
      <P ref={ref} as="p" fontFamily={"Times New Roman"} {...restProps}>
        {children}
      </P>
    );
  },
);
