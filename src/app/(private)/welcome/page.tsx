"use client";

import { Logo } from "@/components/branding/logo";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { pluckString } from "@/utils/string";

export default function Page() {
  // Store
  const { t } = useLocaleStore();

  // States
  const variantNumber = Math.floor(Math.random() * 16) + 1;

  return (
    <StackV flex={1} gap={1} justify={"center"}>
      <StackV align={"center"} my={"auto"}>
        <StackV align={"center"} gap={4}>
          <Logo size={32} />

          <P fontSize={"xl"} fontWeight={"medium"} textAlign={"center"}>
            {pluckString(t, `msg_welcome_${variantNumber}`)}
          </P>
        </StackV>
      </StackV>
    </StackV>
  );
}
