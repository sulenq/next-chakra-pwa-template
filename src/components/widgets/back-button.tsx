import { back } from "@/utils/client";
import { Icon } from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Btn, BtnProps } from "@/components/ui/btn";

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
  const router = useRouter();
  router.prefetch(backPath || "");

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
        rounded={"full"}
        onClick={handleBack}
        size={"xs"}
        {...props}
      >
        <Icon boxSize={5}>
          <IconArrowLeft stroke={1.5} />
        </Icon>
      </Btn>
    );

  return (
    <Btn variant={"outline"} onClick={handleBack} {...props}>
      {children || "Close"}
    </Btn>
  );
};
