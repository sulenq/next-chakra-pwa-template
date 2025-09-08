import { CContainer } from "@/components/ui/c-container";
import { Props__DataTable } from "@/constants/props";

export const DataTable = (props: Props__DataTable) => {
  // Props
  const { ...restProps } = props;

  return <CContainer className="scrollX scrollY" {...restProps}></CContainer>;
};
