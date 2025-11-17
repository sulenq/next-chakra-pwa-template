"use client";

import { ReactPDFViewer } from "@/components/widget/ReactPDFViewer";
import { TOP_BAR_H } from "@/constants/sizes";
import { SimpleGrid } from "@chakra-ui/react";

const AdminDashboardRoute = () => {
  return (
    <SimpleGrid id="dashboard" columns={2} gap={4}>
      <ReactPDFViewer
        fileUrl={`/assets/dummy-pdf.pdf`}
        maxH={`calc(100vh -  ${TOP_BAR_H})`}
      />
    </SimpleGrid>
  );
};
export default AdminDashboardRoute;
