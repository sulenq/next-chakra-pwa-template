"use client";

import { PdfViewer } from "@/components/widget/PDFViewer";
import { TOP_BAR_H } from "@/constants/sizes";
import { SimpleGrid } from "@chakra-ui/react";

const AdminDashboardRoute = () => {
  return (
    <SimpleGrid id="dashboard" columns={2} gap={4}>
      <PdfViewer
        fileUrl={`/assets/dummy-pdf.pdf`}
        h={`calc(100vh - ${TOP_BAR_H})`}
      />
    </SimpleGrid>
  );
};
export default AdminDashboardRoute;
