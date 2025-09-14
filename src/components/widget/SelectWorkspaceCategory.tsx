import { SelectInput } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput } from "@/constants/props";
import useRequest from "@/hooks/useRequest";
import { capitalizeWords } from "@/utils/string";
import { useEffect, useState } from "react";

const SelectWorkspaceCategory = (props: Props__SelectInput) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const { req, loading } = useRequest({
    id: "select_workspace_category",
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // States
  const [selectOptions, setSelectOptions] =
    useState<Interface__SelectOption[]>();

  // Utils
  function fetch() {
    const config = {
      url: `/api/gis-bpn/master-data/categories/index`,
      method: "GET",
      params: {
        with_trashed: 0,
        limit: Infinity,
      },
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          const newOptions = r?.data?.data?.data
            ?.map((category: any) => ({
              id: category?.id,
              label: category?.label,
            }))
            .sort((a: Interface__SelectOption, b: Interface__SelectOption) =>
              a.label.localeCompare(b.label)
            );
          setSelectOptions(newOptions);
        },
      },
    });
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <SelectInput
      title={capitalizeWords("Properties")}
      loading={loading}
      selectOptions={selectOptions}
      fetch={fetch}
      {...restProps}
    />
  );
};

export default SelectWorkspaceCategory;
