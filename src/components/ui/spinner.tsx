import { Spinner as ChakraSpinner, SpinnerProps } from "@chakra-ui/react";

export const Spinner = (props: SpinnerProps) => {
  // TODO buat 3 dots spinner, apply global, like in btn

  return <ChakraSpinner {...props} />;
};
