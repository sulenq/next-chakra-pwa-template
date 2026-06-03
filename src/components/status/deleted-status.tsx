"use client";

import { P } from "@/components/ui/p";
import { StackH } from "@/components/ui/stack";
import { EmptyString } from "@/components/data-list/data-empty-value";
import { DotIndicator } from "@/components/ui/indicator";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { formatDate } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface DeletedStatusProps extends StackProps {
  deletedAt?: string | null;
}

export const DeletedStatus = (props: DeletedStatusProps) => {
  // Props
  const { deletedAt, ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  return (
    <>
      {deletedAt && (
        <StackH align={"center"} {...restProps}>
          <DotIndicator bg={"fg.error"} />

          <P>
            {formatDate(deletedAt, t, { variant: "numeric", withTime: true })}
          </P>
        </StackH>
      )}

      {!deletedAt && <EmptyString />}
    </>
  );
};
