import { Spinner, SpinnerProps, StackProps, VStack } from "@chakra-ui/react";

interface Props extends StackProps {
  spinnerProps?: SpinnerProps;
}

export const CSpinner = ({ spinnerProps, ...props }: Props) => {
  return (
    <VStack
      w={"full"}
      minH={"300px"}
      justify={"center"}
      opacity={0.4}
      m={"auto"}
      {...props}
    >
      <Spinner color={"d3"} {...spinnerProps} />
    </VStack>
  );
};
