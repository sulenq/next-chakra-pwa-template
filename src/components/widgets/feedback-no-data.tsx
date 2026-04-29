"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widgets/feedback-state";
import { MIN_H_FEEDBACK_CONTAINER } from "@/shared/constants/styles";
import { useLocale } from "@/contexts/useLocale";

// -----------------------------------------------------------------

export default function FeedbackNoData(props: FeedbackStateProps) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      align={"center"}
      minH={MIN_H_FEEDBACK_CONTAINER}
      justify={"center"}
      gap={4}
      {...restProps}
    >
      <FeedbackState
        icon={null}
        title={title ?? t.alert_no_data.title}
        description={description ?? t.alert_no_data.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
