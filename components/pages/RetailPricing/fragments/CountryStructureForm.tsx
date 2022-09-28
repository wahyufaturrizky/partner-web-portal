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
  const [selectedCountryStructure, setSelectedCountryStructure] = useState([]);
  
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
            };
        });
        const flattenArray = [].concat(...mappedData);
        setCountryStructureList(flattenArray);
      }
    },
  });

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <DropdownMenuOptionCustom
            label={props.label}
            mode="multiple"
            placeholder="Select Process"
            labelInValue
            filterOption={false}
            value={selectedCountryStructure}
            isLoading={isFetchingCountryStructure}
            listItems={isFetchingCountryStructure  ? [] : countryStructureList}
            onSearch={(value:any) => {
              setSearchCountryStructure(value);
            }}
            onChange={(value:any) => {
              onChange(value?.map((data:any) => data.value))
              setSelectedCountryStructure(value)
            }}
            valueSelectedItems={selectedCountryStructure}
            allowClear={true}
            onClear={() => {
              setSearchCountryStructure("");
            }}
          />
        )
      }}
    />
  )
}