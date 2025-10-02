"use client";

import { P } from "@/components/ui/p";
import { EmptyString } from "@/components/widget/EmptyString";
import { DotIndicator } from "@/components/widget/Indicator";
import { formatDate } from "@/utils/formatter";
import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  deletedAt?: string | null;
}
export const DeletedStatus = (props: Props) => {
  // Props
  const { deletedAt, ...restProps } = props;

  return (
    <>
      {deletedAt && (
        <HStack {...restProps}>
          <DotIndicator color={"fg.error"} />
          <P>{formatDate(deletedAt, { variant: "numeric", withTime: true })}</P>
        </HStack>
      )}

      {!deletedAt && <EmptyString />}
    </>
  );
};
