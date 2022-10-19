import React, { useState } from "react";
import { Text, FormSelect } from "pink-lava-ui";
import useDebounce from "lib/useDebounce";
import { useCountryInfiniteLists } from "hooks/mdm/country-structure/useCountries";
import { Controller } from "react-hook-form";
import styled from "styled-components";
import { Spin } from "pink-lava-ui";

const ConditionalFieldCountry = ({ control, workingCalendarData, type }: any) => {
  const [countryList, setCountryList] = useState<any[]>([]);
  const [totalRowsCountryList, setTotalRowsCountryList] = useState(0);
  const [searchCountry, setSearchCountry] = useState("");
  const debounceFetchCountry = useDebounce(searchCountry, 1000);

  const {
    isLoading: isLoadingCountry,
    isFetching: isFetchingCountry,
    isFetchingNextPage: isFetchingMoreCountry,
    hasNextPage: hasNextPageCountry,
    fetchNextPage: fetchNextPageCountry,
  } = useCountryInfiniteLists({
    query: {
      search: debounceFetchCountry,
      limit: 10,
    },
    options: {
      onSuccess: (data: any) => {
        setTotalRowsCountryList(data.pages[0].totalRow);
        const mappedData = data?.pages?.map((group: any) => {
          return group.rows?.map((element: any) => {
            return {
              value: element.id,
              label: element.name,
            };
          });
        });
        const flattenArray = [].concat(...mappedData);
        setCountryList(flattenArray);
      },
      getNextPageParam: (_lastPage: any, pages: any) => {
        if (countryList.length < totalRowsCountryList) {
          return pages.length + 1;
        } else {
          return undefined;
        }
      },
    },
  });

  if (isLoadingCountry && type === "edit")
    return (
      <Center>
        <Spin tip="Loading data..." />
      </Center>
    );

  return (
    <>
      <Text variant="headingRegular">
        Country<span style={{ color: "#EB008B" }}>*</span>
      </Text>
      <Controller
        control={control}
        shouldUnregister={true}
        defaultValue={workingCalendarData?.country ?? ""}
        rules={{ required: true }}
        name="country"
        render={({ field: { onChange }, formState: { errors } }) => (
          <>
            <FormSelect
              defaultValue={workingCalendarData?.country ?? ""}
              style={{ width: "50%" }}
              size={"large"}
              placeholder={"Select"}
              borderColor={"#AAAAAA"}
              arrowColor={"#000"}
              withSearch
              isLoading={isFetchingCountry}
              isLoadingMore={isFetchingMoreCountry}
              fetchMore={() => {
                if (hasNextPageCountry) {
                  fetchNextPageCountry();
                }
              }}
              items={isFetchingCountry && !isFetchingMoreCountry ? [] : countryList}
              onChange={(value: any) => {
                onChange(value);
              }}
              onSearch={(value: any) => {
                setSearchCountry(value);
              }}
            />
            {errors?.country?.type === "required" && (
              <Text variant="alert" color={"red.regular"}>
                This field is required
              </Text>
            )}
          </>
        )}
      />
    </>
  );
};

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ConditionalFieldCountry;
