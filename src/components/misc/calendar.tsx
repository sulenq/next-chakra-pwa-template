"use client";

import {
  DatePicker,
  DEFAULT_PERIOD,
  PeriodPicker,
} from "@/components/ui/date-picker-input";
import { Disclosure } from "@/components/ui/disclosure";
import { BackButton } from "@/components/navigation/back-button";
import { Period } from "@/types/global.types";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import { useState } from "react";
import { StackV } from "@/components/ui/stack";

// -----------------------------------------------------------------

const CalendarUI = () => {
  // States
  const [selected, setSelected] = useState<Date[]>([]);
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

  return (
    <StackV gap={4}>
      <PeriodPicker period={period} setPeriod={setPeriod} />
      <DatePicker
        period={period}
        selected={selected}
        setSelected={setSelected}
      />
    </StackV>
  );
};

// -----------------------------------------------------------------

interface CalendarDisclosureProps {
  open: boolean;
}

const CalendarContent = (props: CalendarDisclosureProps) => {
  // Props
  const { open } = props;

  // Store
  const { t } = useLocaleStore();

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
      <StackV w={"fit"} onClick={onOpen} cursor={"pointer"} {...props} />

      <CalendarContent open={open} />
    </>
  );
};

export const Calendar = {
  UI: CalendarUI,
  Trigger: CalendarTrigger,
};
