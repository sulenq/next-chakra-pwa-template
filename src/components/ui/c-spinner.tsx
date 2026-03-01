import { CContainer } from "@/components/ui/c-container";
import { Spinner } from "@/components/ui/spinner";
import { SpinnerProps, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  spinnerProps?: SpinnerProps;
}

export const CSpinner = ({ spinnerProps, ...props }: Props) => {
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
