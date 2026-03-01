import { back } from "@/utils/client";
import { Icon } from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Btn, Props__Btn } from "../ui/btn";

interface Props extends Props__Btn {
  children?: any;
  iconButton?: boolean;
  backPath?: string;
  onBack?: () => void;
}

const BackButton = ({
  children,
  iconButton = false,
  backPath,
  onBack,
  ...props
}: Props) => {
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

export default BackButton;
