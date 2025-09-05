import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CSpinner } from "@/components/ui/c-spinner";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput, Props__SelectOptions } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { isEmptyArray } from "@/utils/array";
import { back } from "@/utils/client";
import { capitalizeWords } from "@/utils/string";
import { HStack, Icon, useDisclosure, useFieldContext } from "@chakra-ui/react";
import { IconCaretDownFilled, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const SelectOptions = (props: Props__SelectOptions) => {
  // Props
  const {
    multiple,
    loading,
    selectOptions,
    selected,
    setSelected,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer gap={2} {...restProps}>
      {loading && <CSpinner />}

      {!loading && (
        <>
          {selectOptions?.map((o) => {
            const isActive = selected?.some((s) => s.id === o.id);

            return (
              <Btn
                key={o.id}
                clicky={false}
                variant={"outline"}
                justifyContent={"start"}
                onClick={() => {
                  if (!multiple) {
                    setSelected([o]);
                  } else {
                    setSelected([...selected, o]);
                  }
                }}
              >
                <HStack w={"full"} align={"start"} justify={"space-between"}>
                  <P textAlign={"left"}>{o.label}</P>

                  {isActive && (
                    <Icon color={themeConfig.primaryColor} boxSize={5}>
                      <IconCheck />
                    </Icon>
                  )}
                </HStack>
              </Btn>
            );
          })}
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
  const resolvedPlaceholder = placeholder || `${l.select} ${title}`;
  const formattedButtonLabel =
    inputValue && inputValue?.length > 0
      ? inputValue.map((o) => o.label).join(", ")
      : resolvedPlaceholder;

  // Utils
  function onConfirmSelected() {
    if (!required || !isEmptyArray(selected)) {
      onConfirm?.(selected);
      back();
    }
  }

  // set selected on open
  useEffect(() => {
    if (inputValue) {
      setSelected(inputValue);
    }
  }, [open]);

  return (
    <>
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

          <Icon color={"fg.subtle"} flexShrink={0} boxSize={4} mr={"3px"}>
            <IconCaretDownFilled stroke={1.5} />
          </Icon>
        </HStack>
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(`${l.select} ${title}`)}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <SelectOptions
              multiple={multiple}
              loading={loading}
              selectOptions={selectOptions}
              selected={selected}
              setSelected={setSelected}
            />
          </DisclosureBody>

          <DisclosureFooter>
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
