"use client";

import { SettingsSavedLocalyAlert } from "@/components/alert/alert.static";
import { StackV } from "@/components/ui/stack";
import { SECTION_GAP } from "@/constants/styles";
import { AccentColorSection } from "@/features/settings/appearance/sections/acccent-color.section";
import { ColorModeSection } from "@/features/settings/appearance/sections/color-mode.section";
import { ConstrainedContainerSection } from "@/features/settings/appearance/sections/constrained-contianer.section";
import { RoundedSection } from "@/features/settings/appearance/sections/rounding-radius.section";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <ColorModeSection />

      <AccentColorSection />

      <ConstrainedContainerSection />

      <RoundedSection />

      <SettingsSavedLocalyAlert />
    </StackV>
  );
}
