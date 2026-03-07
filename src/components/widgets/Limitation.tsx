import { Btn } from "@/components/ui/btn";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { AppIcon } from "@/components/widgets/AppIcon";
import { DotIndicator } from "@/components/widgets/Indicator";
import useLang from "@/contexts/useLang";
import { HStack } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";

export interface LimitationTableDataProps {
  limit: number;
  setLimit: React.Dispatch<number>;
  limitOptions?: number[];
}
export const Limitation = (props: LimitationTableDataProps) => {
  // Props
  const { limit, setLimit, limitOptions: limitOptionsProps } = props;

  // Contexts
  const { t } = useLang();

  // States
  const limitOptions = limitOptionsProps || [15, 30, 50, 100];

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Btn clicky={false} size={"xs"} variant={"ghost"} pl={"8px"} pr={"6px"}>
          <HStack>
            <P>{t.show}</P>
            <P>{`${limit}`}</P>
          </HStack>

          <AppIcon icon={ChevronDownIcon} ml={1} color={"fg.subtle"} />
        </Btn>
      </MenuTrigger>

      <MenuContent w={"120px"}>
        {limitOptions.map((t) => {
          const isSelected = limit === t;

          return (
            <MenuItem
              key={t}
              value={`${t}`}
              onClick={() => {
                setLimit(t);
              }}
              justifyContent={"space-between"}
            >
              {t}
              {isSelected && <DotIndicator mr={"2px"} />}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
