"use client";

import { Span, SpanProps, Text, TextProps } from "@chakra-ui/react";
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
        as={"p"}
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
      <P ref={ref} as={"p"} fontFamily={"Times New Roman"} {...restProps}>
        {children}
      </P>
    );
  },
);

// -----------------------------------------------------------------

export interface TNumProps extends SpanProps {
  numberFont?: boolean;
}

export const TNum = forwardRef<HTMLParagraphElement, TNumProps>(
  function TNum(props, ref) {
    // Props
    const { children = "", numberFont = true, ...restProps } = props;

    // Constants
    const characters = String(children).split("");

    if (numberFont)
      return (
        <Span
          fontFamily={"number"}
          fontSize={"inherit"}
          fontVariantNumeric={"tabular-nums"}
        >
          {children}
        </Span>
      );

    return (
      <Span
        ref={ref}
        display={"inline-flex"}
        fontSize={"inherit"}
        {...restProps}
      >
        {characters.map((char, index) => (
          <Span
            key={index}
            display={"inline-block"}
            w={"0.85ch"}
            fontSize={"inherit"}
            textAlign={"center"}
          >
            {char}
          </Span>
        ))}
      </Span>
    );
  },
);
