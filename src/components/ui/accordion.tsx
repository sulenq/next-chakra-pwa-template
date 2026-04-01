"use client";

import { Accordion as ChakraAccordion, HStack } from "@chakra-ui/react";
import { forwardRef } from "react";
import { LuChevronDown } from "react-icons/lu";

// -----------------------------------------------------------------

interface AccordionItemTriggerProps extends ChakraAccordion.ItemTriggerProps {
  indicatorPlacement?: "start" | "end" | "none";
}

const AccordionItemTrigger = forwardRef<
  HTMLButtonElement,
  AccordionItemTriggerProps
>(function AccordionItemTrigger(props, ref) {
  const { children, indicatorPlacement = "end", ...rest } = props;
  return (
    <ChakraAccordion.ItemTrigger {...rest} ref={ref}>
      {indicatorPlacement === "start" && (
        <ChakraAccordion.ItemIndicator
          rotate={{ base: "-90deg", _open: "0deg" }}
        >
          <LuChevronDown />
        </ChakraAccordion.ItemIndicator>
      )}

      <HStack gap={"4"} flex={"1"} textAlign={"start"} width={"full"}>
        {children}
      </HStack>

      {indicatorPlacement === "end" && (
        <ChakraAccordion.ItemIndicator>
          <LuChevronDown />
        </ChakraAccordion.ItemIndicator>
      )}
    </ChakraAccordion.ItemTrigger>
  );
});

// -----------------------------------------------------------------

interface AccordionItemContentProps extends ChakraAccordion.ItemContentProps {}

const AccordionItemContent = forwardRef<
  HTMLDivElement,
  AccordionItemContentProps
>(function AccordionItemContent(props, ref) {
  return (
    <ChakraAccordion.ItemContent rounded={"0 !important"}>
      <ChakraAccordion.ItemBody {...props} ref={ref} />
    </ChakraAccordion.ItemContent>
  );
});

// -----------------------------------------------------------------

const AccordionRoot = ChakraAccordion.Root;

// -----------------------------------------------------------------

const AccordionItem = ChakraAccordion.Item;

// -----------------------------------------------------------------

const AccordionItemIndicator = ChakraAccordion.ItemIndicator;

// -----------------------------------------------------------------

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  ItemTrigger: AccordionItemTrigger,
  ItemIndicator: AccordionItemIndicator,
  ItemContent: AccordionItemContent,
};
