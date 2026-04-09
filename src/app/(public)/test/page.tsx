"use client";

import { ColorModeButton } from "@/components/ui/color-mode";
import { P, TNum } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { TopBar, View } from "@/components/widgets/view";

export default function Page() {
  // Data nested array 3x3
  const numberMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  return (
    <View.Root minH={"100svh"} gap={6} p={4}>
      <ColorModeButton />
      <TopBar />

      <StackV gap={2}>
        <P fontWeight="bold" fontSize="sm" color="gray.500">
          Normal (Non-Tabular)
        </P>
        {numberMatrix.map((row, index) => (
          <P key={`normal-${index}`} fontSize={"3xl"}>
            {row.join("")}
          </P>
        ))}
      </StackV>

      <StackV gap={2}>
        <P fontWeight="bold" fontSize="sm" color="gray.500">
          TNum (Tabular & No Shoes)
        </P>
        {numberMatrix.map((row, index) => (
          <P key={`tnum-${index}`} fontSize={"3xl"}>
            <TNum>{row.join("")}</TNum>
          </P>
        ))}
      </StackV>
    </View.Root>
  );
}
