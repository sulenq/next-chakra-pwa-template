"use client";

import { Btn } from "@/components/ui/btn";
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
import { Period } from "@/constants/types";
import useLang from "@/context/useLang";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { disclosureId } from "@/utils/disclosure";
import { StackProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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

interface CalendarDisclosureProps {
  open: boolean;
}
export const CalendarDisclosure = (props: CalendarDisclosureProps) => {
  // Props
  const { open } = props;

  // Contexts
  const { t } = useLang();

  // States
  const [selected, setSelected] = useState<Date[]>([]);
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);

  useEffect(() => {
    if (open) {
      setPeriod(DEFAULT_PERIOD);
    }
  }, [open]);

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={t.calendar} />
        </DisclosureHeader>

        <DisclosureBody>
          <CContainer gap={4}>
            <PeriodPicker period={period} setPeriod={setPeriod} />
            <DatePicker
              period={period}
              selected={selected}
              setSelected={setSelected}
            />
          </CContainer>
        </DisclosureBody>

        <DisclosureFooter>
          <Btn
            variant={"outline"}
            onClick={() => {
              setSelected([]);
            }}
          >
            Clear
          </Btn>
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};
