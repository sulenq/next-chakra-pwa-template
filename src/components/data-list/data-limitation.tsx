import { Btn } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/branding/app-icon";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
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
  const { t } = useLocaleContext();

  // States
  const limitOptions = limitOptionsProps || [15, 30, 50, 100];

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Btn clicky={false} size={"xs"} variant={"ghost"} pl={"8px"} pr={"4px"}>
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
