"use client";

import { useLayananQuery } from "../hooks/use-layanan";
import { useLocale } from "@/contexts/use-locale-context";
import {
  HStack,
  StackProps,
  Box,
  Center,
  Spinner,
  Grid,
} from "@chakra-ui/react";
import { StackV } from "@/components/ui/stack";
import { P } from "@/components/ui/p";
import { LayananUpdate } from "./layanan.update";
import { LayananDelete } from "./layanan.delete";

interface Props extends StackProps {}

export const LayananDataList = (props: Props) => {
  const { ...restProps } = props;
  const { data, isLoading, isError } = useLayananQuery();
  const { locale } = useLocale();

  if (isLoading)
    return (
      <Center p={10}>
        <Spinner />
      </Center>
    );
  if (isError)
    return (
      <Center p={10}>
        <P color="red.500">{"Error loading data"}</P>
      </Center>
    );

  const items = data?.data || [];

  return (
    <Box {...restProps}>
      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr" }}
        gap={4}
      >
        {items.map((item) => (
          <HStack
            key={item.id}
            p={4}
            borderWidth="1px"
            borderRadius="md"
            align="flex-start"
            justify="space-between"
            bg="bg.panel"
          >
            <HStack align="flex-start" gap={4}>
              <Box boxSize="60px" flexShrink={0}>
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.title?.[locale]}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Box>
              <StackV gap={1}>
                <P fontWeight="bold" fontSize="lg">
                  {item.title?.[locale]}
                </P>
                <P color="fg.muted" fontSize="sm">
                  {item.description?.[locale]}
                </P>
              </StackV>
            </HStack>
            <HStack gap={2}>
              <LayananUpdate item={item} />
              <LayananDelete ids={[item.id]} />
            </HStack>
          </HStack>
        ))}
      </Grid>
      {items.length === 0 && (
        <Center p={10}>
          <P>No Data</P>
        </Center>
      )}
    </Box>
  );
};
