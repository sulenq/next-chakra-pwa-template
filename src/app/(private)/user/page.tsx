"use client";

import { Btn } from "@/components/ui/btn";
import { MenuItem } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataGrid } from "@/components/widget/DataGrid";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import HScroll from "@/components/widget/HScroll";
import { LucideIcon } from "@/components/widget/Icon";
import {
  PageContainer,
  PageContent,
  PageTitle,
  RESOLVED_NAVS,
} from "@/components/widget/PageShell";
import { RowMenuTooltip } from "@/components/widget/RowOptions";
import { SimpleDisclosure } from "@/components/widget/SimpleDisclosure";
import { TableSkeleton } from "@/components/widget/TableSkeleton";
import { dummyUsers } from "@/constants/dummyData";
import {
  Interface__BatchOptionsTableOptionGenerator,
  Interface__DataProps,
  Interface__RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { useDataDisplay } from "@/context/useDataDisplay";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import { isEmptyArray, last } from "@/utils/array";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { formatDate } from "@/utils/formatter";
import { capitalize, pluckString } from "@/utils/string";
import { isDimensionValid } from "@/utils/style";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { HStack, Icon, useDisclosure } from "@chakra-ui/react";
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
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <>
      <Tooltip content={l.add}>
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
        queryKey="q_user"
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
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    disclosureId(`${ID}-${resolvedData?.id}`),
    open,
    onOpen,
    onClose,
  );
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`Edit ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`Edit ${routeTitle} ${l.successful}`),
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
      <RowMenuTooltip content={"Edit"}>
        <MenuItem value="edit" onClick={onOpen}>
          <AppIcon icon={EditIcon} />
          Edit
        </MenuItem>
      </RowMenuTooltip>

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
              {l.save}
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
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.restore} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.restore} ${routeTitle} ${l.successful}`),
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
    <ConfirmationDisclosureTrigger
      w={"full"}
      id={`${ID}-${restoreIds}`}
      title={`${l.restore} ${routeTitle}`}
      description={l.msg_activate}
      confirmLabel={`${l.restore}`}
      onConfirm={onActivate}
      loading={loading}
      disabled={disabled}
    >
      <RowMenuTooltip content={l.restore}>
        <MenuItem value="restore" disabled={disabled}>
          <AppIcon icon={UndoIcon} />
          {l.restore}
        </MenuItem>
      </RowMenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};
const Delete = (props: any) => {
  const ID = `${PREFIX_ID}_delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.delete_} ${routeTitle} ${l.successful}`),
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
    <ConfirmationDisclosureTrigger
      w={"full"}
      id={`${ID}-${deleteIds}`}
      title={`${l.delete_} ${routeTitle}`}
      description={l.msg_soft_delete}
      confirmLabel={`${l.delete_}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        variant: "outline",
        colorPalette: "gray",
        _hover: {
          color: "fg.error",
        },
      }}
      loading={loading}
      disabled={disabled}
    >
      <RowMenuTooltip content={l.delete_}>
        <MenuItem
          value="delete"
          disabled={disabled}
          _hover={{
            color: "fg.error",
          }}
          transition={"200ms"}
        >
          <AppIcon icon={TrashIcon} />
          {l.delete_}
        </MenuItem>
      </RowMenuTooltip>
    </ConfirmationDisclosureTrigger>
  );
};

const Data = (props: any) => {
  // Props
  const { filter, routeTitle, isSmContainer } = props;

  // Contexts
  const { l } = useLang();
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
  } = useDataState<Interface__Data[]>({
    initialData: dummyUsers,
    url: ``, // TODO fetch data url
    params: {
      search: filter?.search,
      // others params
    },
    dependencies: [filter],
  });
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
            td: formatDate(item.createdAt, l),
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
    ] as Interface__RowOptionsTableOptionGenerator<Interface__Data>[],
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
    ] as Interface__BatchOptionsTableOptionGenerator[],
  };
  const render = {
    loading: <TableSkeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: displayTable ? (
      <DataTable
        headers={dataProps.headers}
        rows={dataProps.rows}
        rowOptions={dataProps.rowOptions}
        batchOptions={dataProps.batchOptions}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.last_page}
      />
    ) : (
      <DataGrid
        data={data}
        dataProps={dataProps}
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPage={pagination?.meta?.last_page}
        renderItem={({
          item,
          row,
          details,
          selectedRows,
          toggleRowSelection,
        }: any) => {
          const resolvedItem: Interface__Data = item;

          return (
            <DataGridItem
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
  const { l } = useLang();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const dimension = useContainerDimension(containerRef);

  // States
  const isValidDimension = isDimensionValid(dimension);
  const isSmContainer = dimension.width < 600;
  const pathname = usePathname();
  const activeNav = getActiveNavs(pathname, RESOLVED_NAVS);
  const routeTitle = pluckString(l, last(activeNav)?.labelKey || "");
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  return (
    <PageContainer ref={containerRef}>
      <PageTitle justify={"space-between"} pr={3}>
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
      </PageTitle>

      {isValidDimension && (
        <PageContent overflow={"auto"}>
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
