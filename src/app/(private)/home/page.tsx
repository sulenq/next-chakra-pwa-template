"use client";

import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/Page";

export default function Page() {
  return (
    <PageContainer>
      <PageTitle justify={"space-between"} pr={3}></PageTitle>

      <PageContent gap={1}></PageContent>
    </PageContainer>
  );
}
