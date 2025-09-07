import { useThemeConfig } from "@/context/useThemeConfig";
import {
  Select as ChakraSelect,
  Portal,
  SelectRootProps,
  createListCollection,
} from "@chakra-ui/react";

type SelectOption = {
  label: string;
  value: string;
};

interface Props__Select
  extends Omit<SelectRootProps, "value" | "onValueChange" | "collection"> {
  inputValue: string;
  onValueChange: (value: string) => void;
  selectOptions: SelectOption[];
  placeholder?: string;
  width?: string | number;
  size?: "xs" | "sm" | "md" | "lg";
}

export default function Select(props: Props__Select) {
  // Props
  const {
    inputValue,
    onValueChange,
    selectOptions,
    placeholder = "Select option",
    width = "150px",
    size = "sm",
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const collection = createListCollection({
    items: selectOptions,
    itemToString: (item) => item.label,
    itemToValue: (item) => item.value,
  });

  return (
    <ChakraSelect.Root
      collection={collection}
      width={width}
      size={size}
      value={[inputValue]}
      onValueChange={(e) => {
        if (e.value[0]) {
          onValueChange(e.value[0]);
        }
      }}
      {...restProps}
    >
      <ChakraSelect.HiddenSelect />

      <ChakraSelect.Control>
        <ChakraSelect.Trigger
          border="none"
          cursor="pointer"
          _hover={{ bg: "d2" }}
        >
          <ChakraSelect.ValueText placeholder={placeholder} />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator color={props?.color} />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>

      <Portal>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content
            className="ss"
            rounded={themeConfig?.radii.container}
          >
            {collection.items.map((opt) => (
              <ChakraSelect.Item
                item={opt}
                key={opt.value}
                rounded={themeConfig?.radii.component}
              >
                {opt.label}
                <ChakraSelect.ItemIndicator />
              </ChakraSelect.Item>
            ))}
          </ChakraSelect.Content>
        </ChakraSelect.Positioner>
      </Portal>
    </ChakraSelect.Root>
  );
}
