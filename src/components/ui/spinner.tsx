import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";

interface Props extends SpinnerProps {}

const Spinner = (props: Props) => {
  // Props
  const { ...restProps } = props;

  return <ChakraSpinner {...restProps} />;
};

export default Spinner;
