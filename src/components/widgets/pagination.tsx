import { Btn } from "@/components/ui/btn";
import { P } from "@/components/ui/p";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { useLocale } from "@/contexts/useLocale";
import { formatNumber } from "@/utils/formatter";
import { HStack } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// -----------------------------------------------------------------

export interface PaginationTableDataProps {
  page: number;
  setPage: React.Dispatch<number>;
  totalPage?: number;
}

export const Pagination = (props: PaginationTableDataProps) => {
  // Props
  const { page, setPage, totalPage } = props;

  // Contexts
  const { t } = useLocale();

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
        <AppIconLucide icon={ChevronLeftIcon} />
      </Btn>

      <HStack whiteSpace={"nowrap"}>
        <P>{formatNumber(page)}</P>

        <P>{t.of}</P>

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
        <AppIconLucide icon={ChevronRightIcon} />
      </Btn>
    </HStack>
  );
};
