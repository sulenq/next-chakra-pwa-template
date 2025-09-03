import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";

const DocsIndexRoute = () => {
  return (
    <CContainer p={4} gap={8}>
      <P fontSize={"xl"} fontWeight={"bold"}>
        Docs
      </P>

      <CContainer></CContainer>
    </CContainer>
  );
};

export default DocsIndexRoute;
