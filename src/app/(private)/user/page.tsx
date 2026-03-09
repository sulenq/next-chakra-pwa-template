"use client";

import { Btn } from "@/components/ui/btn";
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import { DataDisplayToggle } from "@/components/widgets/data-display-toggle";
import { DataGrid } from "@/components/widgets/data-grid";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { HScroll } from "@/components/widgets/h-scroll";
import { LucideIcon } from "@/components/widgets/icon";
import {
  PageContainer,
  PageContent,
  PageHeader,
} from "@/components/widgets/page-shell";
import { SimpleDisclosure } from "@/components/widgets/simple-disclosure";
import { TableSkeleton } from "@/components/widgets/table-skeleton";
import { dummyUsers } from "@/constants/dummyData";
import {
  BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useDataDisplay } from "@/contexts/useDataDisplay";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useFetchData } from "@/hooks/useFetchData";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { useRequest } from "@/hooks/useRequest";
import { isEmptyArray, last } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { isDimensionValid } from "@/utils/style";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { HStack, Icon } from "@chakra-ui/react";
import { useFormik } from "formik";
import {
  ArrowDownAz,
  EditIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";

const BASE_ENDPOINT = ``;
const PREFIX_ID = `user`;
type Interface__Data = any;
const DEFAULT_FILTER = {
  search: "",
};

const Create = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  return (
    <>
      <Tooltip content={t.add}>
        <Btn iconButton size={"sm"} colorPalette={themeConfig.colorPalette}>
          <AppIcon icon={PlusIcon} />
          {/* Add */}
        </Btn>
      </Tooltip>
    </>
  );
};

const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  // TODO use filter state
  console.debug({ filter, setFilter });

  return (
    <HStack w={"full"} {...restProps}>
      <SearchInput
        queryKey="q-user"
        inputProps={{
          size: "sm",
        }}
        minW={"200px"}
      />

      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={ListFilterIcon} />
        </Icon>
      </Btn>
      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={ArrowDownAz} />
        </Icon>
      </Btn>
      <DataDisplayToggle iconButton navKey={PREFIX_ID} size={"sm"} />
    </HStack>
  );
};

const Update = (props: any) => {
  const ID = `${PREFIX_ID}_update`;

  // Props
  const { data, routeTitle } = props;
  const resolvedData = data as Interface__Data;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(`${ID}-${resolvedData?.id}`),
  );

  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Edit ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`Edit ${routeTitle} ${t.successful}`),
    },
  });

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {},
    validationSchema: yup.object().shape({}),
    onSubmit: (values) => {
      console.debug(values);

      back();

      const payload = new FormData();

      const config = {
        url: `${BASE_ENDPOINT}/update/${resolvedData.id}`,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            setRt((ps) => !ps);
          },
        },
      });
    },
  });

  // set initial values
  useEffect(() => {
    formik.setValues({});
  }, [open, resolvedData]);

  return (
    <>
      <Tooltip
        content={"Edit"}
        positioning={{
          placement: "right",
        }}
      >
        <MenuItem value="edit" onClick={onOpen}>
          <AppIcon icon={EditIcon} />
          Edit
        </MenuItem>
      </Tooltip>

      <SimpleDisclosure
        withMaximizeButton
        open={open}
        title={`Edit ${routeTitle}`}
        bodyContent={
          <P my={10} textAlign={"center"}>
            body content here
          </P>
        }
        footerContent={
          <>
            <Btn variant={"outline"}>2nd Btn</Btn>
            <Btn
              type="submit"
              form={ID}
              colorPalette={themeConfig.colorPalette}
              loading={loading}
            >
              {t.save}
            </Btn>
          </>
        }
      />
    </>
  );
};

const Restore = (props: any) => {
  const ID = `${PREFIX_ID}_restore`;

  // Props
  const { restoreIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { t } = useLocale();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${t.restore} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${t.restore} ${routeTitle} ${t.successful}`),
    },
  });

  // Utils
  function onActivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/restore`,
        method: "PATCH",
        data: {
          restoreIds: restoreIds,
        },
      },
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          clearSelectedRows?.();
        },
      },
    });
  }

  return (
    <Confirmation.Trigger
      w={"full"}
      id={`${ID}-${restoreIds}`}
      title={`${t.restore} ${routeTitle}`}
      description={t.msg_activate}
      confirmLabel={`${t.restore}`}
      onConfirm={onActivate}
      loading={loading}
      disabled={disabled}
    >
      <Tooltip
        content={t.restore}
        positioning={{
          placement: "right",
        }}
      >
        <MenuItem value="restore" disabled={disabled}>
          <AppIcon icon={UndoIcon} />
          {t.restore}
        </MenuItem>
      </Tooltip>
    </Confirmation.Trigger>
  );
};

const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { t } = useLocale();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${t.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${t.delete_} ${routeTitle} ${t.successful}`),
    },
  });

  // Utils
  function onDeactivate() {
    back();
    req({
      config: {
        url: `${BASE_ENDPOINT}/delete`,
        method: "DELETE",
        data: {
          deleteIds: deleteIds,
        },
      },
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          clearSelectedRows?.();
        },
      },
    });
  }

  return (
    <Confirmation.Trigger
      w={"full"}
      id={`${ID}-${deleteIds}`}
      title={`${t.delete_} ${routeTitle}`}
      description={t.msg_soft_delete}
      confirmLabel={`${t.delete_}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        colorPalette: "gray",
        variant: "outline",
        color: "fg.error",
      }}
      loading={loading}
      disabled={disabled}
    >
      <Tooltip
        content={t.delete_}
        positioning={{
          placement: "right",
        }}
      >
        <MenuItem
          value="delete"
          disabled={disabled}
          color={"fg.error"}
          transition={"200ms"}
        >
          <AppIcon icon={TrashIcon} />
          {t.delete_}
        </MenuItem>
      </Tooltip>
    </Confirmation.Trigger>
  );
};

const Data = (props: any) => {
  // Props
  const { filter, routeTitle, isSmContainer } = props;

  // Contexts
  const { t } = useLocale();
  const displayMode = useDataDisplay((s) => s.getDisplay(PREFIX_ID));
  const displayTable = displayMode === "table";

  // States
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    page,
    setPage,
    pagination,
  } = useFetchData<Interface__Data[]>({
    initialData: dummyUsers,
    url: ``, // TODO fetch data url
    params: {
      search: filter?.search,
      // others params
    },
    dependencies: [filter],
  });

  // Derived Values
  const dataProps: Interface__DataProps = {
    headers: [
      {
        th: "Name",
        sortable: true,
      },
      {
        th: "Email",
        sortable: true,
      },
      {
        th: "Join Date",
        sortable: true,
      },
    ],
    rows: data?.map((item, idx) => {
      return {
        id: item.id,
        idx: idx,
        data: item,
        dim: !!item.deletedAt,
        columns: [
          {
            td: item.name,
            value: item.name,
          },
          {
            td: item.email,
            value: item.email,
          },
          {
            td: formatDate(item.createdAt, t),
            value: item.createdAt,
            dataType: "date",
          },
        ],
      };
    }),
    rowOptions: [
      (row) => ({
        override: <Update data={row.data} routeTitle={routeTitle} />,
      }),
      (row) => ({
        override: (
          <Restore
            restoreIds={[row.data.id]}
            disabled={!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
      (row) => ({
        override: (
          <Delete
            deleteIds={[row.data.id]}
            disabled={!!row.data.deletedAt}
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as RowOptionsTableOptionGenerator<Interface__Data>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <Restore
            restoreIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => !item.deletedAt)
            }
            routeTitle={routeTitle}
          />
        ),
      }),
      (ids, { clearSelectedRows }) => ({
        override: (
          <Delete
            deleteIds={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={
              isEmptyArray(ids) ||
              data
                ?.filter((item) => ids.includes(item.id))
                .some((item) => !!item.deletedAt)
            }
            routeTitle={routeTitle}
          />
        ),
      }),
    ] as BatchOptionsTableOptionGenerator[],
  };

  // Render State Map
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: displayTable ? (
      <DataTable.Display
        headers={dataProps.headers}
        rows={dataProps.rows}
        rowOptions={dataProps.rowOptions}
        batchOptions={dataProps.batchOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.lastPage}
      />
    ) : (
      <DataGrid.Display
        data={data}
        dataProps={dataProps}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.lastPage}
        gridItem={({
          item,
          row,
          details,
          selectedRows,
          toggleRowSelection,
        }: any) => {
          const resolvedItem: Interface__Data = item;

          return (
            <DataGrid.Item
              key={resolvedItem.id}
              item={{
                id: resolvedItem.id,
                img: imgUrl(resolvedItem.avatar?.[0]?.filePath),
                showImg: true,
                imgFallbackSrc: `${SVGS_PATH}/no-avatar.svg`,
                title: resolvedItem.name,
                description: resolvedItem.email,
              }}
              dataProps={dataProps}
              row={row}
              selectedRows={selectedRows}
              toggleRowSelection={toggleRowSelection}
              routeTitle={routeTitle}
              details={details}
            />
          );
        }}
        mt={isSmContainer ? 3 : 0}
      />
    ),
  };

  return (
    <>
      {initialLoading && render.loading}

      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {(!data || isEmptyArray(data)) && render.empty}
            </>
          )}
        </>
      )}
    </>
  );
};

export default function Page() {
  // Contexts
  const { t } = useLocale();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const dimension = useContainerDimension(containerRef);

  // States
  const isValidDimension = isDimensionValid(dimension);
  const isSmContainer = dimension.width < 600;
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname);
  const routeTitle = pluckString(t, last(activeNav)?.labelKey || "");
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <PageContainer ref={containerRef}>
      <PageHeader justify={"space-between"}>
        <HStack>
          {!isSmContainer && (
            <DataUtils
              filter={filter}
              setFilter={setFilter}
              routeTitle={routeTitle}
            />
          )}

          <Create />
        </HStack>
      </PageHeader>

      {isValidDimension && (
        <PageContent pt={2} overflow={"auto"}>
          {isSmContainer && (
            <HScroll px={3} flexShrink={0}>
              <HStack minW={"full"} justify={"space-between"}>
                <DataUtils
                  filter={filter}
                  setFilter={setFilter}
                  routeTitle={routeTitle}
                />
              </HStack>
            </HScroll>
          )}

          <Data
            filter={filter}
            routeTitle={routeTitle}
            isSmContainer={isSmContainer}
          />
        </PageContent>
      )}
    </PageContainer>
  );
}
