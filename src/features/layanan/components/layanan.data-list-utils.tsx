import { Btn } from "@/components/ui/btn";
import { SearchInput } from "@/components/ui/search-input";
import { StackH } from "@/components/ui/stack";
import { DataListDisplayToggle } from "@/features/data-list-display/components/data-list-display-toggle";
import { LucideIcon } from "@/components/misc/icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { displayKeys } from "@/features/data-list-display/constants/displayKeys";
import { Icon } from "@chakra-ui/react";
import { Settings2Icon } from "lucide-react";

// -----------------------------------------------------------------

interface LayananListUtilsProps {
  filter: any;
  setFilter: any;
}

export const LayananListUtils = (props: LayananListUtilsProps) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <StackH align={"center"} gap={2} {...restProps}>
      <SearchInput
        queryKey={"q-layanan"}
        inputProps={{
          size: "sm",
        }}
        minW={"200px"}
      />

      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={Settings2Icon} />
        </Icon>
      </Btn>

      <DataListDisplayToggle
        iconButton
        displayKey={displayKeys.layanan}
        size={"sm"}
      />
    </StackH>
  );
};
