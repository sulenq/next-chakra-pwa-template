"use client";

import { Btn } from "@/components/ui/btn";
import { Icon } from "@chakra-ui/react";
import { IconTable, IconLayoutGrid } from "@tabler/icons-react";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { useDataDisplay } from "@/context/useDataDisplay";

interface Props {
  navKey: string;
}

export function DataDisplayToggle({ navKey }: Props) {
  // Contexts
  const displays = useDataDisplay((s) => s.displays);
  const setDisplay = useDataDisplay((s) => s.setDisplay);

  // Hooks
  const iss = useIsSmScreenWidth();

  // States
  const displayTable = (displays[navKey] || "table") === "table";

  return (
    <Btn
      iconButton={iss}
      size="md"
      w={iss ? undefined : "100px"}
      variant="outline"
      onClick={() => setDisplay(navKey, displayTable ? "grid" : "table")}
    >
      <Icon>
        {displayTable ? (
          <IconTable stroke={1.5} />
        ) : (
          <IconLayoutGrid stroke={1.5} />
        )}
      </Icon>

      {!iss && (displayTable ? "Table" : "Grid")}
    </Btn>
  );
}
