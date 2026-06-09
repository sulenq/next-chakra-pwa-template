import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import {
  Select as ChakraSelect,
  Portal,
  SelectRootProps,
  createListCollection,
} from "@chakra-ui/react";

// -----------------------------------------------------------------

type SelectOption = {
  label: string;
  value: string;
};

interface SelectProps extends Omit<
  SelectRootProps,
  "value" | "onValueChange" | "collection"
> {
  value: string;
  onValueChange: (value: string) => void;
  selectOptions: SelectOption[];
  placeholder?: string;
  width?: string | number;
  size?: "xs" | "sm" | "md" | "lg";
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

export default function Select(props: SelectProps) {
  // Props
  const {
    value,
    onValueChange,
    selectOptions,
    placeholder = "Select option",
    width = "150px",
    size = "sm",
    portalled = true,
    portalRef,
    ...restProps
  } = props;

  // Stores
  const { theme } = useThemeStore();

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
      value={[value]}
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
          border={"none"}
          cursor={"pointer"}
          _hover={props?._hover || { bg: "bg.emphasized" }}
        >
          <ChakraSelect.ValueText
            fontSize={props?.fontSize}
            placeholder={placeholder}
          />
        </ChakraSelect.Trigger>
        <ChakraSelect.IndicatorGroup>
          <ChakraSelect.Indicator boxSize={5} color={props?.color} />
        </ChakraSelect.IndicatorGroup>
      </ChakraSelect.Control>

      <Portal container={portalRef} disabled={!portalled}>
        <ChakraSelect.Positioner>
          <ChakraSelect.Content
            rounded={theme?.radii.container}
            minW={"80px"}
            shadow={"soft"}
          >
            {collection.items.map((opt) => (
              <ChakraSelect.Item
                item={opt}
                key={opt.value}
                rounded={theme?.radii.component}
                color={"fg.ibody"}
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
