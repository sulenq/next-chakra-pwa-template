import { Btn } from "@/components/ui/btn";
import { SearchInput } from "@/components/ui/search-input";
import { DataDisplayToggle } from "@/components/widgets/data-display-toggle";
import { LucideIcon } from "@/components/widgets/icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { LAYANAN_ID } from "@/features/layanan/pages/layanan.page";
import { HStack, Icon } from "@chakra-ui/react";
import { Settings2Icon } from "lucide-react";

// -----------------------------------------------------------------

interface LayananDataUtilsProps {
  filter: any;
  setFilter: any;
}

export const LayananDataUtils = (props: LayananDataUtilsProps) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack w={"full"} {...restProps}>
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

      <DataDisplayToggle iconButton navKey={LAYANAN_ID} size={"sm"} />
    </HStack>
  );
};
