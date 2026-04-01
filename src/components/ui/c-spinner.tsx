import { CContainer } from "@/components/ui/c-container";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerProps, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface CSpinner extends StackProps {
  spinnerProps?: SpinnerProps;
}

export const CSpinner = ({ spinnerProps, ...props }: CSpinner) => {
  return (
    <CContainer
      minH={"300px"}
      align={"center"}
      justify={"center"}
      opacity={0.4}
      m={"auto"}
      p={4}
      {...props}
    >
      <Spinner {...spinnerProps} />
    </CContainer>
  );
};
