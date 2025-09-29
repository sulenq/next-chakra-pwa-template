"use client";

import { Tooltip } from "@/components/ui/tooltip";
import { Props__PeriodPickerInput } from "@/constants/props";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { back } from "@/utils/client";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import {
  FieldRoot,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Btn } from "./btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "./disclosure";
import { DisclosureHeaderContent } from "./disclosure-header-content";
import { Field } from "./field";
import { NumInput } from "./number-input";
import { P } from "./p";
import { C_ACTIVE_INDICATOR_SIZE } from "@/constants/sizes";

const DEFAULT = {
  year: null,
  month: null,
};

export const PeriodPickerInput = (props: Props__PeriodPickerInput) => {
  // Props
  const {
    id,
    title = "",
    inputValue,
    onConfirm,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    ...restProps
  } = props;
  const resolvedId = id || `period-picker-input`;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(resolvedId, open, onOpen, onClose);

  // States
  const resolvedPlaceholder = placeholder || l.select_period;
  const MONTHS = [
    l.january,
    l.february,
    l.march,
    l.april,
    l.may,
    l.june,
    l.july,
    l.august,
    l.september,
    l.october,
    l.november,
    l.december,
  ];
  const [selected, setSelected] = useState<Type__Period>(DEFAULT);
  const empty = selected.year === null || selected.month === null;

  // handle initial value on open
  useEffect(() => {
    if (inputValue) {
      setSelected({
        year: inputValue.year,
        month: inputValue.month,
      });
    }
  }, [open, inputValue]);

  const handleConfirm = () => {
    if (!empty) {
      onConfirm?.({ month: selected.month, year: selected.year });
    } else {
      onConfirm?.(null);
    }
    back();
  };

  return (
    <>
      <Tooltip
        content={
          !empty
            ? formatDate(new Date(selected.year!, selected.month!), {
                variant: "monthYear",
              })
            : resolvedPlaceholder
        }
      >
        <Btn
          w={"full"}
          clicky={false}
          variant={"outline"}
          justifyContent={"start"}
          onClick={onOpen}
          borderColor={invalid ? "border.error" : "border.muted"}
          {...restProps}
        >
          {!inputValue && <P color={"placeholder"}>{resolvedPlaceholder}</P>}

          {inputValue && (
            <P>
              {formatDate(new Date(inputValue.year!, inputValue.month!), {
                variant: "monthYear",
              })}
            </P>
          )}
        </Btn>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(title || l.select_period)}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldRoot gap={4}>
              <Field
                label={l.year}
                invalid={required && selected.year === null}
                errorText={
                  required && selected.year === null ? l.msg_required_form : ""
                }
              >
                <NumInput
                  inputValue={selected.year}
                  onChange={(val) =>
                    setSelected((prev) => ({ ...prev, year: val! }))
                  }
                  max={9999}
                  placeholder={`${new Date().getFullYear()}`}
                  formatted={false}
                />
              </Field>

              <Field
                label={l.month}
                invalid={required && selected.month === null}
                errorText={
                  required && selected.month === null ? l.msg_required_form : ""
                }
              >
                <SimpleGrid w={"full"} columns={2} gap={2}>
                  {MONTHS.map((month, idx) => {
                    const active = selected.month === idx;

                    return (
                      <Btn
                        key={month}
                        clicky={false}
                        variant={"outline"}
                        onClick={() =>
                          setSelected((prev) => ({ ...prev, month: idx }))
                        }
                      >
                        <HStack w={"full"} justify={"space-between"}>
                          {month}

                          {active && (
                            <Icon
                              color={themeConfig.primaryColor}
                              boxSize={C_ACTIVE_INDICATOR_SIZE}
                            >
                              <IconCircleFilled />
                            </Icon>
                          )}
                        </HStack>
                      </Btn>
                    );
                  })}
                </SimpleGrid>
              </Field>
            </FieldRoot>
          </DisclosureBody>

          <DisclosureFooter>
            <Btn
              variant={"outline"}
              onClick={() => {
                setSelected(DEFAULT);
              }}
            >
              Clear
            </Btn>

            <Btn
              onClick={handleConfirm}
              colorPalette={themeConfig.colorPalette}
              disabled={empty && required}
            >
              {l.confirm}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
