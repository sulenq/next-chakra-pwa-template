import { Btn } from "@/components/ui/btn";
import { P, TNum } from "@/components/ui/p";
import { StackH } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/branding/app-icon";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { formatNumber } from "@/utils/formatter";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

// -----------------------------------------------------------------

export interface PaginationTableDataProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage?: number;
}

export const Pagination = (props: PaginationTableDataProps) => {
  // Props
  const { page, setPage, totalPage } = props;

  // Stores
  const { t } = useLocaleStore();

  // States
  const isFirstPage = page === 1;
  const isLastPage = page === (totalPage || 1);

  // Utils
  function handlePrev() {
    if (page > 1) setPage((ps) => ps - 1);
  }
  function handleNext() {
    if (page < (totalPage || 1)) setPage((ps) => ps + 1);
  }

  return (
    <StackH align={"center"} gap={2}>
      <Btn
        iconButton
        size={"xs"}
        variant={"ghost"}
        onClick={handlePrev}
        disabled={isFirstPage}
      >
        <AppIconLucide icon={ChevronLeftIcon} />
      </Btn>

      <StackH align={"center"} gap={2} whiteSpace={"nowrap"}>
        <P>
          <TNum>{formatNumber(page)}</TNum>
        </P>

        <P>{t.of}</P>

        <P>
          <TNum>{formatNumber(totalPage) || "?"}</TNum>
        </P>
      </StackH>

      <Btn
        iconButton
        size={"xs"}
        variant={"ghost"}
        onClick={handleNext}
        disabled={isLastPage}
      >
        <AppIconLucide icon={ChevronRightIcon} />
      </Btn>
    </StackH>
  );
};
