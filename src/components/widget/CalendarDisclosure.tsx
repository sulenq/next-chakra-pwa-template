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
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { disclosureId } from "@/utils/disclosure";
import { StackProps, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props extends StackProps {}

export const CalendarDisclosureTrigger = (props: Props) => {
  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`calendar`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} cursor={"pointer"} {...props} />

      <CalendarDisclosure open={open} />
    </>
  );
};

export const CalendarDisclosure = (props: any) => {
  // Props
  const { open, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [selected, setSelected] = useState<Date[]>([]);
  const [period, setPeriod] = useState<Type__Period>(DEFAULT_PERIOD);

  useEffect(() => {
    if (open) {
      setPeriod(DEFAULT_PERIOD);
    }
  }, [open]);

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"} {...restProps}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent title={l.calendar} />
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
