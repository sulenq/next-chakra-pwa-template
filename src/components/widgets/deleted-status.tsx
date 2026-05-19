"use client";

import { P } from "@/components/ui/p";
import { StackH } from "@/components/ui/stack";
import { EmptyString } from "@/components/widgets/empty-string";
import { DotIndicator } from "@/components/widgets/indicator";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { formatDate } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface DeletedStatusProps extends StackProps {
  deletedAt?: string | null;
}

export const DeletedStatus = (props: DeletedStatusProps) => {
  // Props
  const { deletedAt, ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();

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
