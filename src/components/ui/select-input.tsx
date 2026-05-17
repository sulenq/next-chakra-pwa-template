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
import { AppIconLucide } from "@/components/widgets/app-icon";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
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
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface SelectOptionsProps {
  id: string;
  multiple: SelectInputProps["multiple"];
  selectOptions: SelectInputProps["inputValue"];
  selected: SelectOption[];
  setSelected: React.Dispatch<SelectOptionsProps["selected"]>;
}

const SelectOptions = (props: SelectOptionsProps) => {
  // Props
  const { id, multiple, selectOptions, selected, setSelected, ...restProps } =
    props;

  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();

  // States
  const [search, setSearch] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Derived Values
  const resolvedSelectOptions = selectOptions?.filter((o) =>
    o.label?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (selected) {
      setSelectAll(selected.length === selectOptions?.length);
    }
  }, [selected]);

  return (
    <StackV {...restProps}>
      <StackV px={4} pt={4} zIndex={3}>
        <SearchInput
          inputValue={search}
          onChange={(inputValue) => {
            setSearch(inputValue || "");
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
                    setSelected(selectOptions as any);
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
                    colorPalette={themeContext.colorPalette}
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

export interface SelectInputProps extends Omit<BtnProps, "onChange"> {
  id: string;
  title?: string;
  inputValue?: SelectOption[] | null;
  onChange?: (inputValue: SelectInputProps["inputValue"]) => void;
  loading?: boolean;
  error?: any;
  selectOptions?: SelectInputProps["inputValue"];
  placeholder?: string;
  invalid?: boolean;
  required?: boolean;
  multiple?: boolean;
  fetch?: () => void;
  disclosureSize?: DisclosureSizes;
  variant?: ButtonVariant;
}

export const SelectInput = (props: SelectInputProps) => {
  // Props
  const {
    id,
    title = "",
    inputValue,
    onChange,
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

  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId(id || "select-input"));

  // States
  const [selected, setSelected] = useState<SelectOption[]>([]);

  // Derived Values
  const resolvedPlaceholder =
    placeholder ?? (multiple ? t.select_one_or_more : t.select);
  const resolvedInvalid = invalid ?? fc?.invalid;
  const formattedButtonLabel =
    inputValue && !isEmptyArray(inputValue)
      ? inputValue.map((o) => o.label).join(", ")
      : resolvedPlaceholder;

  // Utils
  function handleConfirm() {
    if (!required) {
      if (!isEmptyArray(selected)) {
        onChange?.(selected);
      } else {
        onChange?.(null);
      }
      back();
    }
  }

  // Set initial selected on open
  useEffect(() => {
    if (inputValue && !isEmptyArray(inputValue)) {
      setSelected(inputValue);
    } else {
      setSelected([]);
    }
  }, [open]);

  return (
    <>
      <Tooltip content={formattedButtonLabel}>
        <Btn
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
          {!isEmptyArray(inputValue) && (
            <P minH={"18px"} lineClamp={1} textAlign={"left"}>
              {formattedButtonLabel}
            </P>
          )}

          {isEmptyArray(inputValue) && (
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
            icon={ChevronDownIcon}
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
              colorPalette={themeContext.colorPalette}
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
};
