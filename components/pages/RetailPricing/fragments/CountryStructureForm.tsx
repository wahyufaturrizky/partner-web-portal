import React, { useState } from 'react'
import {
  DropdownMenuOptionCustom,
} from "pink-lava-ui";
import { useFetchCountriesStructure } from 'hooks/mdm/country-structure/useCountries';
import useDebounce from 'lib/useDebounce';
import { Controller } from "react-hook-form";

export default function CountryStructureForm(props: any) {

  const [countryStructureList, setCountryStructureList] = useState<any[]>([]);
  const [searchCountryStructure, setSearchCountryStructure] = useState("");
  const debounceFetchLevel = useDebounce(searchCountryStructure, 1000);
  const {
    isFetching: isFetchingCountryStructure,
  } = useFetchCountriesStructure({
    structure_id: props.id,
    query: {
      search: debounceFetchLevel,
    },
    options: {
      onSuccess: (data: any) => {
        const mappedData = data?.rows?.map((group: any) => {
            return {
              value: group.id,
              label: group.name,
              key: group.id
            };
        });
        const flattenArray = [].concat(...mappedData);
        setCountryStructureList(flattenArray);
      }
    },
  });

  const [selectAll, setSelectAll] = useState(false);
  const onSelectAll = (selectAll:boolean) => {
    setSelectAll(selectAll)
    let structure = countryStructureList.map((country: any) => ({
      id: country.key,
      name: country.label
    }))
    if(selectAll){
      props.setValue(props.name, structure)
    }else{
      props.setValue(props.name, [])
    }
  }

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange, value=[] }, fieldState: { error } }) => {
        value = value?.map((value:any) => parseInt(value.id)) || []
        return (
          <DropdownMenuOptionCustom
            label={props.label}
            mode="multiple"
            placeholder="Select Process"
            labelInValue
            filterOption={false}
            value={value}
            isLoading={isFetchingCountryStructure}
            listItems={isFetchingCountryStructure  ? [] : countryStructureList}
            onSearch={(value:any) => {
              setSearchCountryStructure(value);
            }}
            onChange={(value:any) => {
              value = value?.map((value:any) => ({
                id: value.key,
                name: value.label
              })) || []
              onChange(value)
            }}
            valueSelectedItems={value}
            allowClear={true}
            onClear={() => {
              setSearchCountryStructure("");
            }}
            onSelectAll={() => onSelectAll(true)}
            onClearAll={() => onSelectAll(false)}
            selectAll={selectAll}
          />
        )
      }}
    />
  )
}