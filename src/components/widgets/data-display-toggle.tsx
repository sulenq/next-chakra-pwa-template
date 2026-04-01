"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { useDataDisplay } from "@/contexts/useDataDisplay";
import { LayoutGridIcon, TableIcon } from "lucide-react";

// -----------------------------------------------------------------

interface DataDisplayToggleProps extends BtnProps {
  navKey: string;
}

export function DataDisplayToggle(props: DataDisplayToggleProps) {
  // Props
  const { navKey, ...restProps } = props;

  // Contexts
  const displays = useDataDisplay((s) => s.displays);
  const setDisplay = useDataDisplay((s) => s.setDisplay);

  // Derived Values
  const displayTable = (displays[navKey] || "table") === "table";

  return (
    <Tooltip content={displayTable ? "Table view" : "Grid view"}>
      <Btn
        iconButton
        variant={"outline"}
        onClick={() => setDisplay(navKey, displayTable ? "grid" : "table")}
        {...restProps}
      >
        <AppIconLucide icon={displayTable ? TableIcon : LayoutGridIcon} />
      </Btn>
    </Tooltip>
  );
}
