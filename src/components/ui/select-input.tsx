"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { CSpinner } from "@/components/ui/c-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclosure } from "@/components/ui/disclosure";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { SearchInput } from "@/components/ui/search-input";
import { StackH, StackV } from "@/components/ui/stack";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/branding/app-icon";
import FeedbackNoData from "@/components/feedback/feedback-no-data";
import FeedbackNotFound from "@/components/feedback/feedback-not-found";
import FeedbackRetry from "@/components/feedback/feedback-retry";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import {
  ButtonVariant,
  DisclosureSizes,
  SelectOption,
} from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { Icon, useFieldContext } from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState, forwardRef } from "react";

// -----------------------------------------------------------------

export interface SelectOptionsProps {
  id: string;
  multiple: SelectInputProps["multiple"];
  selectOptions: SelectInputProps["value"];
  selected: SelectOption[];
  setSelected: React.Dispatch<SelectOptionsProps["selected"]>;
}

const SelectOptions = (props: SelectOptionsProps) => {
  // Props
  const { id, multiple, selectOptions, selected, setSelected, ...restProps } =
    props;

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // States
  const [search, setSearch] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Derived Values
  const resolvedSelectOptions = selectOptions?.filter((o) =>
    o.label?.toLowerCase().includes(search.toLowerCase()),
  );

  // Select all toggle effect
  useEffect(() => {
    if (selected) {
      setSelectAll(selected.length === selectOptions?.length);
    }
  }, [selected]);

  return (
    <StackV {...restProps}>
      <StackV px={4} pt={4} zIndex={3}>
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value || "");
          }}
          queryKey={`q_${id}`}
        />
      </StackV>

      {search && isEmptyArray(resolvedSelectOptions) && (
        <FeedbackNotFound minH={"250px"} />
      )}

      {!search && isEmptyArray(resolvedSelectOptions) && (
        <FeedbackNoData minH={"250px"} />
      )}

      {!isEmptyArray(resolvedSelectOptions) && (
        <>
          {multiple && (
            <StackV px={4} pt={4} zIndex={2}>
              <Btn
                clicky={false}
                variant={"ghost"}
                size={"md"}
                pl={3}
                mb={-2}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!selectAll) {
                    setSelected(selectOptions || []);
                  } else {
                    setSelected([]);
                  }
                }}
              >
                <StackH gap={3} w={"full"}>
                  <Checkbox
                    onChange={(e: any) => {
                      setSelectAll(e.target.checked);
                      e.stopPropagation();
                    }}
                    checked={selectAll}
                    invalid={false}
                    size={"sm"}
                    colorPalette={theme.colorPalette}
                  />

                  <P color={"fg.muted"}>{t.select_all}</P>
                </StackH>
              </Btn>
            </StackV>
          )}

          <StackV p={4} gap={2}>
            {resolvedSelectOptions?.map((o) => {
              const isSelected = selected?.some((s) => s.id === o.id);

              return (
                <Btn
                  key={o.id}
                  clicky={false}
                  variant={"ghost"}
                  justifyContent={"start"}
                  size={"md"}
                  pl={3}
                  color={isSelected ? "" : "fg.muted"}
                  onClick={() => {
                    if (!multiple) {
                      setSelected([o]);
                    } else {
                      const exists = selected.some((item) => item.id === o.id);
                      if (exists) {
                        // remove o
                        setSelected(
                          selected.filter((item) => item.id !== o.id),
                        );
                      } else {
                        // add o
                        setSelected([...selected, o]);
                      }
                    }
                  }}
                >
                  <StackH align={"center"} gap={3} w={"full"}>
                    <RadioItem checked={isSelected} />

                    <P textAlign={"left"}>{o.label}</P>
                  </StackH>
                </Btn>
              );
            })}
          </StackV>
        </>
      )}
    </StackV>
  );
};

// -----------------------------------------------------------------

export interface SelectInputProps extends Omit<
  BtnProps,
  "onChange" | "defaultValue" | "value"
> {
  id: string;
  title?: string;
  value?: SelectOption[] | null;
  defaultValue?: SelectOption[] | null;
  onChange?: (value: SelectInputProps["value"]) => void;
  onOpenChange?: (isOpen: boolean) => void;
  loading?: boolean;
  error?: any;
  selectOptions?: SelectInputProps["value"];
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  multiple?: boolean;
  fetch?: () => void;
  disclosureSize?: DisclosureSizes;
  variant?: ButtonVariant;
}

export const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>(
  function SelectInput(props, ref) {
    // Props
    const {
      id,
      title = "",
      value,
      defaultValue,
      onChange,
      onOpenChange,
      loading,
      error,
      selectOptions,
      placeholder,
      invalid,
      required,
      multiple,
      disclosureSize = "xs",
      fetch,
      variant = "outline",
      ...restProps
    } = props;

    // Stores
    const { t } = useLocaleStore();
    const { theme } = useThemeStore();
    const fc = useFieldContext();

    // Hooks
    const { open, onOpen } = usePopDisclosure(
      disclosureId(id || "select-input"),
    );
    useEffect(() => {
      onOpenChange?.(open);
    }, [open, onOpenChange]);

    // States
    const [selected, setSelected] = useState<SelectOption[]>([]);
    const [internalValue, setInternalValue] = useState<SelectOption[] | null>(
      defaultValue ?? null,
    );

    // Hybrid: detect controlled mode
    const isControlled = value !== undefined;
    const displayValue = isControlled ? value : internalValue;

    // Derived Values
    const resolvedPlaceholder =
      placeholder ?? (multiple ? t.select_one_or_more : t.select);
    const resolvedInvalid = invalid ?? fc?.invalid;
    const formattedButtonLabel =
      displayValue && !isEmptyArray(displayValue)
        ? displayValue.map((o) => o.label).join(", ")
        : resolvedPlaceholder;

    // Utils
    function handleConfirm() {
      if (!required) {
        const finalValue = !isEmptyArray(selected) ? selected : null;
        if (!isControlled) setInternalValue(finalValue);
        onChange?.(finalValue);
        back();
      }
    }

    // Set initial selected on open
    useEffect(() => {
      if (displayValue && !isEmptyArray(displayValue)) {
        setSelected(displayValue);
      } else {
        setSelected([]);
      }
    }, [open, displayValue]);

    return (
      <>
        <Tooltip content={formattedButtonLabel}>
          <Btn
            ref={ref}
            w={"full"}
            gap={2}
            justifyContent={"space-between"}
            variant={variant}
            borderColor={
              resolvedInvalid
                ? "border.error"
                : variant === "subtle"
                  ? "transparent"
                  : "border.muted"
            }
            onClick={onOpen}
            {...restProps}
          >
            {!isEmptyArray(displayValue) && (
              <P minH={"18px"} lineClamp={1} textAlign={"left"}>
                {formattedButtonLabel}
              </P>
            )}

            {isEmptyArray(displayValue) && (
              <P
                minH={"18px"}
                color={"placeholder"}
                lineClamp={1}
                textAlign={"left"}
              >
                {resolvedPlaceholder}
              </P>
            )}

            <AppIconLucide
              icon={ChevronsUpDownIcon}
              color={"fg.subtle"}
              mr={"-2px"}
            />
          </Btn>
        </Tooltip>

        <Disclosure.Root open={open} lazyLoad size={disclosureSize}>
          <Disclosure.Content>
            <Disclosure.Header>
              <Disclosure.HeaderContent title={capitalizeWords(title)}>
                {fetch && (
                  <Btn
                    iconButton
                    size={["sm", null, "2xs"]}
                    rounded={"full"}
                    variant={["ghost", null, "subtle"]}
                    pos={"absolute"}
                    right={[12, null, 11]}
                    disabled={loading}
                    onClick={fetch}
                  >
                    <Icon boxSize={4}>
                      <IconReload stroke={1.5} />
                    </Icon>
                  </Btn>
                )}
              </Disclosure.HeaderContent>
            </Disclosure.Header>

            <Disclosure.Body className={"scrollY"} p={0} overflowY={"auto"}>
              {loading && <CSpinner />}

              {!loading && (
                <>
                  {error && <FeedbackRetry onRetry={fetch} minH={"250px"} />}

                  {!error && (
                    <SelectOptions
                      id={id}
                      multiple={multiple}
                      selectOptions={selectOptions}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  )}
                </>
              )}
            </Disclosure.Body>

            <Disclosure.Footer>
              <Btn
                variant={"outline"}
                onClick={() => {
                  setSelected([]);
                }}
              >
                Clear
              </Btn>
              <Btn
                colorPalette={theme.colorPalette}
                disabled={required && isEmptyArray(selected)}
                onClick={handleConfirm}
              >
                {t.confirm}
              </Btn>
            </Disclosure.Footer>
          </Disclosure.Content>
        </Disclosure.Root>
      </>
    );
  },
);
