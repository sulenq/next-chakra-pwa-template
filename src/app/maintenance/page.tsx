import dynamic from "next/dynamic";

const MaintenancePage = dynamic(
  () => import("@/pages/errors/MaintenancePage"),
  {
    ssr: false,
  }
);

export default MaintenancePage;
