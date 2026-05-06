"use client";

import { StackV } from "@/components/ui/stack";
import { Item } from "@/components/widgets/item";
import { MainView, useMainViewContext } from "@/components/widgets/main-view";
import { ScrollH } from "@/components/widgets/scroll-h";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { LayananData } from "@/features/layanan/components/layanan.data";
import { LayananDataUtils } from "@/features/layanan/components/layanan.data-utils";
import { last } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayananCreate } from "../components/layanan.create";

// -----------------------------------------------------------------

export const LAYANAN_ID = `layanan`;
const DEFAULT_FILTER = {
  search: "",
};

// -----------------------------------------------------------------

export default function LayananPage() {
  // Contexts
  const { t } = useLocale();
  const { isSmContainer } = useMainViewContext();

  // Hooks
  const pathname = usePathname();

  // States
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  // Constants
  const activeNav = getActiveNavs(pathname);

  // Derived Values
  const routeTitle =
    last(activeNav)?.label || pluckString(t, last(activeNav)?.labelKey || "");

  return (
    <MainView.Content p={GAP}>
      <StackV flex={1} overflowY={"auto"}>
        <MainView.Header
          withTitle
          MainViewTitleProps={{
            ml: [2, null, 0],
          }}
          justify={"space-between"}
        >
          <HStack>
            {!isSmContainer && (
              <LayananDataUtils
                filter={filter}
                setFilter={setFilter}
                routeTitle={routeTitle}
              />
            )}

            <LayananCreate />
          </HStack>
        </MainView.Header>

        {isSmContainer && (
          <ScrollH mb={4}>
            <HStack minW={"full"} justify={"space-between"} px={R_SPACING_MD}>
              <LayananDataUtils
                filter={filter}
                setFilter={setFilter}
                routeTitle={routeTitle}
              />
            </HStack>
          </ScrollH>
        )}

        <Item.Body flex={1} overflowY={"auto"}>
          <LayananData filter={filter} routeTitle={routeTitle} />
        </Item.Body>
      </StackV>
    </MainView.Content>
  );
}
