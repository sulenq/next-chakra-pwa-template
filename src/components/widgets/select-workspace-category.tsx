import { SelectInput, SelectInputProps } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/shared/constants/interfaces";
import { useRequest } from "@/hooks/useRequest";
import { capitalizeWords } from "@/shared/utils/string";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

const SelectWorkspaceCategory = (props: SelectInputProps) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const { req, loading, error } = useRequest({
    id: "select-workspace-category",
    absoluteUrl: "https://zoo-animal-api.vercel.app/api/animals/rand/10",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  // States
  const [selectOptions, setSelectOptions] =
    useState<Interface__SelectOption[]>();

  // Utils
  function fetch() {
    const config = {
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
          const newOptions = r?.data?.data
            ?.map((item: any) => ({
              id: item?.id,
              label: item?.nama_jabatan,
            }))
            .sort((a: Interface__SelectOption, b: Interface__SelectOption) =>
              a.label.localeCompare(b.label),
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
      error={error}
      fetch={fetch}
      selectOptions={selectOptions}
      {...restProps}
    />
  );
};

export default SelectWorkspaceCategory;

// TODO_DEV delete this component
