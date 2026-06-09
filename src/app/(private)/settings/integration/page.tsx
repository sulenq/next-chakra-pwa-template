"use client";

import { StackV } from "@/components/ui/stack";
import { SECTION_GAP } from "@/constants/styles";
import { APIKeySection } from "@/features/settings/views/integration/sections/api-key.section";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <APIKeySection />
    </StackV>
  );
}
