"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Tooltip } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/widget/Icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useDataDisplay } from "@/context/useDataDisplay";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { Icon } from "@chakra-ui/react";
import { LayoutGridIcon, Table2Icon } from "lucide-react";

interface Props__DataDisplayToggle extends BtnProps {
  navKey: string;
  iconButton?: boolean;
}
export function DataDisplayToggle(props: Props__DataDisplayToggle) {
  // Props
  const { navKey, iconButton = false, ...restProps } = props;

  // Contexts
  const displays = useDataDisplay((s) => s.displays);
  const setDisplay = useDataDisplay((s) => s.setDisplay);

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const displayTable = (displays[navKey] || "table") === "table";

  return (
    <Tooltip content={displayTable ? "Table mode" : "Grid mode"}>
      <Btn
        iconButton={iss || iconButton}
        w={iss || iconButton ? undefined : "100px"}
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

        {!iconButton && !iss && (displayTable ? "Table mode" : "Grid mode")}
      </Btn>
    </Tooltip>
  );
}
