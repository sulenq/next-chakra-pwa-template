"use client";

import { Item } from "@/components/widgets/item";
import {
  ConstrainedContainer,
  MainView,
  useMainViewContext,
} from "@/components/widgets/main-view";
import { ScrollH } from "@/components/widgets/scroll-h";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { LayananData } from "@/features/layanan/components/layanan.data";
import { LayananDataUtils } from "@/features/layanan/components/layanan.data-utils";
import { HStack } from "@chakra-ui/react";
import { useState } from "react";
import { LayananCreate } from "../components/layanan.create";

// -----------------------------------------------------------------

export const LAYANAN_ID = `layanan`;
const DEFAULT_FILTER = {
  search: "",
};

// -----------------------------------------------------------------

export default function LayananPage() {
  // Props
  const { isSmContainer } = useMainViewContext();

  // States
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <MainView.Content p={GAP}>
      <ConstrainedContainer flex={1} overflowY={"auto"}>
        <MainView.Header
          withTitle
          MainViewTitleProps={{
            ml: [2, null, 0],
          }}
          justify={"space-between"}
        >
          <HStack>
            {!isSmContainer && (
              <LayananDataUtils filter={filter} setFilter={setFilter} />
            )}

            <LayananCreate />
          </HStack>
        </MainView.Header>

        {isSmContainer && (
          <ScrollH mb={4}>
            <HStack minW={"full"} justify={"space-between"} px={R_SPACING_MD}>
              <LayananDataUtils filter={filter} setFilter={setFilter} />
            </HStack>
          </ScrollH>
        )}

        <Item.Body flex={1} overflowY={"auto"}>
          <LayananData filter={filter} />
        </Item.Body>
      </ConstrainedContainer>
    </MainView.Content>
  );
}
