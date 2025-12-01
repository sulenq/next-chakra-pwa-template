"use client";

import { PDFViewer } from "@/components/widget/PDFViewer";
import { TOP_DISTANCE } from "@/constants/sizes";
import { SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  return (
    <SimpleGrid id="dashboard" flex={1} columns={[1, null, 2]} gap={4}>
      <PDFViewer
        flex={1}
        fileUrl={`/assets/dummy-pdf.pdf`}
        h={`calc(100vh - ${TOP_DISTANCE})`}
      />
    </SimpleGrid>
  );
}
