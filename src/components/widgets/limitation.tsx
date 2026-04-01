import { Btn } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { useLocale } from "@/contexts/useLocale";
import { HStack } from "@chakra-ui/react";
import { ChevronDownIcon } from "lucide-react";

// -----------------------------------------------------------------

export interface LimitationTableDataProps {
  limit: number;
  setLimit: React.Dispatch<number>;
  limitOptions?: number[];
}

export const Limitation = (props: LimitationTableDataProps) => {
  // Props
  const { limit, setLimit, limitOptions: limitOptionsProps } = props;

  // Contexts
  const { t } = useLocale();

  // States
  const limitOptions = limitOptionsProps || [15, 30, 50, 100];

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Btn clicky={false} size={"xs"} variant={"ghost"} pl={"8px"} pr={"4px"}>
          <HStack>
            <P>{t.show}</P>
            <P>{`${limit}`}</P>
          </HStack>

          <AppIconLucide icon={ChevronDownIcon} ml={1} color={"fg.subtle"} />
        </Btn>
      </Menu.Trigger>

      <Menu.Content w={"120px"}>
        {limitOptions.map((t) => {
          const isSelected = limit === t;

          return (
            <Menu.Item
              key={t}
              value={`${t}`}
              onClick={() => {
                setLimit(t);
              }}
              justifyContent={"space-between"}
            >
              {t}
              {isSelected && <DotIndicator mr={"2px"} />}
            </Menu.Item>
          );
        })}
      </Menu.Content>
    </Menu.Root>
  );
};
