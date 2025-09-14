import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CSpinner } from "@/components/ui/c-spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { DotIndicator } from "@/components/widget/Indicator";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput, Props__SelectOptions } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { capitalizeWords } from "@/utils/string";
import {
  Box,
  HStack,
  Icon,
  useDisclosure,
  useFieldContext,
} from "@chakra-ui/react";
import { IconCaretDownFilled, IconReload } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const SelectOptions = (props: Props__SelectOptions) => {
  // Props
  const { multiple, selectOptions, selected, setSelected, ...restProps } =
    props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [search, setSearch] = useState<string>("");
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const resolvedSelectOptions = selectOptions?.filter((o) =>
    o.label?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (selected) {
      setSelectAll(selected.length === selectOptions?.length);
    }
  }, [selected]);

  return (
    <CContainer {...restProps}>
      <CContainer px={4} pt={2} pos={"sticky"} top={0} bg={"body"} zIndex={2}>
        <SearchInput
          inputValue={search}
          onChange={(inputValue) => {
            setSearch(inputValue || "");
          }}
          inputProps={{
            variant: "flushed",
            rounded: 0,
          }}
        />
      </CContainer>

      {isEmptyArray(resolvedSelectOptions) && <FeedbackNoData minH={"250px"} />}

      {!isEmptyArray(resolvedSelectOptions) && (
        <>
          {multiple && (
            <CContainer px={7} pt={4} zIndex={3}>
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
                  name="select_all"
                  onChange={(e: any) => {
                    setSelectAll(e.target.checked);
                    e.stopPropagation();
                  }}
                  checked={selectAll}
                  invalid={false}
                  size={"md"}
                  colorPalette={themeConfig.colorPalette}
                >
                  <P>{l.select_all}</P>
                </Checkbox>
              </Box>
            </CContainer>
          )}

          <CContainer p={4} gap={2}>
            {resolvedSelectOptions?.map((o) => {
              const isActive = selected?.some((s) => s.id === o.id);

              return (
                <Btn
                  key={o.id}
                  clicky={false}
                  variant={"ghost"}
                  justifyContent={"start"}
                  size={"md"}
                  onClick={() => {
                    if (!multiple) {
                      setSelected([o]);
                    } else {
                      const exists = selected.some((item) => item.id === o.id);
                      if (exists) {
                        // remove o
                        setSelected(
                          selected.filter((item) => item.id !== o.id)
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

                    {isActive && <DotIndicator />}
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

export const SelectInput = (props: Props__SelectInput) => {
  // Props
  const {
    id,
    title = "",
    inputValue,
    onConfirm,
    loading,
    selectOptions,
    placeholder,
    invalid,
    required,
    multiple,
    disclosureSize = "xs",
    fetch,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || "select-input", open, onOpen, onClose);

  // States
  const [selected, setSelected] = useState<Interface__SelectOption[]>([]);
  const resolvedPlaceholder = placeholder || `${l.select}`;
  const formattedButtonLabel =
    inputValue && !isEmptyArray(inputValue)
      ? inputValue.map((o) => o.label).join(", ")
      : resolvedPlaceholder;

  // Utils
  function onConfirmSelected() {
    if (!required) {
      if (!isEmptyArray(selected)) {
        onConfirm?.(selected);
      } else {
        onConfirm?.(null);
      }
      back();
    }
  }

  // set selected on open
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
          size={"md"}
          clicky={false}
          variant={"outline"}
          justifyContent={"start"}
          borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
          onClick={onOpen}
          {...restProps}
        >
          <HStack w={"full"} justify={"space-between"}>
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

            <Icon color={"fg.subtle"} flexShrink={0} boxSize={4} mr={"-2px"}>
              <IconCaretDownFilled stroke={1.5} />
            </Icon>
          </HStack>
        </Btn>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(`${l.select} ${title}`)}
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
            </DisclosureHeaderContent>
          </DisclosureHeader>

          <DisclosureBody p={0} overflowY={"auto"} className="noScroll">
            {loading && <CSpinner />}

            {!loading && (
              <SelectOptions
                multiple={multiple}
                selectOptions={selectOptions}
                selected={selected}
                setSelected={setSelected}
              />
            )}
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
            <Btn
              colorPalette={themeConfig.colorPalette}
              disabled={required && isEmptyArray(selected)}
              onClick={onConfirmSelected}
            >
              {l.confirm}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
