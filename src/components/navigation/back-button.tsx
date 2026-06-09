import { Btn, BtnProps } from "@/components/ui/btn";
import { back } from "@/utils/client";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppIconLucide } from "../branding/app-icon";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";

// -----------------------------------------------------------------

interface BackButtonProps extends BtnProps {
  children?: any;
  iconButton?: boolean;
  backPath?: string;
  onBack?: () => void;
}

export const BackButton = ({
  children,
  iconButton = false,
  backPath,
  onBack,
  ...props
}: BackButtonProps) => {
  // Store
  const { theme } = useThemeStore();

  // Hooks
  const router = useRouter();
  router.prefetch(backPath || "");

  // Utils
  function handleBack() {
    if (backPath) {
      router.push(backPath);
    } else {
      back();
    }
    onBack?.();
  }

  if (iconButton)
    return (
      <Btn
        iconButton
        variant={"ghost"}
        rounded={theme.radii.component}
        onClick={handleBack}
        size={"xs"}
        {...props}
      >
        <AppIconLucide icon={ChevronLeftIcon} />
      </Btn>
    );

  return (
    <Btn variant={"outline"} onClick={handleBack} {...props}>
      {children || "Close"}
    </Btn>
  );
};
