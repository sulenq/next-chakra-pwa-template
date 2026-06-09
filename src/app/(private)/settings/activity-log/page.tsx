"use client";

import { StackV } from "@/components/ui/stack";
import { SECTION_GAP } from "@/constants/styles";
import { ActivityLogSection } from "@/features/settings/views/profile/sections/activity-log.section";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <ActivityLogSection />
    </StackV>
  );
}
