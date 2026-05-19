"use client";

import { SettingsSavedLocalyHelperText } from "@/components/ui/helper-text";
import { StackV } from "@/components/ui/stack";
import { SECTION_GAP } from "@/constants/styles";
import { AccentColorSection } from "@/features/settings/display/sections/acccent-color.section";
import { ColorModeSection } from "@/features/settings/display/sections/color-mode.section";
import { RoundedSection } from "@/features/settings/display/sections/rounding-radius.section";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <ColorModeSection />

      <AccentColorSection />

      <RoundedSection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
