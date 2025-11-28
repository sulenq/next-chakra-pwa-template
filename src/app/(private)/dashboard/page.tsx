"use client";

import { PDFViewer } from "@/components/widget/PDFViewer";
import { TOP_BAR_H, TOP_TITLE_H } from "@/constants/sizes";
import { SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  return (
    <SimpleGrid id="dashboard" columns={[1, null, 2]} gap={4}>
      <PDFViewer
        fileUrl={`/assets/dummy-pdf.pdf`}
        h={`calc(100vh - ${TOP_BAR_H} - ${TOP_TITLE_H})`}
      />
    </SimpleGrid>
  );
}
