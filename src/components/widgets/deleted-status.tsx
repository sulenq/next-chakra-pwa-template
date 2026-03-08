"use client";

import { P } from "@/components/ui/p";
import { EmptyString } from "@/components/widgets/empty-string";
import { DotIndicator } from "@/components/widgets/indicator";
import useLocale from "@/contexts/useLocale";
import { formatDate } from "@/utils/formatter";
import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  deletedAt?: string | null;
}
export const DeletedStatus = (props: Props) => {
  // Props
  const { deletedAt, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <>
      {deletedAt && (
        <HStack {...restProps}>
          <DotIndicator color={"fg.error"} />

          <P>
            {formatDate(deletedAt, t, { variant: "numeric", withTime: true })}
          </P>
        </HStack>
      )}

      {!deletedAt && <EmptyString />}
    </>
  );
};
