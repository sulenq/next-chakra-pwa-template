import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";

interface Props extends SpinnerProps {}

const Spinner = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // TODO buat 3 dots spinner, apply global, like in btn
  // TODO cek mobile
  // TODO

  return <ChakraSpinner {...restProps} />;
};

export default Spinner;
