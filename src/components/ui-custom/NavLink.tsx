import { StackProps } from "@chakra-ui/react";
import CContainer from "../ui-custom/CContainer";
import { useRouter } from "next/navigation";
import { forwardRef } from "react";

interface Props extends StackProps {
  to?: string;
}

const NavLink = forwardRef<HTMLDivElement, Props>((props, ref) => {
  // Props
  const { children, to, ...restProps } = props;

  // Utils
  const router = useRouter();
  function handleOnClick() {
    if (to) {
      router.push(to);
    }
  }

  return (
    <CContainer
      ref={ref}
      cursor={"pointer"}
      onClick={handleOnClick}
      {...restProps}
    >
      {children}
    </CContainer>
  );
});

export default NavLink;
