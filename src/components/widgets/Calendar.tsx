"use client";

import { CContainer } from "@/components/ui/c-container";
import {
  DatePicker,
  DEFAULT_PERIOD,
  PeriodPicker,
} from "@/components/ui/date-picker-input";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { BackButton } from "@/components/widgets/BackButton";
import { Period } from "@/constants/types";
import useLang from "@/contexts/useLang";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import { useState } from "react";

export const Calendar = () => {
  // States
  const [selected, setSelected] = useState<Date[]>([]);
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

  return (
    <CContainer gap={4}>
      <PeriodPicker period={period} setPeriod={setPeriod} />
      <DatePicker
        period={period}
        selected={selected}
        setSelected={setSelected}
      />
    </CContainer>
  );
};

interface CalendarDisclosureProps {
  open: boolean;
}
export const CalendarDisclosure = (props: CalendarDisclosureProps) => {
  // Props
  const { open } = props;

  // Contexts
  const { t } = useLang();

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={t.calendar} />
        </DisclosureHeader>

        <DisclosureBody>
          <Calendar />
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

export const CalendarDisclosureTrigger = (props: StackProps) => {
  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("calendar"));

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} cursor={"pointer"} {...props} />

      <CalendarDisclosure open={open} />
    </>
  );
};
