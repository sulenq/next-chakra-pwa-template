"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/branding/app-icon";
import { useDataDisplayStore } from "@/features/data-list-display/stores/use-data-display-store";
import { LayoutGridIcon, TableIcon } from "lucide-react";

// -----------------------------------------------------------------

interface DataListDisplayToggleProps extends BtnProps {
  displayKey: string;
}

export function DataListDisplayToggle(props: DataListDisplayToggleProps) {
  // Props
  const { displayKey, ...restProps } = props;

  // Stores
  const displays = useDataDisplayStore((s) => s.displays);
  const setDisplay = useDataDisplayStore((s) => s.setDisplay);

  // Derived Values
  const displayTable = (displays[displayKey] || "table") === "table";

  return (
    <Tooltip content={displayTable ? "Table view" : "Grid view"}>
      <Btn
        iconButton
        variant={"outline"}
        onClick={() => setDisplay(displayKey, displayTable ? "grid" : "table")}
        {...restProps}
      >
        <AppIconLucide icon={displayTable ? TableIcon : LayoutGridIcon} />
      </Btn>
    </Tooltip>
  );
}
