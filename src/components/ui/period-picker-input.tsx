"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { Disclosure } from "@/components/ui/disclosure";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { getMonthNames } from "@/constants/months";
import { ButtonVariant, DisclosureSizes, Period } from "@/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { getLocalTimezone } from "@/utils/time";
import { HStack, SimpleGrid, useFieldContext } from "@chakra-ui/react";
import { CalendarClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

const DEFAULT = {
  year: null,
  month: null,
};

// -----------------------------------------------------------------

export interface PeriodPickerInputProps extends Omit<BtnProps, "onChange"> {
  id?: string;
  title?: string;
  inputValue?: Period | null;
  onChange?: (inputValue?: PeriodPickerInputProps["inputValue"]) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  disclosureSize?: DisclosureSizes;
  multiple?: boolean;
  variant?: ButtonVariant;
  withIcon?: boolean;
}

export const PeriodPickerInput = (props: PeriodPickerInputProps) => {
  // Props
  const {
    id,
    title = "",
    inputValue,
    onChange,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    variant = "outline",
    withIcon = true,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(id || "period-picker-input"),
  );

  // States
  const [selected, setSelected] = useState<Period>(DEFAULT);

  // Constants
  const monthNames = getMonthNames(t);

  // Derived Values
  const isSubtleVariant = variant === "subtle";
  const isGhostVariant = variant === "ghost";
  const isEmpty = selected.year === null || selected.month === null;
  const isIncomplete =
    (selected.year === null && selected.month !== null) ||
    (selected.year !== null && selected.month === null);
  const resolvedPlaceholder = placeholder || t.select_period;
  const resolvedInvalid = invalid ?? fc?.invalid;

  // Utils
  function handleConfirm() {
    if (!isEmpty) {
      onChange?.({ month: selected.month, year: selected.year });
    } else {
      onChange?.(null);
    }
    back();
  }
  function handleEnterToConfirm(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleConfirm();
    }
  }

  // handle initial value on open
  useEffect(() => {
    if (inputValue) {
      setSelected({
        year: inputValue.year,
        month: inputValue.month,
      });
    }
  }, [open, inputValue]);

  return (
    <>
      <Tooltip
        content={
          !isEmpty
            ? formatDate(new Date(selected.year!, selected.month!), t, {
                variant: "monthYear",
              })
            : resolvedPlaceholder
        }
      >
        <Btn
          w={"full"}
          bg={isSubtleVariant ? "d0" : ""}
          gap={4}
          variant={variant}
          justifyContent={"space-between"}
          onClick={onOpen}
          border={isGhostVariant ? "none" : ""}
          borderColor={
            resolvedInvalid
              ? "border.error"
              : isSubtleVariant
                ? "transparent"
                : "border.muted"
          }
          {...restProps}
        >
          {!inputValue && <P color={"placeholder"}>{resolvedPlaceholder}</P>}

          {inputValue && (
            <P>
              {formatDate(new Date(inputValue.year!, inputValue.month!), t, {
                variant: "monthYear",
                timezoneKey: getLocalTimezone().key,
              })}
            </P>
          )}

          {withIcon && (
            <AppIconLucide
              icon={CalendarClockIcon}
              color={"fg.subtle"}
              mr={-1}
            />
          )}
        </Btn>
      </Tooltip>

      <Disclosure.Root open={open} lazyLoad size={disclosureSize}>
        <Disclosure.Content>
          <Disclosure.Header>
            <Disclosure.HeaderContent
              title={capitalizeWords(title || t.select_period)}
            />
          </Disclosure.Header>

          <Disclosure.Body>
            <FieldsetRoot>
              <Field
                label={t.month}
                invalid={required && selected.month === null}
                errorText={
                  required && selected.month === null ? t.msg_required_form : ""
                }
              >
                <SimpleGrid w={"full"} columns={2} gap={2}>
                  {monthNames.map((month, idx) => {
                    const isSelected = selected.month === idx;

                    return (
                      <Btn
                        key={month}
                        clicky={false}
                        variant={"outline"}
                        onClick={() =>
                          setSelected((prev) => ({ ...prev, month: idx }))
                        }
                        color={isSelected ? "" : "fg.muted"}
                      >
                        <HStack w={"full"} justify={"space-between"}>
                          {month}

                          {isSelected && <DotIndicator />}
                        </HStack>
                      </Btn>
                    );
                  })}
                </SimpleGrid>
              </Field>

              <Field
                label={t.year}
                invalid={required && selected.year === null}
                errorText={
                  required && selected.year === null ? t.msg_required_form : ""
                }
              >
                <NumInput
                  inputValue={selected.year}
                  onChange={(val) =>
                    setSelected((prev) => ({ ...prev, year: val! }))
                  }
                  onKeyDown={handleEnterToConfirm}
                  max={9999}
                  placeholder={`${new Date().getFullYear()}`}
                  formatted={false}
                  variant={"outline"}
                />
              </Field>
            </FieldsetRoot>
          </Disclosure.Body>

          <Disclosure.Footer>
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
              disabled={(required && isEmpty) || isIncomplete}
            >
              {t.confirm}
            </Btn>
          </Disclosure.Footer>
        </Disclosure.Content>
      </Disclosure.Root>
    </>
  );
};
