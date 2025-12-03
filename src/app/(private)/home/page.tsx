"use client";

import { CContainer } from "@/components/ui/c-container";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  return (
    <PageContainer>
      <SimpleGrid flex={1} columns={[1, null, 2]}>
        <CContainer borderRight={"1px solid"} borderColor={"border.muted"}>
          <PageContent gap={1}></PageContent>
        </CContainer>
      </SimpleGrid>
    </PageContainer>
  );
}
