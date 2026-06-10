"use client";

import { Logo } from "@/components/branding/logo";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { TOP_BAR_H } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";

export default function Page() {
  // Stores
  const { t } = useLocaleStore();

  return (
    <StackV flex={1} justify={"center"} gap={1} mb={TOP_BAR_H}>
      <StackV align={"center"} my={"auto"}>
        <StackV align={"center"} gap={6}>
          <Logo size={42} />

          <P fontSize={"2xl"} fontWeight={"medium"} textAlign={"center"}>
            {t.msg_welcome}
          </P>
        </StackV>
      </StackV>
    </StackV>
  );
}
