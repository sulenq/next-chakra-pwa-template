"use client";

import { StackH } from "@/components/ui/stack";
import { Item } from "@/components/widgets/item";
import { MainView, useMainViewContext } from "@/components/widgets/main-view";
import { ScrollH } from "@/components/widgets/scroll-h";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { LayananList } from "@/features/layanan/components/layanan.list";
import { LayananListUtils } from "@/features/layanan/components/layanan.list-utils";
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
        <ScrollH mb={4}>
          <StackH
            align={"center"}
            minW={"full"}
            justify={"space-between"}
            px={R_SPACING_MD}
          >
            <LayananListUtils filter={filter} setFilter={setFilter} />
          </StackH>
        </ScrollH>
      )}

      <Item.Body flex={1} overflowY={"auto"}>
        <LayananList filter={filter} />
      </Item.Body>
    </MainView.Content>
  );
}
