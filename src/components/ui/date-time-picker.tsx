import { DatePickerInput } from "@/components/ui/date-picker-input";
import TimePickerInput from "@/components/ui/time-picker-input";
import { Props__DateTimePickerInput } from "@/constants/props";
import { Group } from "@chakra-ui/react";

export const DateTimePickerInput = (props: Props__DateTimePickerInput) => {
  // Props
  const { ...restProps } = props;

  return (
    <Group w={"full"} attached {...restProps}>
      <DatePickerInput w={"50%"} />
      <TimePickerInput w={"50%"} />
    </Group>
  );
};
