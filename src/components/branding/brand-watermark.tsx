"use client";

import { P, PProps } from "@/components/ui/p";
import { APP } from "@/constants/_meta";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { Link, Span } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const BrandWatermark = (props: PProps) => {
  // Props
  const { ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // States
  const currentYear = new Date().getFullYear();

  return (
    <P textAlign={"center"} color={"fg.muted"} {...restProps}>
      © {currentYear} powered by{" "}
      <Span
        fontWeight={"bold"}
        transition={"200ms"}
        _hover={{
          color: `${theme.colorPalette}.fg`,
        }}
      >
        <Link href={"https://exium.id"} target={"_blank"}>
          {APP.poweredBy}
        </Link>
      </Span>
    </P>
  );
};
