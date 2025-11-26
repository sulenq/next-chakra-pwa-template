"use client";

import { PDFViewer } from "@/components/widget/PDFViewer";
import { TOP_BAR_H } from "@/constants/sizes";
import { SimpleGrid } from "@chakra-ui/react";

const AdminDashboardRoute = () => {
  return (
    <SimpleGrid id="dashboard" columns={[1, null, 2]} gap={4} px={4} pb={4}>
      <PDFViewer
        fileUrl={`/assets/dummy-pdf.pdf`}
        h={`calc(100vh - ${TOP_BAR_H} - 16px)`}
      />
    </SimpleGrid>
  );
};
export default AdminDashboardRoute;
