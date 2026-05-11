"use client";

import { StackV } from "@/components/ui/stack";
import FeedbackState, {
  FeedbackStateProps,
} from "@/components/widgets/feedback-state";
import { MIN_H_FEEDBACK_CONTAINER } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";

// -----------------------------------------------------------------

export default function FeedbackNoData(props: FeedbackStateProps) {
  // Props
  const { title, description, icon, children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <StackV
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
    </StackV>
  );
}
