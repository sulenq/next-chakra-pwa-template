"use client";

import { SettingsSavedLocalyAlert } from "@/components/alert/alert.static";
import { StackV } from "@/components/ui/stack";
import { SECTION_GAP } from "@/constants/styles";
import { CameraSection } from "@/features/settings/app-permission/sections/camera.section";
import { LocationSection } from "@/features/settings/app-permission/sections/location.section";
import { MicrophoneSection } from "@/features/settings/app-permission/sections/mic.section";

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <CameraSection />

      <MicrophoneSection />

      <LocationSection />

      <SettingsSavedLocalyAlert />
    </StackV>
  );
}
