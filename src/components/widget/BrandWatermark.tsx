"use client";

import { APP } from "@/constants/_meta";
import { Span, Text, TextProps } from "@chakra-ui/react";
import Link from "next/link";

interface Props extends TextProps {}

const BrandWatermark = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // States
  const currentYear = new Date().getFullYear();

  return (
    <Text textAlign={"center"} fontSize={"sm"} {...restProps}>
      © {currentYear} powered by{" "}
      <Span fontWeight={"bold"}>
        <Link href={"https://exium.id"} target="_blank">
          {APP.poweredBy}
        </Link>
      </Span>
    </Text>
  );
};

export default BrandWatermark;
