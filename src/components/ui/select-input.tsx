import { Btn } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import { P } from "@/components/ui/p";
import { Props__SelectInput } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { isEmptyArray } from "@/utils/array";
import { capitalizeWords } from "@/utils/string";
import { HStack, Icon, useDisclosure, useFieldContext } from "@chakra-ui/react";
import { IconCaretDownFilled } from "@tabler/icons-react";

// id?: string;
// title?: string;
// inputValue?: Interface__SelectOption[] | undefined;
// onConfirm?: (inputValue: Props__SelectInput["inputValue"]) => void;
// selectOptions?: Interface__SelectOption[] | undefined | null;
// placeholder?: string;
// invalid?: boolean;
// required?: boolean;
// multiple?: boolean;
// disclosureSize?: Type__DisclosureSizes;
// fetch?: (
//   setOptions: Dispatch<
//     SetStateAction<Interface__SelectOption[] | null | undefined>
//   >
// ) => void;

export const SelectInput = (props: Props__SelectInput) => {
  // Props
  const {
    id,
    title = "",
    inputValue,
    onConfirm,
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
  const resolvedPlaceholder = placeholder || `${l.select} ${title}`;
  const formattedButtonLabel =
    inputValue && inputValue?.length > 0
      ? inputValue.map((o) => o.label).join(", ")
      : resolvedPlaceholder;

  return (
    <>
      <Btn
        w={"full"}
        size={"md"}
        clicky={false}
        variant={"outline"}
        justifyContent={"start"}
        borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
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

      <DisclosureRoot open={open} lazyLoad>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capitalizeWords(`${l.select} ${title}`)}
            />
          </DisclosureHeader>

          <DisclosureBody>Select</DisclosureBody>

          <DisclosureFooter>
            <Btn colorPalette={themeConfig.colorPalette}>{l.confirm}</Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
