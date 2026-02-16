import { Btn } from "@/components/ui/btn";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { DotIndicator } from "@/components/widget/Indicator";
import { Props_LimitationTableData } from "@/constants/props";
import useLang from "@/context/useLang";
import { HStack, Icon } from "@chakra-ui/react";
import { IconCaretDownFilled } from "@tabler/icons-react";

export const Limitation = (props: Props_LimitationTableData) => {
  // Props
  const { limit, setLimit, limitOptions: limitOptionsProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const limitOptions = limitOptionsProps || [15, 30, 50, 100];

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Btn clicky={false} size={"xs"} variant={"ghost"} pl={"8px"} pr={"6px"}>
          <HStack>
            <P>{l.show}</P>
            <P>{`${limit}`}</P>
          </HStack>

          <Icon boxSize={4} ml={1} color={"fg.subtle"}>
            <IconCaretDownFilled />
          </Icon>
        </Btn>
      </MenuTrigger>

      <MenuContent w={"120px"}>
        {limitOptions.map((l) => {
          const isActive = limit === l;

          return (
            <MenuItem
              key={l}
              value={`${l}`}
              onClick={() => {
                setLimit(l);
              }}
              justifyContent={"space-between"}
            >
              {l}
              {isActive && <DotIndicator mr={"2px"} />}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
