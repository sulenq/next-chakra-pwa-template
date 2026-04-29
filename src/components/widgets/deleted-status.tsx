"use client";

import { P } from "@/components/ui/p";
import { EmptyString } from "@/components/widgets/empty-string";
import { DotIndicator } from "@/components/widgets/indicator";
import { useLocale } from "@/contexts/useLocale";
import { formatDate } from "@/shared/utils/formatter";
import { HStack, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface DeletedStatusProps extends StackProps {
  deletedAt?: string | null;
}

export const DeletedStatus = (props: DeletedStatusProps) => {
  // Props
  const { deletedAt, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <>
      {deletedAt && (
        <HStack {...restProps}>
          <DotIndicator bg={"fg.error"} />

          <P>
            {formatDate(deletedAt, t, { variant: "numeric", withTime: true })}
          </P>
        </HStack>
      )}

      {!deletedAt && <EmptyString />}
    </>
  );
};
