"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Tooltip } from "@/components/ui/tooltip";
import { useDataDisplay } from "@/context/useDataDisplay";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { Icon } from "@chakra-ui/react";
import { IconLayoutGrid, IconTable } from "@tabler/icons-react";

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
    <Tooltip content={displayTable ? "Table" : "Grid"}>
      <Btn
        iconButton={iss || iconButton}
        w={iss || iconButton ? undefined : "100px"}
        variant="outline"
        onClick={() => setDisplay(navKey, displayTable ? "grid" : "table")}
        {...restProps}
      >
        <Icon boxSize={5}>
          {displayTable ? (
            <IconTable stroke={1.5} />
          ) : (
            <IconLayoutGrid stroke={1.5} />
          )}
        </Icon>

        {!iconButton && !iss && (displayTable ? "Table" : "Grid")}
      </Btn>
    </Tooltip>
  );
}
