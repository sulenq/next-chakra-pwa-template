import { SpinnerProps } from "@chakra-ui/react";

interface Props extends SpinnerProps {}

const Spinner = (props: Props) => {
  // Props
  const { ...restProps } = props;

  return <Spinner animationDuration="0.8s" {...restProps} />;
};

export default Spinner;
