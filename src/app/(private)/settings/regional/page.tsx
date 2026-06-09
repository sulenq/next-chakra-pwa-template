"use client";

import { SettingsSavedLocalyAlert } from "@/components/alert/alert.static";
import { StackV } from "@/components/ui/stack";
import { SECTION_GAP } from "@/constants/styles";
import { DateTimeSection } from "@/features/settings/regional/sections/date-time.section";
import { LanguageSection } from "@/features/settings/regional/sections/language.section";
import { UOMFormatSection } from "@/features/settings/regional/sections/uom-format.section";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <LanguageSection />

      <DateTimeSection />

      <UOMFormatSection />

      <SettingsSavedLocalyAlert />
    </StackV>
  );
}
