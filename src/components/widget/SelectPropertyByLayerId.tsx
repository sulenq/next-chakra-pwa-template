import { SelectInput } from "@/components/ui/select-input";
import { Interface__SelectOption } from "@/constants/interfaces";
import { Props__SelectInput } from "@/constants/props";
import useRequest from "@/hooks/useRequest";
import { capitalizeWords } from "@/utils/string";
import { useEffect, useState } from "react";

interface Props extends Props__SelectInput {
  layerId: number;
}
const SelectPropertyByLayerId = (props: Props) => {
  // Props
  const { layerId, ...restProps } = props;

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
      url: `/api/gis-bpn/workspaces-layers/property/${layerId}`,
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
          const newOptions = r?.data?.data?.properties
            ?.map((property: any) => ({
              id: property,
              label: property,
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
      {...restProps}
    />
  );
};

export default SelectPropertyByLayerId;
