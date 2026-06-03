"use client";

import { StackH } from "@/components/ui/stack";
import { Item } from "@/components/container/item";
import { MainView, useMainViewContext } from "@/components/container/main-view";
import { HScroll } from "@/components/container/h-scroll";
import { GAP, R_SPACING_MD, TOP_BAR_H } from "@/constants/styles";
import { LayananCreate } from "@/features/layanan/components/layanan.create";
import { LayananDataList } from "@/features/layanan/components/layanan.data-list";
import { LayananListUtils } from "@/features/layanan/components/layanan.data-list-utils";
import { useState } from "react";
import { cssCalc } from "@/utils/style";

// -----------------------------------------------------------------

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
    <MainView.Content
      maxH={cssCalc(`100dvh - ${TOP_BAR_H}`)}
      p={GAP}
      overflowY={"auto"}
    >
      <MainView.Header
        withTitle
        MainViewTitleProps={{
          ml: [2, null, 0],
        }}
        justify={"space-between"}
      >
        <StackH align={"center"} gap={2}>
          {!isSmContainer && (
            <LayananListUtils filter={filter} setFilter={setFilter} />
          )}

          <LayananCreate />
        </StackH>
      </MainView.Header>

      {isSmContainer && (
        <HScroll mb={4}>
          <StackH
            align={"center"}
            minW={"full"}
            justify={"space-between"}
            px={R_SPACING_MD}
          >
            <LayananListUtils filter={filter} setFilter={setFilter} />
          </StackH>
        </HScroll>
      )}

      <Item.Body flex={1} overflowY={"auto"}>
        <LayananDataList filter={filter} />
      </Item.Body>
    </MainView.Content>
  );
}
