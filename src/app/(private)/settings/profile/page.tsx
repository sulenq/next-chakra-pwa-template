"use client";

import { StackV } from "@/components/ui/stack";
import { ActivityLogSection } from "@/features/settings/profile/sections/activity-log.section";
import { AuthLogSection } from "@/features/settings/profile/sections/auth-log.section";
import { PersonalInformationSection } from "@/features/settings/profile/sections/personal-information.section";

// -----------------------------------------------------------------

export default function SettingsProfilePage() {
  return (
    <StackV gap={4}>
      <PersonalInformationSection />

      <AuthLogSection />

      <ActivityLogSection />
    </StackV>
  );
}
