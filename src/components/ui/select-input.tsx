import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CSpinner } from "@/components/ui/c-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclosure } from "@/components/ui/disclosure";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { DotIndicator } from "@/components/widgets/indicator";
import { Interface__SelectOption } from "@/constants/interfaces";
import { ButtonVariant, DisclosureSizes } from "@/constants/types";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { capitalizeWords } from "@/utils/string";
import { Box, HStack, Icon, useFieldContext } from "@chakra-ui/react";
import { IconReload } from "@tabler/icons-react";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

export interface SelectOptionsProps {
  id: string;
  multiple: SelectInputProps["multiple"];
  selectOptions: SelectInputProps["inputValue"];
  selected: Interface__SelectOption[];
  setSelected: React.Dispatch<SelectOptionsProps["selected"]>;
}

const SelectOptions = (props: SelectOptionsProps) => {
  // Props
  const { id, multiple, selectOptions, selected, setSelected, ...restProps } =
    props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // States
  const [search, setSearch] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const resolvedSelectOptions = selectOptions?.filter((o) =>
    o.label?.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (selected) {
      setSelectAll(selected.length === selectOptions?.length);
    }
  }, [selected]);

  return (
    <CContainer {...restProps}>
      <CContainer px={4} pt={4} pos={"sticky"} top={0} zIndex={3}>
        <SearchInput
          inputValue={search}
          onChange={(inputValue) => {
            setSearch(inputValue || "");
          }}
          queryKey={`q_${id}`}
        />
      </CContainer>

      {search && isEmptyArray(resolvedSelectOptions) && (
        <FeedbackNotFound minH={"250px"} />
      )}

      {!search && isEmptyArray(resolvedSelectOptions) && (
        <FeedbackNoData minH={"250px"} />
      )}

      {!isEmptyArray(resolvedSelectOptions) && (
        <>
          {multiple && (
            <CContainer px={4} pt={4} zIndex={2}>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!selectAll) {
                    setSelected(selectOptions as any);
                  } else {
                    setSelected([]);
                  }
                }}
                w={"fit-content"}
              >
                <Checkbox
                  onChange={(e: any) => {
                    setSelectAll(e.target.checked);
                    e.stopPropagation();
                  }}
                  checked={selectAll}
                  invalid={false}
                  size={"md"}
                  colorPalette={themeConfig.colorPalette}
                >
                  <P>{t.select_all}</P>
                </Checkbox>
              </Box>
            </CContainer>
          )}

          <CContainer p={4} gap={2}>
            {resolvedSelectOptions?.map((o) => {
              const isSelected = selected?.some((s) => s.id === o.id);

              return (
                <Btn
                  key={o.id}
                  clicky={false}
                  variant={"ghost"}
                  justifyContent={"start"}
                  size={"md"}
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
                  <HStack w={"full"} justify={"space-between"}>
                    <P textAlign={"left"}>{o.label}</P>

                    {isSelected && <DotIndicator />}

                    {!isSelected && multiple && (
                      <DotIndicator bg={"bg.emphasized"} />
                    )}
                  </HStack>
                </Btn>
              );
            })}
          </CContainer>
        </>
      )}
    </CContainer>
  );
};

// -----------------------------------------------------------------

export interface SelectInputProps extends Omit<BtnProps, "onChange"> {
  id: string;
  title?: string;
  inputValue?: Interface__SelectOption[] | null;
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
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId(id || "select-input"));

  // States
  const [selected, setSelected] = useState<Interface__SelectOption[]>([]);

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
          gap={4}
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
            <P lineClamp={1} textAlign={"left"}>
              {formattedButtonLabel}
            </P>
          )}

          {isEmptyArray(inputValue) && (
            <P color={"placeholder"} lineClamp={1} textAlign={"left"}>
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
            <Disclosure.HeaderContent
              title={capitalizeWords(`${t.select} ${title}`)}
            >
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

          <Disclosure.Body p={0} overflowY={"auto"} className={"noScroll"}>
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
              colorPalette={themeConfig.colorPalette}
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
