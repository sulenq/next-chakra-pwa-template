"use client";

import { CContainer } from "@/components/ui/c-container";
import {
  DatePicker,
  DEFAULT_PERIOD,
  PeriodPicker,
} from "@/components/ui/date-picker-input";
import { Disclosure } from "@/components/ui/disclosure";
import { BackButton } from "@/components/widgets/back-button";
import { Period } from "@/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import { useState } from "react";

// -----------------------------------------------------------------

const CalendarUI = () => {
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

// -----------------------------------------------------------------

interface CalendarDisclosureProps {
  open: boolean;
}

const CalendarContent = (props: CalendarDisclosureProps) => {
  // Props
  const { open } = props;

  // Contexts
  const { t } = useLocale();

  return (
    <Disclosure.Root open={open} lazyLoad size={"xs"}>
      <Disclosure.Content>
        <Disclosure.Header>
          <Disclosure.HeaderContent title={t.calendar} />
        </Disclosure.Header>

        <Disclosure.Body>
          <CalendarUI />
        </Disclosure.Body>

        <Disclosure.Footer>
          <BackButton />
        </Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};

// -----------------------------------------------------------------

const CalendarTrigger = (props: StackProps) => {
  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId("calendar"));

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} cursor={"pointer"} {...props} />

      <CalendarContent open={open} />
    </>
  );
};

export const Calendar = {
  UI: CalendarUI,
  Trigger: CalendarTrigger,
};
