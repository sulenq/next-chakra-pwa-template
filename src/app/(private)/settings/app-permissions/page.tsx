"use client";

import { CameraSection } from "@/features/settings/app-permission/sections/camera.section";
import { LocationSection } from "@/features/settings/app-permission/sections/location.section";
import { MicrophoneSection } from "@/features/settings/app-permission/sections/mic.section";
import { SettingsSavedLocalyHelperText } from "@/components/ui/helper-text";
import { StackV } from "@/components/ui/stack";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={2}>
      <CameraSection />

      <MicrophoneSection />

      <LocationSection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
