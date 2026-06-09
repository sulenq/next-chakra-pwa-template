import { Btn } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/branding/app-icon";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
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

  // Stores
  const { t } = useLocaleStore();

  // States
  const limitOptions = limitOptionsProps || [15, 30, 50, 100];

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Btn size={"xs"} variant={"ghost"} pl={"8px"} pr={"4px"}>
          <StackH gap={2} w={"fit"} align={"center"}>
            <P>{t.show}</P>

            <P>{`${limit}`}</P>
          </StackH>

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
              pl={2}
              onClick={() => {
                setLimit(t);
              }}
            >
              <RadioItem checked={isSelected} />

              {t}
            </Menu.Item>
          );
        })}
      </Menu.Content>
    </Menu.Root>
  );
};
