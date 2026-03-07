"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Tooltip } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/widgets/Icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useDataDisplay } from "@/contexts/useDataDisplay";
import { Icon } from "@chakra-ui/react";
import { LayoutGridIcon, Table2Icon } from "lucide-react";

interface DataDisplayToggleProps extends BtnProps {
  navKey: string;
}
export function DataDisplayToggle(props: DataDisplayToggleProps) {
  // Props
  const { navKey, ...restProps } = props;

  // Contexts
  const displays = useDataDisplay((s) => s.displays);
  const setDisplay = useDataDisplay((s) => s.setDisplay);

  // States
  const displayTable = (displays[navKey] || "table") === "table";

  return (
    <Tooltip content={displayTable ? "Table view" : "Grid view"}>
      <Btn
        iconButton
        variant="outline"
        onClick={() => setDisplay(navKey, displayTable ? "grid" : "table")}
        {...restProps}
      >
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          {displayTable ? (
            <LucideIcon icon={Table2Icon} />
          ) : (
            <LucideIcon icon={LayoutGridIcon} />
          )}
        </Icon>
      </Btn>
    </Tooltip>
  );
}
