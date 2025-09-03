import back from "@/utils/back";
import { ButtonProps, Icon } from "@chakra-ui/react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Btn } from "../ui/btn";

interface Props extends ButtonProps {
  children?: any;
  iconButton?: boolean;
  backPath?: string;
  aoc?: () => void;
}

const BackButton = ({
  children,
  iconButton = false,
  backPath,
  aoc,
  ...props
}: Props) => {
  const router = useRouter();

  function handleBack() {
    if (backPath) {
      router.push(backPath);
    } else {
      back();
    }
    aoc?.();
  }

  if (iconButton)
    return (
      <Btn
        iconButton
        variant={"ghost"}
        borderRadius={"full"}
        onClick={handleBack}
        size={"xs"}
        {...props}
      >
        <Icon fontSize={"lg"}>
          <IconChevronLeft />
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
