import { Btn, BtnProps } from "@/components/ui/btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui/disclosure";
import { DisclosureHeaderContent } from "@/components/ui/disclosure-header-content";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { capitalizeWords } from "@/utils/string";
import { useDisclosure } from "@chakra-ui/react";

interface Props extends BtnProps {}

export const SelectInput = (props: Props) => {
  // Props
  const { id, title, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(id || "select-input", open, onOpen, onClose);

  return (
    <>
      <Btn clicky={false} {...restProps}></Btn>

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
