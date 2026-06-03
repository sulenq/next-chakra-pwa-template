"use client";

import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { StackH, StackV } from "@/components/ui/stack";
import { MainView, TopBar } from "@/components/container/main-view";
import { PdfViewer } from "@/components/media/pdf-viewer";

export default function Page() {
  return (
    <MainView.Root minH={"100svh"} gap={6} p={4}>
      <StackH>
        <ColorModeButton />
        <LangMenu />
      </StackH>

      <TopBar />

      <StackV gap={2} h={"100dvh"}>
        <PdfViewer
          fileUrl={
            "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
          }
        />
      </StackV>
    </MainView.Root>
  );
}
