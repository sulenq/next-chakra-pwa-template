"use client";

import { Btn } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { LucideIcon } from "@/components/widget/Icon";
import { getMonthNames } from "@/constants/months";
import { Props__PeriodPickerInput } from "@/constants/props";
import {
  BASE_ICON_BOX_SIZE,
  C_ACTIVE_INDICATOR_SIZE,
} from "@/constants/styles";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { getLocalTimezone } from "@/utils/time";
import { HStack, Icon, SimpleGrid, useFieldContext } from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import { CalendarClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

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
    onChange,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    variant = "outline",
    withIcon = true,
    ...restProps
  } = props;
  const resolvedId = id || `period-picker-input`;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // States
  const { open, onOpen } = usePopDisclosure(disclosureId(resolvedId));
  const [selected, setSelected] = useState<Type__Period>(DEFAULT);
  const monthNames = getMonthNames(l);

  // Derived States
  const isSubtleVariant = variant === "subtle";
  const isGhostVariant = variant === "ghost";
  const resolvedInvalid = invalid ?? fc?.invalid;
  const resolvedPlaceholder = placeholder || l.select_period;

  const isEmpty = selected.year === null || selected.month === null;
  const isIncomplete =
    (selected.year === null && selected.month !== null) ||
    (selected.year !== null && selected.month === null);

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
    if (!isEmpty) {
      onChange?.({ month: selected.month, year: selected.year });
    } else {
      onChange?.(null);
    }
    back();
  };

  return (
    <>
      <Tooltip
        content={
          !isEmpty
            ? formatDate(new Date(selected.year!, selected.month!), l, {
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
              {formatDate(new Date(inputValue.year!, inputValue.month!), l, {
                variant: "monthYear",
                timezoneKey: getLocalTimezone().key,
              })}
            </P>
          )}

          {withIcon && (
            <Icon boxSize={BASE_ICON_BOX_SIZE} color={"fg.subtle"} mr={-1}>
              <LucideIcon icon={CalendarClockIcon} />
            </Icon>
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
            <FieldsetRoot>
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
                  variant={"outline"}
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
                  {monthNames.map((month, idx) => {
                    const isActive = selected.month === idx;

                    return (
                      <Btn
                        key={month}
                        clicky={false}
                        variant={"outline"}
                        onClick={() =>
                          setSelected((prev) => ({ ...prev, month: idx }))
                        }
                        color={isActive ? "" : "fg.muted"}
                      >
                        <HStack w={"full"} justify={"space-between"}>
                          {month}

                          {isActive && (
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
            </FieldsetRoot>
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
              disabled={(required && isEmpty) || isIncomplete}
            >
              {l.confirm}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
