import { Btn } from "@/components/ui/btn";
import { P } from "@/components/ui/p";
import { Props_PaginationTableData } from "@/constants/props";
import useLang from "@/context/useLang";
import { formatNumber } from "@/utils/formatter";
import { HStack, Icon } from "@chakra-ui/react";
import { IconCaretLeftFilled, IconCaretRightFilled } from "@tabler/icons-react";

export const Pagination = (props: Props_PaginationTableData) => {
  // Props
  const { page, setPage, totalPage } = props;

  // Contexts
  const { l } = useLang();

  // States
  // const [pageTemp, setPageTemp] = useState<number | null | undefined>(page);
  const isFirstPage = page === 1;
  const isLastPage = page === (totalPage || 1);

  // Utils
  function handlePrev() {
    // @ts-expect-error this is dispatch
    if (page > 1) setPage((ps) => ps! - 1);
  }
  function handleNext() {
    // @ts-expect-error this is dispatch
    if (page < (totalPage || 1)) setPage((ps) => ps! + 1);
  }

  // debounce setPage
  // useEffect(() => {
  //   if (pageTemp) setPage(pageTemp);
  // }, [pageTemp]);

  return (
    <HStack gap={2}>
      <Btn
        iconButton
        clicky={false}
        size={"xs"}
        variant={"ghost"}
        onClick={handlePrev}
        disabled={isFirstPage}
      >
        <Icon>
          <IconCaretLeftFilled />
        </Icon>
      </Btn>

      <HStack whiteSpace={"nowrap"}>
        <P>{formatNumber(page)}</P>

        <P>{l.of}</P>

        <P>{formatNumber(totalPage) || "?"}</P>
      </HStack>

      <Btn
        iconButton
        clicky={false}
        size={"xs"}
        variant={"ghost"}
        onClick={handleNext}
        disabled={isLastPage}
      >
        <Icon>
          <IconCaretRightFilled />
        </Icon>
      </Btn>
    </HStack>
  );
};
